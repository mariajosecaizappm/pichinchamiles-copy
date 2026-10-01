import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest, NextResponse } from "next/server"
import { middleware, config } from "@/middleware"
import * as sessionCookieModule from "@/domain/entity/Session/sessionCookie"

describe("middleware", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("config", () => {
        it("should have correct matcher pattern", () => {
            expect(config.matcher).toEqual([
                "/((?!_next/static|_next/image|favicon.ico|fonts|icons|public|api/search).*)",
            ])
        })
    })

    describe("middleware function", () => {
        it("should not set a new session_id cookie if one already exists in request", () => {
            const mockRequest = {
                cookies: {
                    get: vi.fn().mockImplementation((name: string) => {
                        if (name === sessionCookieModule.SESSION_COOKIE_NAME) {
                            return { value: "existing-session-token-123" }
                        }
                        return undefined
                    }),
                },
            } as unknown as NextRequest

            const mockResponseCookiesSet = vi.fn()
            const mockResponse = {
                cookies: {
                    set: mockResponseCookiesSet,
                },
            }

            const nextSpy = vi.spyOn(NextResponse, "next").mockReturnValue(mockResponse as any)
            const generateSpy = vi.spyOn(sessionCookieModule, "generateSessionId")

            const response = middleware(mockRequest)

            expect(nextSpy).toHaveBeenCalledWith({ request: mockRequest })
            expect(mockRequest.cookies.get).toHaveBeenCalledWith(sessionCookieModule.SESSION_COOKIE_NAME)
            expect(generateSpy).not.toHaveBeenCalled()
            expect(mockResponseCookiesSet).not.toHaveBeenCalled()
            expect(response).toBe(mockResponse)
        })

        it("should generate and set session_id cookie if none exists in request", () => {
            const mockRequest = {
                cookies: {
                    get: vi.fn().mockReturnValue(undefined),
                },
            } as unknown as NextRequest

            const mockResponseCookiesSet = vi.fn()
            const mockResponse = {
                cookies: {
                    set: mockResponseCookiesSet,
                },
            }

            const nextSpy = vi.spyOn(NextResponse, "next").mockReturnValue(mockResponse as any)
            const generateSpy = vi.spyOn(sessionCookieModule, "generateSessionId").mockReturnValue("new-generated-uuid-999")

            const response = middleware(mockRequest)

            expect(nextSpy).toHaveBeenCalledWith({ request: mockRequest })
            expect(mockRequest.cookies.get).toHaveBeenCalledWith(sessionCookieModule.SESSION_COOKIE_NAME)
            expect(generateSpy).toHaveBeenCalled()
            expect(mockResponseCookiesSet).toHaveBeenCalledWith(
                sessionCookieModule.SESSION_COOKIE_NAME,
                "new-generated-uuid-999",
                {
                    path: "/",
                    maxAge: 31536000,
                    sameSite: "lax",
                    httpOnly: false,
                },
            )
            expect(response).toBe(mockResponse)
        })
    })
})
