import { describe, it, expect } from "vitest"
import {
    getCarRentalLocationsAdapter,
    getListCartRentalLocationsAdapter,
} from "@/data/adapters/TravelLocations/carRentalLocationsAdapter"
import { CarRentalLocation, TravelLocationType } from "@/domain/entity/TravelLocation"

describe("carRentalLocationsAdapter", () => {
    describe("getCarRentalLocationsAdapter", () => {
        it("should map all string fields from a complete record", () => {
            const input = {
                id: "QUI-001",
                code: "UIO",
                cityCode: "UIO",
                cityName: "Quito",
                countryName: "Ecuador",
                countryCode: "EC",
                continentCode: "SA",
                name: "Aeropuerto Mariscal Sucre",
                region: "Pichincha",
                type: "carRental",
            }

            const result = getCarRentalLocationsAdapter(input)

            expect(result).toEqual({
                id: "QUI-001",
                code: "UIO",
                cityCode: "UIO",
                cityName: "Quito",
                countryName: "Ecuador",
                countryCode: "EC",
                continentCode: "SA",
                name: "Aeropuerto Mariscal Sucre",
                region: "Pichincha",
                type: "carRental" as TravelLocationType,
            })
        })

        it("should default every field to empty string when input is null", () => {
            const result = getCarRentalLocationsAdapter(null)

            expect(result).toEqual({
                id: "",
                code: "",
                cityCode: "",
                cityName: "",
                countryName: "",
                countryCode: "",
                continentCode: "",
                name: "",
                region: "",
                type: "" as TravelLocationType,
            })
        })

        it("should default every field to empty string when input is undefined", () => {
            const result = getCarRentalLocationsAdapter(undefined)

            expect(result.id).toBe("")
            expect(result.code).toBe("")
            expect(result.name).toBe("")
            expect(result.type).toBe("" as TravelLocationType)
        })

        it("should default every field to empty string when input is a non-record primitive", () => {
            const result = getCarRentalLocationsAdapter("not-an-object")

            expect(result).toEqual({
                id: "",
                code: "",
                cityCode: "",
                cityName: "",
                countryName: "",
                countryCode: "",
                continentCode: "",
                name: "",
                region: "",
                type: "" as TravelLocationType,
            })
        })

        it("should coerce non-string field values to empty strings", () => {
            const input = {
                id: 123,
                code: true,
                cityCode: null,
                cityName: undefined,
                countryName: { nested: "x" },
                countryCode: ["EC"],
                continentCode: 0,
                name: "Aeropuerto",
                region: false,
                type: "carRental",
            }

            const result = getCarRentalLocationsAdapter(input)

            expect(result).toEqual({
                id: "",
                code: "",
                cityCode: "",
                cityName: "",
                countryName: "",
                countryCode: "",
                continentCode: "",
                name: "Aeropuerto",
                region: "",
                type: "carRental" as TravelLocationType,
            })
        })

        it("should ignore extra keys not declared in CarRentalLocation", () => {
            const input = {
                id: "QUI-001",
                code: "UIO",
                cityCode: "UIO",
                cityName: "Quito",
                countryName: "Ecuador",
                countryCode: "EC",
                continentCode: "SA",
                name: "Aeropuerto",
                region: "Pichincha",
                type: "carRental",
                extra: "should be ignored",
                metadata: { hello: "world" },
            }

            const result = getCarRentalLocationsAdapter(input)

            expect(result).not.toHaveProperty("extra")
            expect(result).not.toHaveProperty("metadata")
            expect(Object.keys(result)).toHaveLength(10)
        })

        it("should pass through empty-string field values unchanged", () => {
            const input = {
                id: "",
                code: "",
                cityCode: "",
                cityName: "",
                countryName: "",
                countryCode: "",
                continentCode: "",
                name: "",
                region: "",
                type: "",
            }

            const result = getCarRentalLocationsAdapter(input)

            expect(result).toEqual({
                id: "",
                code: "",
                cityCode: "",
                cityName: "",
                countryName: "",
                countryCode: "",
                continentCode: "",
                name: "",
                region: "",
                type: "" as TravelLocationType,
            })
        })

        it("should cast type to TravelLocationType while preserving the string value", () => {
            const result = getCarRentalLocationsAdapter({ type: "carRental" })

            expect(typeof result.type).toBe("string")
            expect(result.type).toBe("carRental")
        })
    })

    describe("getListCartRentalLocationsAdapter", () => {
        const baseLocation: CarRentalLocation = {
            id: "QUI-001",
            code: "UIO",
            cityCode: "UIO",
            cityName: "Quito",
            countryName: "Ecuador",
            countryCode: "EC",
            continentCode: "SA",
            name: "Aeropuerto Mariscal Sucre",
            region: "Pichincha",
            type: "carRental" as TravelLocationType,
        }

        it("should return the same array when no items are undefined", () => {
            const list = [baseLocation, { ...baseLocation, id: "GYE-001", code: "GYE" }]

            const result = getListCartRentalLocationsAdapter(list)

            expect(result).toEqual(list)
            expect(result).toHaveLength(2)
        })

        it("should filter out undefined items", () => {
            const list = [
                baseLocation,
                undefined as unknown as CarRentalLocation,
                { ...baseLocation, code: "GYE" },
                undefined as unknown as CarRentalLocation,
            ]

            const result = getListCartRentalLocationsAdapter(list)

            expect(result).toHaveLength(2)
            expect(result[0].code).toBe("UIO")
            expect(result[1].code).toBe("GYE")
        })

        it("should return an empty array when input is empty", () => {
            const result = getListCartRentalLocationsAdapter([])
            expect(result).toEqual([])
        })

        it("should return an empty array when every item is undefined", () => {
            const list = [
                undefined as unknown as CarRentalLocation,
                undefined as unknown as CarRentalLocation,
            ]
            const result = getListCartRentalLocationsAdapter(list)
            expect(result).toEqual([])
        })
    })
})
