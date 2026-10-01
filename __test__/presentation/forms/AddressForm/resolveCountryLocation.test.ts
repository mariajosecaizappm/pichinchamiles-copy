import { describe, expect, it } from "vitest"
import { LocationGrade } from "@/domain/entity/Location/structure/location"
import {
    normalizeLocationName,
    resolveCountryLocation,
} from "@/presentation/forms/AddressForm/resolveCountryLocation"

const montufarWrongCountry = {
    id: "698a5fa4-f041-4971-884d-e4d2382e6ee2",
    name: "MONTÚFAR",
    grade: LocationGrade.COUNTRY,
    availableForDelivery: true,
    parentId: "",
}

const ecuadorCountry = {
    id: "ec-1",
    name: "ECUADOR",
    grade: LocationGrade.COUNTRY,
    availableForDelivery: true,
    parentId: "",
}

describe("normalizeLocationName", () => {
    it("should normalize accents and casing", () => {
        expect(normalizeLocationName("  Montúfar  ")).toBe("MONTUFAR")
        expect(normalizeLocationName("ecuador")).toBe("ECUADOR")
    })
})

describe("resolveCountryLocation", () => {
    it("should pick ECUADOR when Algolia returns MONTÚFAR first", () => {
        expect(resolveCountryLocation([montufarWrongCountry, ecuadorCountry], "ECUADOR")).toEqual(
            ecuadorCountry,
        )
    })

    it("should return null when no country matches the query", () => {
        expect(resolveCountryLocation([montufarWrongCountry], "ECUADOR")).toBeNull()
    })

    it("should ignore non-country grades", () => {
        expect(
            resolveCountryLocation(
                [
                    {
                        id: "state-1",
                        name: "ECUADOR",
                        grade: LocationGrade.STATE,
                        availableForDelivery: true,
                        parentId: "ec-1",
                    },
                ],
                "ECUADOR",
            ),
        ).toBeNull()
    })

    it("should match country names case-insensitively", () => {
        expect(resolveCountryLocation([ecuadorCountry], "ecuador")).toEqual(ecuadorCountry)
    })

    it("should return null when query is empty after normalization", () => {
        expect(resolveCountryLocation([ecuadorCountry], "   ")).toBeNull()
    })

    it("should match when country name starts with query", () => {
        const unitedStates = {
            id: "us-1",
            name: "ESTADOS UNIDOS",
            grade: LocationGrade.COUNTRY,
            availableForDelivery: true,
            parentId: "",
        }

        expect(resolveCountryLocation([unitedStates], "ESTADOS")).toEqual(unitedStates)
    })

    it("should match when query starts with country name", () => {
        expect(resolveCountryLocation([ecuadorCountry], "ECUADOR REPUBLICA")).toEqual(ecuadorCountry)
    })
})
