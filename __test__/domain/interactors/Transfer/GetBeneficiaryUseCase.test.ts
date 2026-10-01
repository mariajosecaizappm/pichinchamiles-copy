import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const mocks = vi.hoisted(() => ({
    getToken: vi.fn(),
}))

vi.mock("@/domain/services/RecaptchaService", () => ({
    default: {
        getToken: mocks.getToken,
    },
}))

import GetBeneficiaryUseCase from "@/domain/interactors/Transfer/GetBeneficiaryUseCase"

describe("GetBeneficiaryUseCase", () => {
    beforeEach(() => {
        mocks.getToken.mockReset()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it("requests recaptcha token and delegates to repository", async () => {
        mocks.getToken.mockResolvedValueOnce("recaptcha-token")

        const beneficiary = {
            id: "member-1",
            status: "active",
            firstName: "Ana",
            secondName: "",
            firstLastName: "Perez",
            secondLastName: "",
            identificationNumber: "1234567890",
        }

        const transferRepository = {
            getBeneficiary: vi.fn().mockResolvedValue(beneficiary),
        }

        const useCase = new GetBeneficiaryUseCase(transferRepository as never)
        const result = await useCase.execute("1234567890")

        expect(mocks.getToken).toHaveBeenCalledWith("GetNameUserIdentification")
        expect(transferRepository.getBeneficiary).toHaveBeenCalledWith(
            "1234567890",
            "GetNameUserIdentification",
            "recaptcha-token"
        )
        expect(result).toEqual(beneficiary)
    })
})
