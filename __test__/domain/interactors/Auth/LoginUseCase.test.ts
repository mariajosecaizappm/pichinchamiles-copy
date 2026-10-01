import {describe, it, expect, vi, beforeEach} from "vitest"

const mocks = vi.hoisted(() => {
    const getToken = vi.fn()
    const encryptText = vi.fn()
    const setToken = vi.fn()
    const loginUv = vi.fn()
    const setSessionCookieInBrowser = vi.fn()
    return {getToken, encryptText, setToken, loginUv, setSessionCookieInBrowser}
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

vi.mock("@/domain/entity/Session/sessionCookie", () => ({
    setSessionCookieInBrowser: mocks.setSessionCookieInBrowser,
}))

import LoginUseCase from "@/domain/interactors/Auth/LoginUseCase"

describe("LoginUseCase", () => {
    beforeEach(() => {
        mocks.getToken.mockReset()
        mocks.encryptText.mockReset()
        mocks.setToken.mockReset()
        mocks.loginUv.mockReset()
        mocks.setSessionCookieInBrowser.mockReset()
    })

    describe("when getOtp is called", () => {
        it("should request recaptcha token, encrypt credentials and call repository to get OTP", async () => {
            const identificationNumber = "1717171717"
            const password = "pass-123"
            const otp = {
                cellPhone: "0999999999",
                durationOtpCodeMinutes: 5,
                email: "test@example.com",
                mfaToken: "mfa-token",
            }

            const authRepository = {
                getLoginOtp: vi.fn().mockResolvedValueOnce(otp),
            }
            const encryptionService = {
                encryptText: mocks.encryptText,
            }

            mocks.getToken.mockResolvedValueOnce("recaptcha-token")
            mocks.encryptText.mockImplementation(async (value: string) => `enc(${value})`)

            const useCase = new LoginUseCase(authRepository as any, encryptionService as any)
            const result = await useCase.getOtp(identificationNumber, password)

            expect(mocks.getToken).toHaveBeenCalledWith("UserAndPassLogin")
            expect(mocks.encryptText).toHaveBeenCalledTimes(2)
            expect(mocks.encryptText).toHaveBeenCalledWith(identificationNumber)
            expect(mocks.encryptText).toHaveBeenCalledWith(password)
            expect(authRepository.getLoginOtp).toHaveBeenCalledWith(
                "enc(1717171717)",
                "enc(pass-123)",
                "UserAndPassLogin",
                "recaptcha-token"
            )
            expect(result).toEqual(otp)
        })
    })

    describe("when verifyLoginOtp is called", () => {
        it("should encrypt inputs, verify OTP in repository and persist token", async () => {
            const identificationNumber = "1717171717"
            const otpCode = "123456"
            const otpToken = "otp-token"
            const cookie = "cookie"
            const token = {
                accessToken: "access-token",
                refreshToken: "refresh-token",
                refreshTokenExpireDate: new Date("2030-01-01T00:00:00.000Z"),
            }

            const authRepository = {
                verifyLoginOtp: vi.fn().mockResolvedValueOnce({token, cookie}),
            }
            const encryptionService = {
                encryptText: mocks.encryptText,
            }

            mocks.encryptText.mockImplementation(async (value: string) => `enc(${value})`)
            mocks.setToken.mockResolvedValueOnce(undefined)

            const useCase = new LoginUseCase(authRepository as any, encryptionService as any)
            await useCase.verifyLoginOtp(identificationNumber, otpCode, otpToken)

            expect(mocks.encryptText).toHaveBeenCalledTimes(3)
            expect(mocks.encryptText).toHaveBeenCalledWith(identificationNumber)
            expect(mocks.encryptText).toHaveBeenCalledWith(otpCode)
            expect(mocks.encryptText).toHaveBeenCalledWith(otpToken)
            expect(authRepository.verifyLoginOtp).toHaveBeenCalledWith(
                "enc(1717171717)",
                "enc(123456)",
                "enc(otp-token)"
            )
            expect(mocks.setToken).toHaveBeenCalledWith(token)
            expect(mocks.loginUv).toHaveBeenCalledWith(cookie, token.refreshTokenExpireDate)
        })
    })
})
