import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"

const mocks = vi.hoisted(() => {
    const encryptText = vi.fn()
    const setToken = vi.fn()
    const loginUv = vi.fn()
    const setSessionCookieInBrowser = vi.fn()
    return {encryptText, setToken, loginUv, setSessionCookieInBrowser}
})

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

import ActivationUseCase from "@/domain/interactors/Auth/ActivationUseCase"

describe("ActivationUseCase", () => {
    beforeEach(() => {
        mocks.encryptText.mockReset()
        mocks.setToken.mockReset()
        mocks.loginUv.mockReset()
        mocks.setSessionCookieInBrowser.mockReset()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when verifyOtp is called", () => {
        it("should encrypt identification and call repository returning activation token", async () => {
            mocks.encryptText.mockResolvedValueOnce("encrypted-id")

            const authRepository = {
                verifyActivationOtp: vi.fn().mockResolvedValue("activation-token"),
            }
            const encryptionService = {
                encryptText: mocks.encryptText,
            }

            const useCase = new ActivationUseCase(authRepository as any, encryptionService as any)

            const result = await useCase.verifyOtp(
                "1234567890",
                "mfa-token",
                "123456",
            )

            expect(mocks.encryptText).toHaveBeenCalledWith("1234567890")
            expect(authRepository.verifyActivationOtp).toHaveBeenCalledWith(
                "encrypted-id",
                "123456",
                "mfa-token",
            )
            expect(result).toBe("activation-token")
        })
    })

    describe("when verifyOtp repository throws", () => {
        it("should propagate the error", async () => {
            mocks.encryptText.mockResolvedValueOnce("encrypted-id")

            const authRepository = {
                verifyActivationOtp: vi.fn().mockRejectedValue(new Error("boom")),
            }
            const encryptionService = {
                encryptText: mocks.encryptText,
            }

            const useCase = new ActivationUseCase(authRepository as any, encryptionService as any)

            await expect(
                useCase.verifyOtp("1234567890", "mfa-token", "123456"),
            ).rejects.toThrow("boom")
        })
    })

    describe("when activateAccount is called", () => {
        it("should encrypt sensitive fields, activate account, persist token and set session cookie", async () => {
            mocks.encryptText
                .mockResolvedValueOnce("encrypted-id")
                .mockResolvedValueOnce("encrypted-password")
                .mockResolvedValueOnce("encrypted-id-cookie")

            const cookie = "cookie"
            const token = {
                accessToken: "access-token",
                refreshToken: "refresh-token",
                refreshTokenExpireDate: new Date("2030-01-01T00:00:00.000Z"),
            }

            const authRepository = {
                activeAccount: vi.fn().mockResolvedValue({token, cookie}),
            }
            const encryptionService = {
                encryptText: mocks.encryptText,
            }

            mocks.setToken.mockResolvedValueOnce(undefined)

            const useCase = new ActivationUseCase(authRepository as any, encryptionService as any)

            const args = {
                acceptedLopd: true,
                acceptedTermsAndCondition: true,
                activeAccountToken: "active-account-token",
                identificationNumber: "1234567890",
                password: "plain-password",
                mfaToken: "mfa-token",
                mfaCode: "123456",
            }

            await useCase.activateAccount(args)

            expect(mocks.encryptText).toHaveBeenNthCalledWith(
                1,
                "1234567890",
            )
            expect(mocks.encryptText).toHaveBeenNthCalledWith(
                2,
                "plain-password",
            )
            expect(authRepository.activeAccount).toHaveBeenCalledWith({
                ...args,
                identificationNumber: "encrypted-id",
                password: "encrypted-password",
            })
            expect(mocks.setToken).toHaveBeenCalledWith(token)
            expect(mocks.loginUv).toHaveBeenCalledWith(cookie, token.refreshTokenExpireDate)
        })
    })

    describe("when activateAccount repository throws", () => {
        it("should propagate the error and not persist token", async () => {
            mocks.encryptText
                .mockResolvedValueOnce("encrypted-id")
                .mockResolvedValueOnce("encrypted-password")

            const authRepository = {
                activeAccount: vi.fn().mockRejectedValue(new Error("boom")),
            }
            const encryptionService = {
                encryptText: mocks.encryptText,
            }

            const useCase = new ActivationUseCase(authRepository as any, encryptionService as any)

            const args = {
                acceptedLopd: true,
                acceptedTermsAndCondition: true,
                activeAccountToken: "active-account-token",
                identificationNumber: "1234567890",
                password: "plain-password",
                mfaToken: "mfa-token",
                mfaCode: "123456",
            }

            await expect(useCase.activateAccount(args)).rejects.toThrow("boom")
            expect(mocks.setToken).not.toHaveBeenCalled()
            expect(mocks.loginUv).not.toHaveBeenCalled()
        })
    })

    describe("when activateAccount persists token fails", () => {
        it("should propagate the error", async () => {
            mocks.encryptText
                .mockResolvedValueOnce("encrypted-id")
                .mockResolvedValueOnce("encrypted-password")

            const cookie = "cookie"
            const token = {
                accessToken: "access-token",
                refreshToken: "refresh-token",
                refreshTokenExpireDate: new Date("2030-01-01T00:00:00.000Z"),
            }

            const authRepository = {
                activeAccount: vi.fn().mockResolvedValue({token, cookie}),
            }
            const encryptionService = {
                encryptText: mocks.encryptText,
            }

            mocks.setToken.mockRejectedValueOnce(new Error("boom"))

            const useCase = new ActivationUseCase(authRepository as any, encryptionService as any)

            const args = {
                acceptedLopd: true,
                acceptedTermsAndCondition: true,
                activeAccountToken: "active-account-token",
                identificationNumber: "1234567890",
                password: "plain-password",
                mfaToken: "mfa-token",
                mfaCode: "123456",
            }

            await expect(useCase.activateAccount(args)).rejects.toThrow("boom")
            expect(mocks.loginUv).not.toHaveBeenCalled()
        })
    })
})
