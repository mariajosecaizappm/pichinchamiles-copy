import { describe, expect, it } from "vitest"
import { getAddressesAdapter, updateAddressAdapter } from "@/data/adapters/Address/addressAdapter"
import { Address } from "@/domain/entity/Address/structure/address"

const mockLocation = (overrides: Record<string, unknown> = {}) => ({
    id: "loc-1",
    name: "Location Name",
    grade: "city",
    parentId: "parent-1",
    ...overrides,
})

const mockAddressEntity = (overrides: Record<string, unknown> = {}) => ({
    id: "addr-1",
    alias: "Home",
    street1: "Main St",
    street2: "Apt 4B",
    countryLocation: mockLocation({ id: "country-1", grade: "country" }),
    stateLocation: mockLocation({ id: "state-1", grade: "state" }),
    cityLocation: mockLocation({ id: "city-1", grade: "city" }),
    zoneLocation: mockLocation({ id: "zone-1", grade: "zone", parentId: null }),
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
    ...overrides,
})

const mockAddress = (overrides: Partial<Address> = {}): Address => ({
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
    ...overrides,
})

describe("addressAdapter", () => {
    describe("getAddressesAdapter", () => {
        it("maps address entities including id and nested locations", () => {
            const entities = [mockAddressEntity()]

            const result = getAddressesAdapter(entities)

            expect(result).toEqual([
                {
                    id: "addr-1",
                    alias: "Home",
                    street1: "Main St",
                    street2: "Apt 4B",
                    country: {
                        id: "country-1",
                        name: "Location Name",
                        grade: "country",
                        parentId: "parent-1",
                    },
                    state: {
                        id: "state-1",
                        name: "Location Name",
                        grade: "state",
                        parentId: "parent-1",
                    },
                    city: {
                        id: "city-1",
                        name: "Location Name",
                        grade: "city",
                        parentId: "parent-1",
                    },
                    zone: {
                        id: "zone-1",
                        name: "Location Name",
                        grade: "zone",
                        parentId: null,
                    },
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
                },
            ])
        })

        it("maps createdAt when present on the entity", () => {
            const result = getAddressesAdapter([
                mockAddressEntity({ createdAt: "2025-06-01T12:00:00.000Z" }),
            ])

            expect(result[0].createdAt).toBe("2025-06-01T12:00:00.000Z")
        })

        it("returns empty array when entities is empty", () => {
            expect(getAddressesAdapter([])).toEqual([])
        })

        it("normalizes null secondPhone to empty string", () => {
            const result = getAddressesAdapter([mockAddressEntity({ secondPhone: null })])

            expect(result[0].secondPhone).toBe("")
        })
    })

    describe("updateAddressAdapter", () => {
        it("formats address without third party fields", () => {
            const address = mockAddress({ isThirdPartyAddress: false })

            const result = updateAddressAdapter(address)

            expect(result).toEqual({
                reference: "Near park",
                street1: "Main St",
                street2: "Apt 4B",
                number: "123",
                secondPhone: "0999999999",
                alias: "Home",
                isThirdPartyAddress: false,
                default: true,
                countryLocationID: "country-1",
                stateLocationID: "state-1",
                cityLocationID: "city-1",
                zoneLocationId: "zone-1",
            })
            expect(result).not.toHaveProperty("customerReceivingFirstName")
            expect(result).not.toHaveProperty("addressId")
        })

        it("includes third party fields when isThirdPartyAddress is true", () => {
            const address = mockAddress({
                id: "addr-99",
                isThirdPartyAddress: true,
                customerReceivingFirstName: "Jane",
                customerReceivingLastName: "Doe",
                customerReceivingEmail: "jane@example.com",
                customerReceivingPhone: "0987654321",
                customerReceivingIdentificationNumber: "1234567890",
                customerReceivingIdentificationType: "CI",
            })

            const result = updateAddressAdapter(address)

            expect(result).toEqual({
                reference: "Near park",
                street1: "Main St",
                street2: "Apt 4B",
                number: "123",
                secondPhone: "0999999999",
                alias: "Home",
                isThirdPartyAddress: true,
                default: true,
                countryLocationID: "country-1",
                stateLocationID: "state-1",
                cityLocationID: "city-1",
                zoneLocationId: "zone-1",
                customerReceivingFirstName: "Jane",
                customerReceivingLastName: "Doe",
                customerReceivingEmail: "jane@example.com",
                customerReceivingPhone: "0987654321",
                customerReceivingIdentificationNumber: "1234567890",
                customerReceivingIdentificationType: "CI",
            })
            expect(result).not.toHaveProperty("addressId")
        })

        it("accepts address with id without including it in payload", () => {
            const address = mockAddress({ id: "addr-with-id" })

            const result = updateAddressAdapter(address)

            expect(address.id).toBe("addr-with-id")
            expect(result).not.toHaveProperty("id")
            expect(result).not.toHaveProperty("addressId")
        })
    })
})
