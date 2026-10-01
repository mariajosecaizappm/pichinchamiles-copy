import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import AuthServiceUv from "@/domain/services/AuthServiceUV"

function stubWindowLocation(fullUrl: string) {
  const parsed = new URL(fullUrl)
  const originalLocation = window.location
  let replacedLocation = false

  const locationLike = {
    href: parsed.href,
    search: parsed.search,
    pathname: parsed.pathname,
    hostname: parsed.hostname,
    protocol: parsed.protocol,
    port: parsed.port,
    hash: parsed.hash,
    host: parsed.host,
    origin: parsed.origin,
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    toString: () => parsed.href,
  }

  try {
    const hrefSpy = vi.spyOn(window.location, "href", "get").mockReturnValue(parsed.href)
    const searchSpy = vi.spyOn(window.location, "search", "get").mockReturnValue(parsed.search)
    return {
      restore: () => {
        hrefSpy.mockRestore()
        searchSpy.mockRestore()
      },
    }
  } catch {
    replacedLocation = true
    Object.defineProperty(window, "location", { value: locationLike, writable: true })
    return {
      restore: () => {
        if (replacedLocation) {
          Object.defineProperty(window, "location", { value: originalLocation, writable: true })
        }
      },
    }
  }
}

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

describe("AuthServiceUv", () => {
  const originalEnv = process.env
  let cookieMock: ReturnType<typeof createCookieMock>
  let openSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_CROSS_NAME_COOKIE = "cross_cookie"
    process.env.NEXT_PUBLIC_CROSS_DOMAIN_COOKIE = "example.com"

    ;(AuthServiceUv as unknown as { referrer: string }).referrer = ""

    cookieMock = createCookieMock()
    openSpy = vi.spyOn(window, "open").mockImplementation(() => null)
  })

  afterEach(() => {
    process.env = originalEnv
    openSpy.mockRestore()
  })

  describe("when LoginUv is called", () => {
    it("should set cookie with UTC expiration", () => {
      const expires = new Date("2030-01-01T00:00:00.000Z")
      const locStub = stubWindowLocation("https://app.example.com/?flow=login")
      Object.defineProperty(document, "referrer", { configurable: true, value: "" })

      AuthServiceUv.LoginUv("cookie-value", expires)

      locStub.restore()
      expect(cookieMock.rawSetterCalls).toHaveLength(1)
      expect(cookieMock.rawSetterCalls[0]).toBe(
        `cross_cookie=cookie-value;domain=example.com; expires=${expires.toUTCString()}; SameSite=None; path=/;secure`,
      )
    })

    it("should save referrer when document.referrer is not empty", () => {
      const expires = new Date("2030-01-01T00:00:00.000Z")
      const locStub = stubWindowLocation("https://app.example.com/dashboard")
      Object.defineProperty(document, "referrer", {
        configurable: true,
        value: "https://app.example.com/previous",
      })

      AuthServiceUv.LoginUv("cookie-value", expires)

      locStub.restore()
      expect((AuthServiceUv as unknown as { referrer: string }).referrer).toBe(
        "https://app.example.com/previous",
      )
    })

    it("should keep previous referrer when document.referrer is empty on subsequent calls", () => {
      const expires = new Date("2030-01-01T00:00:00.000Z")

      const firstLoc = stubWindowLocation("https://app.example.com/page1")
      Object.defineProperty(document, "referrer", {
        configurable: true,
        value: "https://app.example.com/landing",
      })
      AuthServiceUv.LoginUv("first", expires)
      firstLoc.restore()

      const secondLoc = stubWindowLocation("https://app.example.com/page2")
      Object.defineProperty(document, "referrer", {
        configurable: true,
        value: "",
      })
      AuthServiceUv.LoginUv("second", expires)
      secondLoc.restore()

      expect((AuthServiceUv as unknown as { referrer: string }).referrer).toBe(
        "https://app.example.com/landing",
      )
    })
  })

  describe("when LoginUv is called and referrer exists and current URL is login", () => {
    it("should navigate back to referrer", () => {
      const expires = new Date("2030-01-01T00:00:00.000Z")
      const locStub = stubWindowLocation("https://app.example.com/?flow=login")
      Object.defineProperty(document, "referrer", {
        configurable: true,
        value: "https://app.example.com/previous",
      })

      AuthServiceUv.LoginUv("cookie-value", expires)

      locStub.restore()
      expect(openSpy).toHaveBeenCalledTimes(1)
      expect(openSpy).toHaveBeenCalledWith("https://app.example.com/previous", "_self")
    })
  })

  describe("when LoginUv is called and referrer equals current URL", () => {
    it("should not navigate back", () => {
      const expires = new Date("2030-01-01T00:00:00.000Z")
      const locStub = stubWindowLocation("https://app.example.com/?flow=login")
      Object.defineProperty(document, "referrer", {
        configurable: true,
        value: "https://app.example.com/?flow=login",
      })

      AuthServiceUv.LoginUv("cookie-value", expires)

      locStub.restore()
      expect(openSpy).not.toHaveBeenCalled()
    })
  })

  describe("when LoginUv is called and current URL is not login flow", () => {
    it("should not navigate back even if referrer exists", () => {
      const expires = new Date("2030-01-01T00:00:00.000Z")
      const locStub = stubWindowLocation("https://app.example.com/dashboard")
      Object.defineProperty(document, "referrer", {
        configurable: true,
        value: "https://app.example.com/previous",
      })

      AuthServiceUv.LoginUv("cookie-value", expires)

      locStub.restore()
      expect(openSpy).not.toHaveBeenCalled()
    })

    it("should not navigate when flow param has a different value", () => {
      const expires = new Date("2030-01-01T00:00:00.000Z")
      const locStub = stubWindowLocation("https://app.example.com/?flow=register")
      Object.defineProperty(document, "referrer", {
        configurable: true,
        value: "https://app.example.com/previous",
      })

      AuthServiceUv.LoginUv("cookie-value", expires)

      locStub.restore()
      expect(openSpy).not.toHaveBeenCalled()
    })
  })

  describe("when LoginUv is called with referrer but no flow param", () => {
    it("should not navigate back when flow is missing from URL", () => {
      const expires = new Date("2030-01-01T00:00:00.000Z")
      const locStub = stubWindowLocation("https://app.example.com/home")
      Object.defineProperty(document, "referrer", {
        configurable: true,
        value: "https://app.example.com/previous",
      })

      AuthServiceUv.LoginUv("cookie-value", expires)

      locStub.restore()
      expect(openSpy).not.toHaveBeenCalled()
    })
  })

  describe("when CloseSession is called", () => {
    it("should set cookie with empty value and past expires date to delete it", () => {
      AuthServiceUv.CloseSession()

      expect(cookieMock.rawSetterCalls).toHaveLength(1)
      expect(cookieMock.rawSetterCalls[0]).toBe(
        'cross_cookie=;domain=example.com; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; path=/;secure',
      )
    })
  })

  describe("when isCookiePresent is called", () => {
    it("should return true when cookie exists with value", () => {
      cookieMock.setRawCookies([["cross_cookie", "valid-session-token"]])

      const result = AuthServiceUv.isCookiePresent()

      expect(result).toBe(true)
    })

    it("should return false when cookie does not exist", () => {
      cookieMock.setRawCookies([["other_cookie", "some-value"]])

      const result = AuthServiceUv.isCookiePresent()

      expect(result).toBe(false)
    })

    it("should return false when no cookies are set", () => {
      const result = AuthServiceUv.isCookiePresent()

      expect(result).toBe(false)
    })

    it("should return false when cookie value is empty string", () => {
      cookieMock.setRawCookies([["cross_cookie", ""]])

      const result = AuthServiceUv.isCookiePresent()

      expect(result).toBe(false)
    })

    it("should return false when cookie value is only whitespace", () => {
      cookieMock.setRawCookies([["cross_cookie", "   "]])

      const result = AuthServiceUv.isCookiePresent()

      expect(result).toBe(false)
    })

    it("should return true after LoginUv sets the cookie", () => {
      const expires = new Date("2030-01-01T00:00:00.000Z")
      const locStub = stubWindowLocation("https://app.example.com/dashboard")
      Object.defineProperty(document, "referrer", { configurable: true, value: "" })

      AuthServiceUv.LoginUv("active-session", expires)
      locStub.restore()

      const result = AuthServiceUv.isCookiePresent()
      expect(result).toBe(true)
    })

    it("should return false after CloseSession deletes the cookie", () => {
      cookieMock.setRawCookies([["cross_cookie", "session-to-clear"]])
      expect(AuthServiceUv.isCookiePresent()).toBe(true)

      AuthServiceUv.CloseSession()

      const result = AuthServiceUv.isCookiePresent()
      expect(result).toBe(false)
    })
  })
})
