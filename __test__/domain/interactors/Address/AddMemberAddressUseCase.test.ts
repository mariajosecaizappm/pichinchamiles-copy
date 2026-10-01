import { describe, expect, it, vi } from "vitest"
import AddMemberAddressUseCase from "@/domain/interactors/Address/AddMemberAddressUseCase"
import { Address } from "@/domain/entity/Address/structure/address"

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

describe("AddMemberAddressUseCase", () => {
    it("should delegate addMemberAddress to repository", async () => {
        const addressRepository = {
            addMemberAddress: vi.fn().mockResolvedValue(undefined),
        }

        const useCase = new AddMemberAddressUseCase(addressRepository as any)
        await useCase.addMemberAddress(mockAddress)

        expect(addressRepository.addMemberAddress).toHaveBeenCalledTimes(1)
        expect(addressRepository.addMemberAddress).toHaveBeenCalledWith(mockAddress)
    })

    it("should propagate repository errors", async () => {
        const addressRepository = {
            addMemberAddress: vi.fn().mockRejectedValue(new Error("add failed")),
        }

        const useCase = new AddMemberAddressUseCase(addressRepository as any)

        await expect(useCase.addMemberAddress(mockAddress)).rejects.toThrow("add failed")
    })
})
