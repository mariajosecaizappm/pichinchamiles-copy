import { describe, it, expect, beforeEach } from "vitest"
import TokenService from "@/domain/services/TokenService"

describe("TokenService", () => {
  const tokenKey = (TokenService as unknown as { tokenKey: string }).tokenKey

  beforeEach(() => {
    localStorage.clear()
  })

  describe("when getToken is called and storage is empty", () => {
    it("should return null", async () => {
      const token = await TokenService.getToken()
      expect(token).toBeNull()
    })
  })

  describe("when getToken is called and token exists", () => {
    it("should return parsed token payload", async () => {
      const raw = {
        accessToken: "access",
        refreshToken: "refresh",
        refreshTokenExpireDate: "2020-01-01T00:00:00.000Z",
      }
      localStorage.setItem(tokenKey, btoa(JSON.stringify(raw)))

      const token = await TokenService.getToken()

      expect(token).toEqual(raw)
    })
  })

  describe("when setToken is called with token", () => {
    it("should persist base64 encoded JSON", async () => {
      const token = {
        accessToken: "access",
        refreshToken: "refresh",
        refreshTokenExpireDate: new Date("2020-01-01T00:00:00.000Z"),
      }

      await TokenService.setToken(token)

      const stored = localStorage.getItem(tokenKey)
      expect(stored).toBe(btoa(JSON.stringify(token)))
    })
  })

  describe("when clearToken is called", () => {
    it("should remove token from storage", async () => {
      localStorage.setItem(tokenKey, "any")

      await TokenService.clearToken()

      expect(localStorage.getItem(tokenKey)).toBeNull()
    })
  })
})
