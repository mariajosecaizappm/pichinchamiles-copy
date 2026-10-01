import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import {AuthFlow} from "@/domain/entity/Auth/auth"

const mocks = vi.hoisted(() => {
    const getToken = vi.fn()
    const encryptText = vi.fn()
    return {getToken, encryptText}
})

vi.mock("@/domain/services/RecaptchaService", () => ({
    default: {
        getToken: mocks.getToken,
    },
}))

import OnboardingUseCase from "@/domain/interactors/Auth/OnboardingUseCase"

describe("OnboardingUseCase", () => {
    beforeEach(() => {
        mocks.getToken.mockReset()
        mocks.encryptText.mockReset()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when verifyIdentification is called", () => {
        it("should request recaptcha token, encrypt identification and call repository", async () => {
            mocks.getToken.mockResolvedValueOnce("recaptcha-token")
            mocks.encryptText.mockResolvedValueOnce("encrypted-id")

            const authRepository = {
                verifyMemberIdentification: vi.fn().mockResolvedValue({
                    flow: AuthFlow.LOGIN,
                }),
            }
            const encryptionService = {
                encryptText: mocks.encryptText,
            }

            const useCase = new OnboardingUseCase(authRepository as any, encryptionService as any)

            const result = await useCase.verifyIdentification("1234567890")

            expect(mocks.getToken).toHaveBeenCalledWith("verifyIdentification")
            expect(mocks.encryptText).toHaveBeenCalledWith("1234567890")
            expect(authRepository.verifyMemberIdentification).toHaveBeenCalledWith(
                "encrypted-id",
                "verifyIdentification",
                "recaptcha-token",
            )
            expect(result).toEqual({flow: AuthFlow.LOGIN})
        })
    })

    describe("when repository throws", () => {
        it("should propagate the error", async () => {
            mocks.getToken.mockResolvedValueOnce("recaptcha-token")
            mocks.encryptText.mockResolvedValueOnce("encrypted-id")

            const authRepository = {
                verifyMemberIdentification: vi
                    .fn()
                    .mockRejectedValue(new Error("boom")),
            }
            const encryptionService = {
                encryptText: mocks.encryptText,
            }

            const useCase = new OnboardingUseCase(authRepository as any, encryptionService as any)

            await expect(
                useCase.verifyIdentification("1234567890"),
            ).rejects.toThrow("boom")
        })
    })
})
