import { describe, expect, it, vi } from "vitest"
import DeleteMemberAddressUseCase from "@/domain/interactors/Address/DeleteMemberAddressUseCase"

describe("DeleteMemberAddressUseCase", () => {
    it("should delegate deleteMemberAddress to repository", async () => {
        const addressRepository = {
            deleteMemberAddress: vi.fn().mockResolvedValue(undefined),
        }

        const useCase = new DeleteMemberAddressUseCase(addressRepository as any)
        await useCase.deleteMemberAddress("addr-1")

        expect(addressRepository.deleteMemberAddress).toHaveBeenCalledTimes(1)
        expect(addressRepository.deleteMemberAddress).toHaveBeenCalledWith("addr-1")
    })

    it("should propagate repository errors", async () => {
        const addressRepository = {
            deleteMemberAddress: vi.fn().mockRejectedValue(new Error("delete failed")),
        }

        const useCase = new DeleteMemberAddressUseCase(addressRepository as any)

        await expect(useCase.deleteMemberAddress("addr-1")).rejects.toThrow("delete failed")
    })
})
