import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"

const mocks = vi.hoisted(() => {
    const getRecaptchaToken = vi.fn()
    const skipLopd = vi.fn()
    const isSkippedLopd = vi.fn()
    const clearPreferences = vi.fn()
    return {getRecaptchaToken, skipLopd, isSkippedLopd, clearPreferences}
})

vi.mock("@/domain/services/RecaptchaService", () => ({
    default: {
        getToken: mocks.getRecaptchaToken,
    },
}))

vi.mock("@/domain/services/LopdPreferencesService", () => ({
    default: {
        skipLopd: mocks.skipLopd,
        isSkippedLopd: mocks.isSkippedLopd,
        clearPreferences: mocks.clearPreferences,
    },
}))

import UpdateLopdUseCase from "@/domain/interactors/Auth/UpdateLopdUseCase"

describe("UpdateLopdUseCase", () => {
    const createUseCase = () => {
        const memberRepository = {
            updateLopd: vi.fn().mockResolvedValue(undefined),
        }
        const apigeeRepository = {
            updateConsent: vi.fn().mockResolvedValue(undefined),
        }
        return {
            useCase: new UpdateLopdUseCase(
                memberRepository as any,
                apigeeRepository as any,
            ),
            memberRepository,
            apigeeRepository,
        }
    }

    beforeEach(() => {
        mocks.getRecaptchaToken.mockReset()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when updateLopd is called and member has not accepted lopd", () => {
        it("should request recaptcha token and update member lopd", async () => {
            const {useCase, memberRepository, apigeeRepository} = createUseCase()
            const member = {acceptLopd: false} as any

            mocks.getRecaptchaToken.mockResolvedValueOnce("recaptcha-token")

            await useCase.updateLopd(member, "cif-123", null, true)

            expect(mocks.getRecaptchaToken).toHaveBeenCalledWith("UpdateLopd")
            expect(memberRepository.updateLopd).toHaveBeenCalledWith(
                true,
                "web",
                "UpdateLopd",
                "recaptcha-token",
            )
            expect(apigeeRepository.updateConsent).not.toHaveBeenCalled()
        })
    })

    describe("when updateLopd is called and member has accepted lopd", () => {
        it("should not call member lopd update", async () => {
            const {useCase, memberRepository} = createUseCase()
            const member = {acceptLopd: true} as any

            await useCase.updateLopd(member, "cif-123", null, true)

            expect(mocks.getRecaptchaToken).not.toHaveBeenCalled()
            expect(memberRepository.updateLopd).not.toHaveBeenCalled()
        })

        it("should update consent when consent exists", async () => {
            const {useCase, memberRepository, apigeeRepository} = createUseCase()
            const member = {acceptLopd: true} as any
            const consent = {
                url: "https://example.com/lopd.pdf",
                hasConsent: false,
                acceptedTermsConditions: false,
            }

            await useCase.updateLopd(member, "cif-123", consent as any, true)

            expect(mocks.getRecaptchaToken).not.toHaveBeenCalled()
            expect(memberRepository.updateLopd).not.toHaveBeenCalled()
            expect(apigeeRepository.updateConsent).toHaveBeenCalledWith({
                ...consent,
                cif: "cif-123",
                hasConsent: true,
                acceptedTermsConditions: true,
                action: "update",
            })
        })
    })

    describe("when updateLopd is called and consent hasConsent is null", () => {
        it("should set action as register", async () => {
            const {useCase, apigeeRepository} = createUseCase()
            const member = {acceptLopd: true} as any
            const consent = {
                url: "https://example.com/lopd.pdf",
                hasConsent: null,
                acceptedTermsConditions: false,
            }

            await useCase.updateLopd(member, "cif-123", consent as any, false)

            expect(apigeeRepository.updateConsent).toHaveBeenCalledWith({
                ...consent,
                cif: "cif-123",
                hasConsent: false,
                acceptedTermsConditions: true,
                action: "register",
            })
        })
    })

    describe("when skipLopd is called", () => {
        it("should call LopdPreferencesService.skipLopd", async () => {
            const {useCase} = createUseCase()
            await useCase.skipLopd("123", 60)
            expect(mocks.skipLopd).toHaveBeenCalledWith("123", 60)
        })
    })

    describe("when isSkippedLopd is called", () => {
        it("should call LopdPreferencesService.isSkippedLopd", async () => {
            const {useCase} = createUseCase()
            mocks.isSkippedLopd.mockResolvedValue(true)
            const result = await useCase.isSkippedLopd("123")
            expect(mocks.isSkippedLopd).toHaveBeenCalledWith("123")
            expect(result).toBe(true)
        })
    })

    describe("when clearLopdPreference is called", () => {
        it("should call LopdPreferencesService.clearPreferences", () => {
            const {useCase} = createUseCase()
            useCase.clearLopdPreference()
            expect(mocks.clearPreferences).toHaveBeenCalledTimes(1)
        })
    })

    describe("when updateMemberAcceptLopd is called", () => {
        it("should request recaptcha token and call memberRepository.updateLopd with acceptedLopd=true", async () => {
            const {useCase, memberRepository, apigeeRepository} = createUseCase()

            mocks.getRecaptchaToken.mockResolvedValueOnce("recaptcha-token")

            await useCase.updateMemberAcceptLopd(true)

            expect(mocks.getRecaptchaToken).toHaveBeenCalledWith("UpdateLopd")
            expect(memberRepository.updateLopd).toHaveBeenCalledWith(
                true,
                "web",
                "UpdateLopd",
                "recaptcha-token",
            )
            expect(apigeeRepository.updateConsent).not.toHaveBeenCalled()
        })

        it("should request recaptcha token and call memberRepository.updateLopd with acceptedLopd=false", async () => {
            const {useCase, memberRepository} = createUseCase()

            mocks.getRecaptchaToken.mockResolvedValueOnce("recaptcha-token-2")

            await useCase.updateMemberAcceptLopd(false)

            expect(mocks.getRecaptchaToken).toHaveBeenCalledWith("UpdateLopd")
            expect(memberRepository.updateLopd).toHaveBeenCalledWith(
                false,
                "web",
                "UpdateLopd",
                "recaptcha-token-2",
            )
        })
    })
})
