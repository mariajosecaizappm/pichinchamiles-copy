import { describe, it, expect, beforeEach, afterEach } from "vitest"
import CookieService from "@/domain/services/CookieService"

function createCookieMock() {
  const cookieStore = new Map<string, string>()
  const rawSetterCalls: string[] = []

  Object.defineProperty(document, "cookie", {
    configurable: true,
    get: () => {
      return Array.from(cookieStore.entries())
        .map(([k, v]) => `${k}=${v}`)
        .join("; ")
    },
    set: (raw: string) => {
      rawSetterCalls.push(raw)
      const firstPart = raw.split(";")[0]
      const eqIndex = firstPart.indexOf("=")
      if (eqIndex !== -1) {
        const name = firstPart.substring(0, eqIndex).trim()
        const value = firstPart.substring(eqIndex + 1)
        if (value === "") {
          cookieStore.delete(name)
        } else {
          cookieStore.set(name, value)
        }
      }
    },
  })

  return {
    rawSetterCalls,
    reset: () => cookieStore.clear(),
    setRawCookies: (pairs: Array<[string, string]>) => {
      cookieStore.clear()
      pairs.forEach(([k, v]) => cookieStore.set(k, v))
    },
  }
}

describe("CookieService", () => {
  const originalEnv = process.env
  let cookieMock: ReturnType<typeof createCookieMock>

  beforeEach(() => {
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_CROSS_NAME_COOKIE = "cross_cookie"
    process.env.NEXT_PUBLIC_CROSS_DOMAIN_COOKIE = "example.com"

    cookieMock = createCookieMock()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe("when setCookie is called with value and expires", () => {
    it("should set cookie string with domain, SameSite=None and secure", () => {
      CookieService.setCookie("abc", "Mon, 01 Jan 2030 00:00:00 GMT")

      expect(cookieMock.rawSetterCalls).toHaveLength(1)
      expect(cookieMock.rawSetterCalls[0]).toBe(
        'cross_cookie=abc;domain=example.com; expires=Mon, 01 Jan 2030 00:00:00 GMT; SameSite=None; path=/;secure',
      )
    })
  })

  describe("when setCookie is called without expires", () => {
    it("should set cookie string with domain, SameSite=None and secure", () => {
      CookieService.setCookie("abc")

      expect(cookieMock.rawSetterCalls).toHaveLength(1)
      expect(cookieMock.rawSetterCalls[0]).toBe(
        'cross_cookie=abc;domain=example.com; expires=undefined; SameSite=None; path=/;secure',
      )
    })
  })

  describe("when setCookie is called with null value", () => {
    it("should not set any cookie", () => {
      CookieService.setCookie(null, "Mon, 01 Jan 2030 00:00:00 GMT")

      expect(cookieMock.rawSetterCalls).toHaveLength(0)
    })
  })

  describe("when setCookie is called with undefined value", () => {
    it("should not set any cookie", () => {
      CookieService.setCookie(undefined, "Mon, 01 Jan 2030 00:00:00 GMT")

      expect(cookieMock.rawSetterCalls).toHaveLength(0)
    })
  })

  describe("when setCookie is called with string 'undefined' value", () => {
    it("should not set any cookie", () => {
      CookieService.setCookie("undefined", "Mon, 01 Jan 2030 00:00:00 GMT")

      expect(cookieMock.rawSetterCalls).toHaveLength(0)
    })
  })

  describe("when setCookie is called with empty string value and expires", () => {
    it("should set cookie to allow deletion", () => {
      CookieService.setCookie("", "Thu, 01 Jan 2000 00:00:00 GMT")

      expect(cookieMock.rawSetterCalls).toHaveLength(1)
      expect(cookieMock.rawSetterCalls[0]).toBe(
        'cross_cookie=;domain=example.com; expires=Thu, 01 Jan 2000 00:00:00 GMT; SameSite=None; path=/;secure',
      )
    })
  })

  describe("when setCookie is called with empty string value and no expires", () => {
    it("should not set any cookie", () => {
      CookieService.setCookie("")

      expect(cookieMock.rawSetterCalls).toHaveLength(0)
    })
  })

  describe("when deleteCookie is called", () => {
    it("should set cookie with empty value and past date", () => {
      CookieService.deleteCookie()

      expect(cookieMock.rawSetterCalls).toHaveLength(1)
      expect(cookieMock.rawSetterCalls[0]).toBe(
        'cross_cookie=;domain=example.com; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; path=/;secure',
      )
    })

    it("should remove existing cookie value", () => {
      CookieService.setCookie("my-token", "Mon, 01 Jan 2030 00:00:00 GMT")
      expect(CookieService.getCookie()).toBe("my-token")

      CookieService.deleteCookie()
      expect(CookieService.getCookie()).toBe("")
    })
  })

  describe("when getCookie is called", () => {
    it("should return cookie value when cookie exists", () => {
      cookieMock.setRawCookies([["cross_cookie", "my-session-token"]])

      const result = CookieService.getCookie()

      expect(result).toBe("my-session-token")
    })

    it("should return empty string when cookie does not exist", () => {
      cookieMock.setRawCookies([["other_cookie", "some-value"]])

      const result = CookieService.getCookie()

      expect(result).toBe("")
    })

    it("should return empty string when no cookies are set", () => {
      const result = CookieService.getCookie()

      expect(result).toBe("")
    })

    it("should find cookie among multiple cookies", () => {
      cookieMock.setRawCookies([
        ["a", "1"],
        ["cross_cookie", "target-value"],
        ["b", "2"],
      ])

      const result = CookieService.getCookie()

      expect(result).toBe("target-value")
    })

    it("should return empty string when env cookie name is not set", () => {
      delete process.env.NEXT_PUBLIC_CROSS_NAME_COOKIE
      cookieMock.setRawCookies([["cross_cookie", "value"]])

      const result = CookieService.getCookie()

      expect(result).toBe("")
    })

    it("should return value after setCookie is called", () => {
      CookieService.setCookie("hello-world", "Mon, 01 Jan 2030 00:00:00 GMT")

      const result = CookieService.getCookie()

      expect(result).toBe("hello-world")
    })

    it("should handle cookie value with special characters", () => {
      CookieService.setCookie("token=abc&xyz=123", "Mon, 01 Jan 2030 00:00:00 GMT")

      const result = CookieService.getCookie()

      expect(result).toBe("token=abc&xyz=123")
    })
  })
})
