import { describe, expect, it } from "vitest"
import { getLocationsAdapter } from "@/data/adapters/Location/locationsAdapter"
import { LocationGrade } from "@/domain/entity/Location/structure/location"

describe("locationsAdapter", () => {
    describe("getLocationsAdapter", () => {
        it("maps algolia hit to Location", () => {
            const hitValue = {
                id: "loc-1",
                name: "Quito",
                grade: LocationGrade.CITY,
                availableForDelivery: true,
                parentId: "state-1",
            }

            const result = getLocationsAdapter(hitValue)

            expect(result).toEqual({
                id: "loc-1",
                name: "Quito",
                grade: LocationGrade.CITY,
                availableForDelivery: true,
                parentId: "state-1",
            })
        })

        it("maps hit with different grade and availableForDelivery false", () => {
            const hitValue = {
                id: "country-1",
                name: "Ecuador",
                grade: LocationGrade.COUNTRY,
                availableForDelivery: false,
                parentId: "",
            }

            const result = getLocationsAdapter(hitValue)

            expect(result).toEqual({
                id: "country-1",
                name: "Ecuador",
                grade: LocationGrade.COUNTRY,
                availableForDelivery: false,
                parentId: "",
            })
        })
    })
})
