import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
    SESSION_COOKIE_NAME,
    isBrowser,
    generateSessionId,
    getSessionCookieFromBrowser,
    setSessionCookieInBrowser,
    getOrCreateSessionCookieInBrowser,
    runWithSessionId,
    getSessionIdFromServerStore,
    getCurrentSessionId,
} from "@/domain/entity/Session/sessionCookie"

describe("sessionCookie", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Reset document cookie in jsdom
        if (typeof document !== "undefined") {
            Object.defineProperty(document, "cookie", {
                writable: true,
                value: "",
            })
        }
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    describe("SESSION_COOKIE_NAME", () => {
        it("should be 'session_id'", () => {
            expect(SESSION_COOKIE_NAME).toBe("session_id")
        })
    })

    describe("isBrowser", () => {
        it("should return true when window and document are defined", () => {
            expect(isBrowser()).toBe(true)
        })

        it("should return false when window is undefined", () => {
            vi.stubGlobal("window", undefined)
            expect(isBrowser()).toBe(false)
        })

        it("should return false when document is undefined", () => {
            vi.stubGlobal("document", undefined)
            expect(isBrowser()).toBe(false)
        })
    })

    describe("generateSessionId", () => {
        it("should return a UUID using global crypto when available", () => {
            const uuid = generateSessionId()
            expect(typeof uuid).toBe("string")
            expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
        })

        it("should fall back to UUID generator when global crypto is undefined", () => {
            vi.stubGlobal("crypto", undefined)
            const uuid = generateSessionId()
            expect(typeof uuid).toBe("string")
            expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
        })

        it("should fall back to UUID generator when crypto.randomUUID is not a function", () => {
            vi.stubGlobal("crypto", {})
            const uuid = generateSessionId()
            expect(typeof uuid).toBe("string")
            expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
        })
    })

    describe("getSessionCookieFromBrowser", () => {
        it("should return null when not in browser", () => {
            vi.stubGlobal("window", undefined)
            expect(getSessionCookieFromBrowser()).toBeNull()
        })

        it("should return null when cookie is empty", () => {
            document.cookie = ""
            expect(getSessionCookieFromBrowser()).toBeNull()
        })

        it("should return null when session_id cookie is not present", () => {
            document.cookie = "other_cookie=123; user_theme=dark"
            expect(getSessionCookieFromBrowser()).toBeNull()
        })

        it("should return the decoded session cookie value when present", () => {
            document.cookie = "session_id=test-session-123"
            expect(getSessionCookieFromBrowser()).toBe("test-session-123")
        })

        it("should correctly extract session_id among multiple cookies", () => {
            document.cookie = "auth_token=abc; session_id=my-session-uuid-456; theme=light"
            expect(getSessionCookieFromBrowser()).toBe("my-session-uuid-456")
        })

        it("should decode URI-encoded session_id cookie values", () => {
            document.cookie = "session_id=encrypted%2Ftoken%2B123%3D"
            expect(getSessionCookieFromBrowser()).toBe("encrypted/token+123=")
        })
    })

    describe("setSessionCookieInBrowser", () => {
        it("should do nothing when not in browser", () => {
            vi.stubGlobal("window", undefined)
            expect(() => setSessionCookieInBrowser("new-session-id")).not.toThrow()
        })

        it("should set document.cookie with correct attributes and URI encoding", () => {
            setSessionCookieInBrowser("session+id/123==")
            expect(document.cookie).toContain("session_id=session%2Bid%2F123%3D%3D")
            expect(document.cookie).toContain("path=/")
            expect(document.cookie).toContain("SameSite=Lax")
            expect(document.cookie).toContain("max-age=31536000")
        })
    })

    describe("getOrCreateSessionCookieInBrowser", () => {
        it("should return existing cookie if present without generating new", () => {
            document.cookie = "session_id=existing-session-id"
            const sid = getOrCreateSessionCookieInBrowser()
            expect(sid).toBe("existing-session-id")
        })

        it("should generate a new session ID and set the cookie when none exists", () => {
            document.cookie = ""
            const sid = getOrCreateSessionCookieInBrowser()
            expect(sid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
            expect(getSessionCookieFromBrowser()).toBe(sid)
        })
    })

    describe("runWithSessionId and getSessionIdFromServerStore", () => {
        it("should return null from getSessionIdFromServerStore when outside runWithSessionId", () => {
            expect(getSessionIdFromServerStore()).toBeNull()
        })

        it("should provide sessionId to getSessionIdFromServerStore within runWithSessionId context", () => {
            const result = runWithSessionId("server-sid-123", () => {
                return getSessionIdFromServerStore()
            })
            expect(result).toBe("server-sid-123")
        })

        it("should restore previous context after execution", () => {
            runWithSessionId("server-sid-abc", () => {
                expect(getSessionIdFromServerStore()).toBe("server-sid-abc")
            })
            expect(getSessionIdFromServerStore()).toBeNull()
        })
    })

    describe("getCurrentSessionId", () => {
        it("should return sessionId from AsyncLocalStorage store if present", async () => {
            const sid = await runWithSessionId("als-stored-sid", async () => {
                return await getCurrentSessionId()
            })
            expect(sid).toBe("als-stored-sid")
        })

        it("should return browser session cookie if running in browser and no ALS store", async () => {
            document.cookie = "session_id=browser-sid-789"
            const sid = await getCurrentSessionId()
            expect(sid).toBe("browser-sid-789")
        })

        it("should create a new browser session cookie if running in browser with no cookie", async () => {
            document.cookie = ""
            const sid = await getCurrentSessionId()
            expect(sid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
            expect(getSessionCookieFromBrowser()).toBe(sid)
        })

        it("should read from next/headers cookies on server environment if available", async () => {
            vi.stubGlobal("window", undefined)
            vi.stubGlobal("document", undefined)

            vi.doMock("next/headers", () => ({
                cookies: async () => ({
                    get: (name: string) => (name === SESSION_COOKIE_NAME ? { value: "next-header-cookie-sid" } : undefined),
                }),
            }))

            const sid = await getCurrentSessionId()
            expect(sid).toBe("next-header-cookie-sid")
            vi.doUnmock("next/headers")
        })

        it("should generate a fallback session ID on server if next/headers throws", async () => {
            vi.stubGlobal("window", undefined)
            vi.stubGlobal("document", undefined)

            vi.doMock("next/headers", () => ({
                cookies: async () => {
                    throw new Error("Next headers not available outside request context")
                },
            }))

            const sid = await getCurrentSessionId()
            expect(sid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
            vi.doUnmock("next/headers")
        })
    })
})
