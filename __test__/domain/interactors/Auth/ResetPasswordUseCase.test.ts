import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"

const mocks = vi.hoisted(() => {
    const getToken = vi.fn()
    const encryptText = vi.fn()
    const setToken = vi.fn()
    const loginUv = vi.fn()
    return {getToken, encryptText, setToken, loginUv}
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

import ResetPasswordUseCase from "@/domain/interactors/Auth/ResetPasswordUseCase"

describe("ResetPasswordUseCase", () => {
    beforeEach(() => {
        mocks.getToken.mockReset()
        mocks.encryptText.mockReset()
        mocks.setToken.mockReset()
        mocks.loginUv.mockReset()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when getOtp is called", () => {
        it("should request recaptcha token with ForgotPassword and call repository to get OTP", async () => {
            const identificationNumber = "1717171717"
            const otp = {
                cellPhone: "0999999999",
                durationOtpCodeMinutes: 5,
                email: "test@example.com",
                mfaToken: "mfa-token",
            }

            const authRepository = {
                getResetPasswordOtp: vi.fn().mockResolvedValueOnce(otp),
            }
            const encryptionService = {
                encryptText: mocks.encryptText,
            }

            mocks.getToken.mockResolvedValueOnce("recaptcha-token")

            const useCase = new ResetPasswordUseCase(authRepository as any, encryptionService as any)
            const result = await useCase.getOtp(identificationNumber)

            expect(mocks.getToken).toHaveBeenCalledWith("ForgotPassword")
            expect(authRepository.getResetPasswordOtp).toHaveBeenCalledWith(
                "1717171717",
                "ForgotPassword",
                "recaptcha-token",
            )
            expect(result).toEqual(otp)
        })
    })

    describe("when verifyOtp is called", () => {
        it("should encrypt identification and call repository returning reset token", async () => {
            const identificationNumber = "1717171717"
            const otpCode = "123456"
            const otpToken = "otp-token"
            const resetToken = "reset-token"

            const authRepository = {
                verifyResetPasswordOtp: vi
                    .fn()
                    .mockResolvedValueOnce(resetToken),
            }
            const encryptionService = {
                encryptText: mocks.encryptText,
            }

            mocks.encryptText.mockImplementation(async (value: string) => `enc(${value})`)

            const useCase = new ResetPasswordUseCase(authRepository as any, encryptionService as any)
            const result = await useCase.verifyOtp(
                identificationNumber,
                otpCode,
                otpToken,
            )

            expect(mocks.encryptText).toHaveBeenCalledTimes(1)
            expect(mocks.encryptText).toHaveBeenCalledWith(identificationNumber)
            expect(authRepository.verifyResetPasswordOtp).toHaveBeenCalledWith(
                "enc(1717171717)",
                "123456",
                "otp-token",
            )
            expect(result).toBe(resetToken)
        })

        it("should propagate repository errors", async () => {
            const authRepository = {
                verifyResetPasswordOtp: vi
                    .fn()
                    .mockRejectedValueOnce(new Error("boom")),
            }
            const encryptionService = {
                encryptText: mocks.encryptText,
            }
            mocks.encryptText.mockResolvedValueOnce("enc-id")

            const useCase = new ResetPasswordUseCase(authRepository as any, encryptionService as any)

            await expect(
                useCase.verifyOtp("1717171717", "123456", "otp-token"),
            ).rejects.toThrow("boom")
        })
    })

    describe("when resetPassword is called", () => {
        it("should encrypt password, call repository with encrypted password, and set token", async () => {
            const identification = "1717171717"
            const mfaRequest = {mfaToken: "mfa", mfaCode: "123456"}
            const resetPasswordToken = "reset-token"
            const password = "plain-pass"

            const cookie = "cookie"
            const token = {
                accessToken: "access-token",
                refreshToken: "refresh-token",
                refreshTokenExpireDate: new Date("2030-01-01T00:00:00.000Z"),
            }

            const authRepository = {
                resetPassword: vi.fn().mockResolvedValueOnce({token, cookie}),
            }
            const encryptionService = {
                encryptText: mocks.encryptText,
            }

            mocks.encryptText.mockImplementation(async (value: string) => `enc(${value})`)

            const useCase = new ResetPasswordUseCase(authRepository as any, encryptionService as any)
            await useCase.resetPassword(
                identification,
                mfaRequest as any,
                resetPasswordToken,
                password,
            )

            expect(mocks.encryptText).toHaveBeenCalledTimes(1)
            expect(mocks.encryptText).toHaveBeenCalledWith(password)
            expect(authRepository.resetPassword).toHaveBeenCalledWith(
                identification,
                mfaRequest,
                resetPasswordToken,
                "enc(plain-pass)",
            )
            expect(mocks.setToken).toHaveBeenCalledWith(token)
            expect(mocks.loginUv).toHaveBeenCalledWith(cookie, token.refreshTokenExpireDate)
        })

        it("should propagate repository errors", async () => {
            const authRepository = {
                resetPassword: vi.fn().mockRejectedValueOnce(new Error("boom")),
            }
            const encryptionService = {
                encryptText: mocks.encryptText,
            }
            mocks.encryptText.mockResolvedValueOnce("enc-pass")

            const useCase = new ResetPasswordUseCase(authRepository as any, encryptionService as any)

            await expect(
                useCase.resetPassword(
                    "1717171717",
                    {mfaToken: "mfa", mfaCode: "123456"} as any,
                    "reset-token",
                    "plain-pass",
                ),
            ).rejects.toThrow("boom")
            expect(mocks.setToken).not.toHaveBeenCalled()
            expect(mocks.loginUv).not.toHaveBeenCalled()
        })
    })
})
