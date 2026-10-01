import { describe, expect, it } from "vitest"
import { Address } from "@/domain/entity/Address/structure/address"
import { Location, LocationGrade } from "@/domain/entity/Location/structure/location"
import {
    addressToFormValues,
    getFormAutocompleteOptions,
    hasAddressFormChanged,
} from "@/presentation/forms/AddressForm/formatData"

const mockLocations: Location[] = [
    {
        id: "loc-1",
        name: "Pichincha",
        grade: LocationGrade.STATE,
        availableForDelivery: true,
        parentId: "country-1",
    },
    {
        id: "loc-2",
        name: "Quito",
        grade: LocationGrade.CITY,
        availableForDelivery: true,
        parentId: "loc-1",
    },
]

const mockAddress: Address = {
    id: "addr-1",
    alias: "Casa",
    street1: "Av. Principal",
    street2: "Calle Secundaria",
    country: { id: "country-1", name: "Ecuador", grade: "country", parentId: null },
    state: { id: "loc-1", name: "Pichincha", grade: "state", parentId: "country-1" },
    city: { id: "loc-2", name: "Quito", grade: "city", parentId: "loc-1" },
    zone: { id: "loc-3", name: "Centro", grade: "zone", parentId: "loc-2" },
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

describe("getFormAutocompleteOptions", () => {
    it("should map locations to autocomplete options", () => {
        expect(getFormAutocompleteOptions(mockLocations)).toEqual([
            {
                value: "loc-1",
                label: "Pichincha",
                data: { grade: LocationGrade.STATE, parentId: "country-1" },
            },
            {
                value: "loc-2",
                label: "Quito",
                data: { grade: LocationGrade.CITY, parentId: "loc-1" },
            },
        ])
    })

    it("should return an empty array when no locations are provided", () => {
        expect(getFormAutocompleteOptions([])).toEqual([])
    })
})

describe("addressToFormValues", () => {
    it("should map address fields and clear third-party fields when isThirdPartyAddress is false", () => {
        expect(addressToFormValues(mockAddress)).toEqual({
            ...mockAddress,
            country: mockAddress.country,
            state: mockAddress.state,
            city: mockAddress.city,
            zone: mockAddress.zone,
            customerReceivingFirstName: "",
            customerReceivingLastName: "",
            customerReceivingEmail: "",
            customerReceivingPhone: "",
            customerReceivingIdentificationNumber: "",
            customerReceivingIdentificationType: "",
        })
    })

    it("should preserve third-party fields when isThirdPartyAddress is true", () => {
        const thirdPartyAddress: Address = { ...mockAddress, isThirdPartyAddress: true }
        expect(addressToFormValues(thirdPartyAddress)).toEqual({
            ...thirdPartyAddress,
            country: thirdPartyAddress.country,
            state: thirdPartyAddress.state,
            city: thirdPartyAddress.city,
            zone: thirdPartyAddress.zone,
        })
    })
})

describe("hasAddressFormChanged", () => {
    it("should return false when values are unchanged", () => {
        const formValues = addressToFormValues(mockAddress)
        expect(hasAddressFormChanged(formValues, { ...formValues })).toBe(false)
    })

    it("should return true when a scalar field changes", () => {
        const formValues = addressToFormValues(mockAddress)
        expect(hasAddressFormChanged(formValues, { ...formValues, alias: "Oficina" })).toBe(true)
    })

    it("should return true when a location field changes", () => {
        const formValues = addressToFormValues(mockAddress)
        expect(
            hasAddressFormChanged(formValues, {
                ...formValues,
                city: { id: "loc-99", name: "Cuenca", grade: "city", parentId: "loc-1" },
            }),
        ).toBe(true)
    })

    it("should return false when values are reverted to the original state", () => {
        const formValues = addressToFormValues(mockAddress)
        const modified = { ...formValues, alias: "Oficina" }
        expect(hasAddressFormChanged(formValues, modified)).toBe(true)
        expect(hasAddressFormChanged(formValues, { ...modified, alias: formValues.alias })).toBe(false)
    })

    it("should ignore whitespace-only differences", () => {
        const formValues = addressToFormValues(mockAddress)
        expect(hasAddressFormChanged(formValues, { ...formValues, alias: " Casa " })).toBe(false)
    })
})
