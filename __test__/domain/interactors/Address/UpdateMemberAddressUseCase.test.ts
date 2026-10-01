import { describe, expect, it, vi } from "vitest"
import UpdateMemberAddressUseCase from "@/domain/interactors/Address/UpdateMemberAddressUseCase"
import { Address } from "@/domain/entity/Address/structure/address"

const mockAddress: Address = {
    id: "addr-1",
    alias: "Oficina",
    street1: "Av. Amazonas",
    street2: "Naciones Unidas",
    country: { id: "1", name: "Ecuador", grade: "country", parentId: null },
    state: { id: "2", name: "Pichincha", grade: "state", parentId: "1" },
    city: { id: "3", name: "Quito", grade: "city", parentId: "2" },
    zone: { id: "4", name: "La Carolina", grade: "zone", parentId: "3" },
    number: "200",
    reference: "Edificio azul",
    isThirdPartyAddress: true,
    customerReceivingFirstName: "María",
    customerReceivingLastName: "García",
    customerReceivingEmail: "maria@example.com",
    customerReceivingPhone: "0977777777",
    customerReceivingIdentificationNumber: "0987654321",
    customerReceivingIdentificationType: "CI",
    secondPhone: "0966666666",
    postalCode: "170102",
    default: false,
}

describe("UpdateMemberAddressUseCase", () => {
    it("should delegate updateMemberAddress to repository", async () => {
        const addressRepository = {
            updateMemberAddress: vi.fn().mockResolvedValue(undefined),
        }

        const useCase = new UpdateMemberAddressUseCase(addressRepository as any)
        await useCase.updateMemberAddress(mockAddress)

        expect(addressRepository.updateMemberAddress).toHaveBeenCalledTimes(1)
        expect(addressRepository.updateMemberAddress).toHaveBeenCalledWith(mockAddress)
    })

    it("should propagate repository errors", async () => {
        const addressRepository = {
            updateMemberAddress: vi.fn().mockRejectedValue(new Error("update failed")),
        }

        const useCase = new UpdateMemberAddressUseCase(addressRepository as any)

        await expect(useCase.updateMemberAddress(mockAddress)).rejects.toThrow("update failed")
    })
})
