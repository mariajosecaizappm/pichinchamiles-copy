import { describe, expect, it, vi } from "vitest"
import GetMemberAddressesUseCase from "@/domain/interactors/Address/GetMemberAddressesUseCase"
import { Address } from "@/domain/entity/Address/structure/address"

const mockAddresses: Address[] = [
    {
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
    },
]

describe("GetMemberAddressesUseCase", () => {
    it("should delegate getMemberAddresses to repository", async () => {
        const addressRepository = {
            getMemberAddresses: vi.fn().mockResolvedValue(mockAddresses),
        }

        const useCase = new GetMemberAddressesUseCase(addressRepository as any)
        const result = await useCase.getMemberAddresses()

        expect(result).toEqual(mockAddresses)
        expect(addressRepository.getMemberAddresses).toHaveBeenCalledTimes(1)
    })

    it("should propagate repository errors", async () => {
        const addressRepository = {
            getMemberAddresses: vi.fn().mockRejectedValue(new Error("fetch failed")),
        }

        const useCase = new GetMemberAddressesUseCase(addressRepository as any)

        await expect(useCase.getMemberAddresses()).rejects.toThrow("fetch failed")
    })
})
