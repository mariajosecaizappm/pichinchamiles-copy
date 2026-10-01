import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"

const mocks = vi.hoisted(() => ({
    memberInformationAdapter: vi.fn(),
    memberOtpInformationAdapter: vi.fn(),
    axGet: vi.fn(),
    axPost: vi.fn(),
    axPatch: vi.fn(),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: vi.fn(),
        bind: vi.fn().mockReturnThis(),
        to: vi.fn(),
    },
}))

vi.mock("@/data/adapters/Member/memberAdapter", () => ({
    memberInformationAdapter: mocks.memberInformationAdapter,
    memberOtpInformationAdapter: mocks.memberOtpInformationAdapter,
}))

vi.mock("@/data/provider/axios/axiosPrivate", () => ({
    default: {
        get: mocks.axGet,
        post: mocks.axPost,
        patch: mocks.axPatch,
    },
}))

describe("MemberRepository", () => {
    beforeEach(() => {
        mocks.memberInformationAdapter.mockReset()
        mocks.memberOtpInformationAdapter.mockReset()
        mocks.axGet.mockReset()
        mocks.axPost.mockReset()
        mocks.axPatch.mockReset()
        process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000"
        process.env.NEXT_PUBLIC_PROGRAM_ID = "test-program-id"
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when getMember is called", () => {
        it("should request member profile and adapt response", async () => {
            vi.resetModules()
            const apiMember = {
                memberType: "personal",
                identification: "default-id",
                city: "QUITO",
                country: "ECUADOR",
                state: "PICHINCHA",
                registrationDate: "2026-01-01T00:00:00.000Z",
                segments: [],
            }
            const adaptedMember = {memberType: "PERSONAL"} as any

            mocks.axGet.mockResolvedValueOnce({ data: apiMember })
            mocks.memberInformationAdapter.mockReturnValueOnce(adaptedMember)

            const {default: MemberRepository} = await import(
                "@/data/repository/Member/MemberRepository"
            )
            const repository = new MemberRepository()

            const result = await repository.getMember()

            const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id"
            expect(mocks.axGet).toHaveBeenCalledWith(
                `/identity-api/${programId}/users/members/me`,
            )
            expect(mocks.memberInformationAdapter).toHaveBeenCalledWith(apiMember)
            expect(result).toBe(adaptedMember)
        })
    })

    describe("when getMemberBalance is called", () => {
        it("should request balance and return total field", async () => {
            vi.resetModules()
            mocks.axGet.mockResolvedValueOnce({ data: { total: 1234 } })

            const {default: MemberRepository} = await import(
                "@/data/repository/Member/MemberRepository"
            )
            const repository = new MemberRepository()

            const result = await repository.getMemberBalance("points-id")

            const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id"
            expect(mocks.axGet).toHaveBeenCalledWith(
                `/points-transactions-api/${programId}/users/members/balances/points-id`,
            )
            expect(result).toBe(1234)
        })
    })

    describe("when updateLopd is called", () => {
        it("should send acceptLopd and site with recaptcha headers", async () => {
            vi.resetModules()
            const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id"
            const acceptLopd = true
            const site = "web"
            const recaptchaAction = "updateLopd"
            const recaptchaToken = "recaptcha-token"

            mocks.axPost.mockResolvedValueOnce({})

            const {default: MemberRepository} = await import(
                "@/data/repository/Member/MemberRepository"
            )
            const repository = new MemberRepository()

            const result = await repository.updateLopd(
                acceptLopd,
                site,
                recaptchaAction,
                recaptchaToken,
            )

            expect(mocks.axPost).toHaveBeenCalledWith(
                `/identity-api/${programId}/users/members/lopd`,
                { acceptLopd, site },
                {
                    headers: {
                        Recaptchaaction: recaptchaAction,
                        Recaptchatoken: recaptchaToken,
                    },
                },
            )
            expect(result).toBeUndefined()
        })
    })

    describe("when validateOtpUpdateInformation is called", () => {
        it("should post adapted payload with recaptcha headers", async () => {
            vi.resetModules()
            const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id"
            const memberSecurityUpdate = {
                mfaCode: "123456",
                mfaToken: "token-abc",
                enrollmentEmail: "user@example.com",
            }
            const adaptedPayload = {
                mfaCode: "123456",
                mfaToken: "token-abc",
                address: { alias: "Home" },
            }
            const recaptchaAction = "validateOtp"
            const recaptchaToken = "recaptcha-token"

            mocks.memberOtpInformationAdapter.mockReturnValueOnce(adaptedPayload)
            mocks.axPost.mockResolvedValueOnce({})

            const {default: MemberRepository} = await import(
                "@/data/repository/Member/MemberRepository"
            )
            const repository = new MemberRepository()

            await repository.validateOtpUpdateInformation(
                memberSecurityUpdate,
                recaptchaAction,
                recaptchaToken,
            )

            expect(mocks.memberOtpInformationAdapter).toHaveBeenCalledWith(memberSecurityUpdate)
            expect(mocks.axPost).toHaveBeenCalledWith(
                `/identity-api/${programId}/users/members/me/validate-otp`,
                adaptedPayload,
                {
                    headers: {
                        Recaptchaaction: recaptchaAction,
                        Recaptchatoken: recaptchaToken,
                    },
                },
            )
        })
    })

    describe("when updateMember is called", () => {
        it("should patch member security update with recaptcha headers and return data", async () => {
            vi.resetModules()
            const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id"
            const memberSecurityUpdate = {
                password: "new-password",
                enrollmentEmail: "new@example.com",
            }
            const responseData = {
                cellPhone: "+593999999999",
                durationOtpCodeMinutes: 5,
                email: "new@example.com",
                mfaToken: "mfa-token",
            }
            const recaptchaAction = "updateMember"
            const recaptchaToken = "recaptcha-token"

            mocks.axPatch.mockResolvedValueOnce({ data: responseData })

            const {default: MemberRepository} = await import(
                "@/data/repository/Member/MemberRepository"
            )
            const repository = new MemberRepository()

            const result = await repository.updateMember(
                memberSecurityUpdate,
                recaptchaAction,
                recaptchaToken,
            )

            expect(mocks.axPatch).toHaveBeenCalledWith(
                `/identity-api/${programId}/users/members/me`,
                memberSecurityUpdate,
                {
                    headers: {
                        Recaptchaaction: recaptchaAction,
                        Recaptchatoken: recaptchaToken,
                    },
                },
            )
            expect(result).toEqual({
                cellPhone: responseData.cellPhone,
                durationOtpCodeMinutes: responseData.durationOtpCodeMinutes,
                email: responseData.email,
                mfaToken: responseData.mfaToken,
                expirationDate: expect.any(Date),
            })
        })
    })
})
