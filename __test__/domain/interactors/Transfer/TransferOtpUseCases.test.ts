import { describe, it, expect, vi, beforeEach } from "vitest"
import { Otp } from "@/domain/entity/Otp/otp"

const mocks = vi.hoisted(() => ({
    getTransferOtp: vi.fn(),
    createTransfer: vi.fn(),
    getToken: vi.fn(),
}))

vi.mock("@/domain/services/RecaptchaService", () => ({
    default: {
        getToken: mocks.getToken,
    },
}))

describe("GetGenerateOtpTransferUseCase", () => {
    beforeEach(() => {
        mocks.getTransferOtp.mockReset()
        mocks.getToken.mockReset()
        mocks.getToken.mockResolvedValue("recaptcha-token")
    })

    it("requests transfer OTP with recaptcha and TRANSFER_TRANSACTION", async () => {
        const otp: Otp = {
            cellPhone: "099",
            email: null,
            durationOtpCodeMinutes: 5,
            mfaToken: "token",
        }
        mocks.getTransferOtp.mockResolvedValue(otp)

        const { default: GetGenerateOtpTransferUseCase } = await import(
            "@/domain/interactors/Transfer/GetGenerateOtpTransferUseCase"
        )
        const useCase = new GetGenerateOtpTransferUseCase({
            getBeneficiary: vi.fn(),
            getTransferOtp: mocks.getTransferOtp,
            createTransfer: mocks.createTransfer,
        })

        const result = await useCase.execute()

        expect(mocks.getToken).toHaveBeenCalledWith("GetOtpTransferMiles")
        expect(mocks.getTransferOtp).toHaveBeenCalledWith(
            "GetOtpTransferMiles",
            "recaptcha-token",
            "TRANSFER_TRANSACTION"
        )
        expect(result).toEqual(otp)
    })

    it("returns null when repository has no OTP challenge", async () => {
        mocks.getTransferOtp.mockResolvedValue(null)

        const { default: GetGenerateOtpTransferUseCase } = await import(
            "@/domain/interactors/Transfer/GetGenerateOtpTransferUseCase"
        )
        const useCase = new GetGenerateOtpTransferUseCase({
            getBeneficiary: vi.fn(),
            getTransferOtp: mocks.getTransferOtp,
            createTransfer: mocks.createTransfer,
        })

        await expect(useCase.execute()).resolves.toBeNull()
    })
})

describe("CreateTransferUseCase", () => {
    beforeEach(() => {
        mocks.createTransfer.mockReset()
    })

    it("delegates create transfer to repository", async () => {
        mocks.createTransfer.mockResolvedValue({ balanceAfterOperation: 50 })

        const { default: CreateTransferUseCase } = await import(
            "@/domain/interactors/Transfer/CreateTransferUseCase"
        )
        const useCase = new CreateTransferUseCase({
            getBeneficiary: vi.fn(),
            getTransferOtp: mocks.getTransferOtp,
            createTransfer: mocks.createTransfer,
        })

        const params = {
            originCurrencyId: "c1",
            destinationCurrencyId: "c1",
            destinationMemberUserId: "m2",
            pointsAmount: 10,
        }

        const result = await useCase.execute(params, "kount")

        expect(mocks.createTransfer).toHaveBeenCalledWith(params, "kount")
        expect(result).toEqual({ balanceAfterOperation: 50 })
    })
})
