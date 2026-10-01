import { beforeEach, describe, expect, it, vi } from "vitest"
import { Address } from "@/domain/entity/Address/structure/address"

const mocks = vi.hoisted(() => ({
    axGet: vi.fn(),
    axPost: vi.fn(),
    axPut: vi.fn(),
    axDelete: vi.fn(),
    getAddressesAdapter: vi.fn(),
    updateAddressAdapter: vi.fn(),
}))

vi.mock("@/data/adapters/Address/addressAdapter", () => ({
    getAddressesAdapter: mocks.getAddressesAdapter,
    updateAddressAdapter: mocks.updateAddressAdapter,
}))

vi.mock("@/data/provider/axios/axiosPrivate", () => ({
    default: {
        get: mocks.axGet,
        post: mocks.axPost,
        put: mocks.axPut,
        delete: mocks.axDelete,
    },
}))

const mockAddress = (): Address => ({
    id: "addr-1",
    alias: "Home",
    street1: "Main St",
    street2: "Apt 4B",
    country: { id: "country-1", name: "Ecuador", grade: "country", parentId: null },
    state: { id: "state-1", name: "Pichincha", grade: "state", parentId: "country-1" },
    city: { id: "city-1", name: "Quito", grade: "city", parentId: "state-1" },
    zone: { id: "zone-1", name: "Centro", grade: "zone", parentId: "city-1" },
    number: "123",
    reference: "Near park",
    isThirdPartyAddress: false,
    customerReceivingFirstName: "",
    customerReceivingLastName: "",
    customerReceivingEmail: "",
    customerReceivingPhone: "",
    customerReceivingIdentificationNumber: "",
    customerReceivingIdentificationType: "",
    secondPhone: "0999999999",
    postalCode: "170101",
    default: true,
})

describe("AddressRepository", () => {
    beforeEach(() => {
        mocks.axGet.mockReset()
        mocks.axPost.mockReset()
        mocks.axPut.mockReset()
        mocks.axDelete.mockReset()
        mocks.getAddressesAdapter.mockReset()
        mocks.updateAddressAdapter.mockReset()
        process.env.NEXT_PUBLIC_PROGRAM_ID = "test-program-id"
        vi.clearAllMocks()
    })

    it("requests member addresses endpoint and adapts response", async () => {
        vi.resetModules()
        const entities = [{ id: "addr-1" }]
        const adaptedAddresses = [mockAddress()]
        mocks.axGet.mockResolvedValueOnce({ data: { entities } })
        mocks.getAddressesAdapter.mockReturnValueOnce(adaptedAddresses)

        const { default: AddressRepository } = await import("@/data/repository/Address/AddressRepository")
        const repository = new AddressRepository()
        const result = await repository.getMemberAddresses()

        const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id"
        expect(mocks.axGet).toHaveBeenCalledWith(
            `/identity-api/${programId}/users/members/addresses`,
        )
        expect(mocks.getAddressesAdapter).toHaveBeenCalledWith(entities)
        expect(result).toBe(adaptedAddresses)
    })

    it("posts new member address with adapted payload", async () => {
        vi.resetModules()
        const address = mockAddress()
        const payload = { alias: "Home", street1: "Main St" }
        mocks.updateAddressAdapter.mockReturnValueOnce(payload)
        mocks.axPost.mockResolvedValueOnce({})

        const { default: AddressRepository } = await import("@/data/repository/Address/AddressRepository")
        const repository = new AddressRepository()
        await repository.addMemberAddress(address)

        const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id"
        expect(mocks.updateAddressAdapter).toHaveBeenCalledWith(address)
        expect(mocks.axPost).toHaveBeenCalledWith(
            `/identity-api/${programId}/users/members/addresses`,
            payload,
        )
    })

    it("puts member address update with id in url and adapted payload", async () => {
        vi.resetModules()
        const address = mockAddress()
        const payload = { alias: "Office", street1: "Business Ave" }
        mocks.updateAddressAdapter.mockReturnValueOnce(payload)
        mocks.axPut.mockResolvedValueOnce({})

        const { default: AddressRepository } = await import("@/data/repository/Address/AddressRepository")
        const repository = new AddressRepository()
        await repository.updateMemberAddress(address)

        const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id"
        expect(mocks.updateAddressAdapter).toHaveBeenCalledWith(address)
        expect(mocks.axPut).toHaveBeenCalledWith(
            `/identity-api/${programId}/users/members/addresses/${address.id}`,
            payload,
        )
    })

    it("deletes member address by id", async () => {
        vi.resetModules()
        mocks.axDelete.mockResolvedValueOnce({})

        const { default: AddressRepository } = await import("@/data/repository/Address/AddressRepository")
        const repository = new AddressRepository()
        await repository.deleteMemberAddress("addr-1")

        const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id"
        expect(mocks.axDelete).toHaveBeenCalledWith(
            `/identity-api/${programId}/users/members/addresses/addr-1`,
        )
    })
})
