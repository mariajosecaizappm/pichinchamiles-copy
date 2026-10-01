import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const mocks = vi.hoisted(() => ({
    axGet: vi.fn(),
    axPost: vi.fn(),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: vi.fn(),
        bind: vi.fn().mockReturnThis(),
        to: vi.fn(),
    },
}))

vi.mock("@/data/provider/axios/axiosPrivate", () => ({
    default: {
        get: mocks.axGet,
        post: mocks.axPost,
    },
}))

describe("TransferRepository", () => {
    beforeEach(() => {
        mocks.axGet.mockReset()
        mocks.axPost.mockReset()
        process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000"
        process.env.NEXT_PUBLIC_PROGRAM_ID = "test-program-id"
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it("should request beneficiary by document with recaptcha headers", async () => {
        vi.resetModules()
        mocks.axGet.mockResolvedValue({
            data: {
                id: "member-1",
                status: "active",
                firstName: "Ana",
                secondName: "",
                firstLastName: "Perez",
                secondLastName: "",
                identificationNumber: "1234567890",
            },
        })

        const { default: TransferRepository } = await import(
            "@/data/repository/Transfer/TransferRepository"
        )
        const repository = new TransferRepository()

        const result = await repository.getBeneficiary(
            "1234567890",
            "GetNameUserIdentification",
            "recaptcha-token"
        )

        expect(mocks.axGet).toHaveBeenCalledWith(
            "/points-transactions-api/test-program-id/users/members/1234567890",
            {
                headers: {
                    Recaptchaaction: "GetNameUserIdentification",
                    Recaptchatoken: "recaptcha-token",
                },
            }
        )
        expect(result).toEqual({
            id: "member-1",
            status: "active",
            firstName: "Ana",
            secondName: "",
            firstLastName: "Perez",
            secondLastName: "",
            identificationNumber: "1234567890",
        })
    })

    it("should request transfer OTP and adapt response", async () => {
        vi.resetModules()
        mocks.axPost.mockResolvedValue({
            data: {
                cellPhone: "0999999999",
                email: "a@b.com",
                durationOtpCodeMinutes: 5,
                mfaToken: "mfa-token",
            },
        })

        const { default: TransferRepository } = await import(
            "@/data/repository/Transfer/TransferRepository"
        )
        const repository = new TransferRepository()

        const result = await repository.getTransferOtp(
            "GetOtpTransferMiles",
            "recaptcha-token",
            "TRANSFER_TRANSACTION"
        )

        expect(mocks.axPost).toHaveBeenCalledWith(
            "/identity-api/test-program-id/users/members/transactions/generate-otp",
            { otpOperationType: "TRANSFER_TRANSACTION" },
            {
                headers: {
                    Recaptchaaction: "GetOtpTransferMiles",
                    Recaptchatoken: "recaptcha-token",
                },
            }
        )
        expect(result).toMatchObject({
            cellPhone: "0999999999",
            email: "a@b.com",
            durationOtpCodeMinutes: 5,
            mfaToken: "mfa-token",
        })
    })

    it("should return null when OTP payload is incomplete", async () => {
        vi.resetModules()
        mocks.axPost.mockResolvedValue({
            data: {
                mfaToken: "",
            },
        })

        const { default: TransferRepository } = await import(
            "@/data/repository/Transfer/TransferRepository"
        )
        const repository = new TransferRepository()

        const result = await repository.getTransferOtp(
            "GetOtpTransferMiles",
            "recaptcha-token",
            "TRANSFER_TRANSACTION"
        )

        expect(result).toBeNull()
    })

    it("should create transfer with kount session", async () => {
        vi.resetModules()
        mocks.axPost.mockResolvedValue({
            data: { balanceAfterOperation: 1000 },
        })

        const { default: TransferRepository } = await import(
            "@/data/repository/Transfer/TransferRepository"
        )
        const repository = new TransferRepository()

        const result = await repository.createTransfer(
            {
                originCurrencyId: "cur-1",
                destinationCurrencyId: "cur-1",
                destinationMemberUserId: "member-2",
                pointsAmount: 100,
                mfaCode: "123456",
                mfaToken: "mfa-token",
            },
            "kount-session"
        )

        expect(mocks.axPost).toHaveBeenCalledWith(
            "/points-transactions-api/test-program-id/transfers",
            {
                originCurrencyId: "cur-1",
                destinationCurrencyId: "cur-1",
                destinationMemberUserId: "member-2",
                pointsAmount: 100,
                mfaCode: "123456",
                mfaToken: "mfa-token",
                sess: "kount-session",
            }
        )
        expect(result).toEqual({ balanceAfterOperation: 1000 })
    })
})
