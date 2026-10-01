import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { Address } from "@/domain/entity/Address/structure/address"
import { MemberSecurityUpdate } from "@/domain/entity/Member/member"
import { Otp } from "@/domain/entity/Otp/otp"

const mocks = vi.hoisted(() => {
    const getToken = vi.fn()
    const encryptText = vi.fn()
    return { getToken, encryptText }
})

vi.mock("@/domain/services/RecaptchaService", () => ({
    default: {
        getToken: mocks.getToken,
    },
}))

import UpdateMemberUseCase from "@/domain/interactors/Member/UpdateMemberUseCase"

const createEncryptionService = () => ({
    encryptText: mocks.encryptText,
    decryptText: vi.fn(),
})

const createUseCase = (memberRepository: object) =>
    new UpdateMemberUseCase(memberRepository as any, createEncryptionService() as any)

const mockAddress: Address = {
    id: "addr-1",
    alias: "Casa",
    street1: "Av. Principal",
    street2: "Calle Secundaria",
    country: { id: "1", name: "Ecuador", grade: "country", parentId: null },
    state: { id: "2", name: "Pichincha", grade: "state", parentId: "1" },
    city: { id: "3", name: "Quito", grade: "city", parentId: "2" },
    zone: { id: "4", name: "Centro", grade: "zone", parentId: "3" },
    number: "100",
    reference: "Frente al parque",
    isThirdPartyAddress: false,
    customerReceivingFirstName: "Juan",
    customerReceivingLastName: "Pérez",
    customerReceivingEmail: "juan@example.com",
    customerReceivingPhone: "0999999999",
    customerReceivingIdentificationNumber: "1234567890",
    customerReceivingIdentificationType: "CI",
    secondPhone: "0988888888",
    postalCode: "170101",
    default: true,
}

describe("UpdateMemberUseCase", () => {
    beforeEach(() => {
        mocks.getToken.mockReset()
        mocks.encryptText.mockReset()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("validateOtpUpdateInformation", () => {
        it("should request recaptcha token and call repository without encrypting when no credentials present", async () => {
            mocks.getToken.mockResolvedValueOnce("recaptcha-token")

            const memberSecurityUpdate: MemberSecurityUpdate = {
                mfaCode: "123456",
                mfaToken: "mfa-token",
            }

            const memberRepository = {
                validateOtpUpdateInformation: vi.fn().mockResolvedValue(undefined),
                updateMember: vi.fn(),
            }

            const useCase = createUseCase(memberRepository)
            await useCase.validateOtpUpdateInformation(memberSecurityUpdate)

            expect(mocks.getToken).toHaveBeenCalledWith("UpdateInformation")
            expect(mocks.encryptText).not.toHaveBeenCalled()
            expect(memberRepository.validateOtpUpdateInformation).toHaveBeenCalledWith(
                memberSecurityUpdate,
                "UpdateInformation",
                "recaptcha-token",
            )
        })

        it("should pass password and enrollmentEmail without encrypting before calling repository", async () => {
            mocks.getToken.mockResolvedValueOnce("recaptcha-token")

            const memberSecurityUpdate: MemberSecurityUpdate = {
                password: "secret",
                enrollmentEmail: "user@example.com",
                mfaCode: "123456",
                mfaToken: "mfa-token",
            }

            const memberRepository = {
                validateOtpUpdateInformation: vi.fn().mockResolvedValue(undefined),
                updateMember: vi.fn(),
            }

            const useCase = createUseCase(memberRepository)
            await useCase.validateOtpUpdateInformation(memberSecurityUpdate)

            expect(mocks.encryptText).not.toHaveBeenCalled()
            expect(memberRepository.validateOtpUpdateInformation).toHaveBeenCalledWith(
                memberSecurityUpdate,
                "UpdateInformation",
                "recaptcha-token",
            )
        })

        it("should not encrypt fields when password and enrollmentEmail are absent", async () => {
            mocks.getToken.mockResolvedValueOnce("recaptcha-token")

            const memberSecurityUpdate: MemberSecurityUpdate = {
                mfaCode: "654321",
                mfaToken: "mfa-token-2",
            }

            const memberRepository = {
                validateOtpUpdateInformation: vi.fn().mockResolvedValue(undefined),
                updateMember: vi.fn(),
            }

            const useCase = createUseCase(memberRepository)
            await useCase.validateOtpUpdateInformation(memberSecurityUpdate)

            expect(mocks.encryptText).not.toHaveBeenCalled()
            expect(memberRepository.validateOtpUpdateInformation).toHaveBeenCalledWith(
                memberSecurityUpdate,
                "UpdateInformation",
                "recaptcha-token",
            )
        })

        it("should propagate repository errors", async () => {
            mocks.getToken.mockResolvedValueOnce("recaptcha-token")

            const memberRepository = {
                validateOtpUpdateInformation: vi
                    .fn()
                    .mockRejectedValue(new Error("otp validation failed")),
                updateMember: vi.fn(),
            }

            const useCase = createUseCase(memberRepository)

            await expect(
                useCase.validateOtpUpdateInformation({ mfaCode: "000000" }),
            ).rejects.toThrow("otp validation failed")
        })
    })

    describe("updateMember", () => {
        it("should update acceptedTermsAndCondition without encrypting fields", async () => {
            mocks.getToken.mockResolvedValueOnce("recaptcha-token")

            const memberSecurityUpdate: MemberSecurityUpdate = {
                acceptedTermsAndCondition: true,
            }

            const updateResult: Otp = {
                cellPhone: null,
                durationOtpCodeMinutes: null,
                email: null,
                mfaToken: null,
            }

            const memberRepository = {
                validateOtpUpdateInformation: vi.fn(),
                updateMember: vi.fn().mockResolvedValue(updateResult),
            }

            const useCase = createUseCase(memberRepository)
            const result = await useCase.updateMember(memberSecurityUpdate)

            expect(mocks.getToken).toHaveBeenCalledWith("UpdateInformation")
            expect(mocks.encryptText).not.toHaveBeenCalled()
            expect(memberRepository.updateMember).toHaveBeenCalledWith(
                memberSecurityUpdate,
                "UpdateInformation",
                "recaptcha-token",
            )
            expect(result).toEqual(updateResult)
        })

        it("should encrypt password and enrollmentEmail before calling repository", async () => {
            mocks.getToken.mockResolvedValueOnce("recaptcha-token")
            mocks.encryptText
                .mockResolvedValueOnce("encrypted-password")
                .mockResolvedValueOnce("encrypted-email")

            const memberSecurityUpdate: MemberSecurityUpdate = {
                password: "secret",
                enrollmentEmail: "user@example.com",
                isAddress: true,
                address: mockAddress,
            }

            const updateResult: Otp = {
                cellPhone: "0999999999",
                durationOtpCodeMinutes: 5,
                email: null,
                mfaToken: "mfa-token",
            }

            const memberRepository = {
                validateOtpUpdateInformation: vi.fn(),
                updateMember: vi.fn().mockResolvedValue(updateResult),
            }

            const useCase = createUseCase(memberRepository)
            const result = await useCase.updateMember(memberSecurityUpdate)

            expect(mocks.getToken).toHaveBeenCalledWith("UpdateInformation")
            expect(mocks.encryptText).toHaveBeenCalledWith("secret")
            expect(mocks.encryptText).toHaveBeenCalledWith("user@example.com")
            expect(memberRepository.updateMember).toHaveBeenCalledWith(
                {
                    ...memberSecurityUpdate,
                    password: "encrypted-password",
                    enrollmentEmail: "encrypted-email",
                },
                "UpdateInformation",
                "recaptcha-token",
            )
            expect(result).toEqual(updateResult)
        })

        it("should not encrypt fields when password and enrollmentEmail are absent", async () => {
            mocks.getToken.mockResolvedValueOnce("recaptcha-token")

            const memberSecurityUpdate: MemberSecurityUpdate = {
                mfaCode: "123456",
                mfaToken: "mfa-token",
            }

            const updateResult: Otp = {
                cellPhone: null,
                durationOtpCodeMinutes: 5,
                email: "user@example.com",
                mfaToken: "new-mfa-token",
            }

            const memberRepository = {
                validateOtpUpdateInformation: vi.fn(),
                updateMember: vi.fn().mockResolvedValue(updateResult),
            }

            const useCase = createUseCase(memberRepository)
            const result = await useCase.updateMember(memberSecurityUpdate)

            expect(mocks.encryptText).not.toHaveBeenCalled()
            expect(memberRepository.updateMember).toHaveBeenCalledWith(
                memberSecurityUpdate,
                "UpdateInformation",
                "recaptcha-token",
            )
            expect(result).toEqual(updateResult)
        })

        it("should propagate repository errors", async () => {
            mocks.getToken.mockResolvedValueOnce("recaptcha-token")

            const memberRepository = {
                validateOtpUpdateInformation: vi.fn(),
                updateMember: vi.fn().mockRejectedValue(new Error("update failed")),
            }

            const useCase = createUseCase(memberRepository)

            await expect(useCase.updateMember({ password: "secret" })).rejects.toThrow(
                "update failed",
            )
        })
    })
})
