import {describe, it, expect, vi, beforeEach} from "vitest"

const mocks = vi.hoisted(() => {
    const getToken = vi.fn()
    const setToken = vi.fn()
    const loginUv = vi.fn()
    return {getToken, setToken, loginUv}
})

vi.mock("@/domain/services/RecaptchaService", () => ({
    default: {
        getToken: mocks.getToken,
    },
}))

vi.mock("@/domain/services/TokenService", () => ({
    default: {
        setToken: mocks.setToken,
    },
}))

vi.mock("@/domain/services/AuthServiceUV", () => ({
    default: {
        LoginUv: mocks.loginUv,
    },
}))

import RefreshTokenUseCase from "@/domain/interactors/Auth/RefreshTokenUseCase"

describe("RefreshTokenUseCase", () => {
    beforeEach(() => {
        mocks.getToken.mockReset()
        mocks.setToken.mockReset()
        mocks.loginUv.mockReset()
    })

    describe("when refresh is called", () => {
        it("should request recaptcha token, refresh repository token, persist token and login UV", async () => {
            const refreshToken = "refresh-token"
            const cookie = "cookie-value"
            const token = {
                accessToken: "access-token",
                refreshToken,
                refreshTokenExpireDate: new Date("2030-01-01T00:00:00.000Z"),
            }

            const authRepository = {
                refreshToken: vi.fn().mockResolvedValue({token, cookie}),
            }

            mocks.getToken.mockResolvedValueOnce("recaptcha-token")

            const useCase = new RefreshTokenUseCase(authRepository as any)
            const result = await useCase.refresh()

            expect(mocks.getToken).toHaveBeenCalledWith("RefreshToken")
            expect(authRepository.refreshToken).toHaveBeenCalledWith("recaptcha-token", "RefreshToken")
            expect(mocks.setToken).toHaveBeenCalledWith(token)
            expect(mocks.loginUv).toHaveBeenCalledWith(cookie, token.refreshTokenExpireDate)
            expect(result).toEqual(token)
        })
    })
})

