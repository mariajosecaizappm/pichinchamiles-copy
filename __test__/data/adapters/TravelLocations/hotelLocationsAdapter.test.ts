import { describe, it, expect } from "vitest"
import { getHotelLocationsAdapter } from "@/data/adapters/TravelLocations/hotelLocationsAdapter"
import { TravelLocationType } from "@/domain/entity/TravelLocation"

describe("hotelLocationsAdapter", () => {
    describe("getHotelLocationsAdapter", () => {
        it("should adapt a valid hotel location record", () => {
            const input = {
                cityCode: "BRA",
                cityName: "Brasilia",
                countryName: "Brazil",
                type: "hotel"
            }

            const result = getHotelLocationsAdapter(input)

            expect(result).toEqual({
                cityCode: "BRA",
                cityName: "Brasilia",
                countryName: "Brazil",
                type: "hotel" as TravelLocationType
            })
        })

        it("should handle empty object gracefully", () => {
            const input = {}

            const result = getHotelLocationsAdapter(input)

            expect(result).toEqual({
                cityCode: "",
                cityName: "",
                countryName: "",
                type: "" as TravelLocationType
            })
        })

        it("should handle null input gracefully", () => {
            const input = null

            const result = getHotelLocationsAdapter(input)

            expect(result).toEqual({
                cityCode: "",
                cityName: "",
                countryName: "",
                type: "" as TravelLocationType
            })
        })

        it("should handle undefined input gracefully", () => {
            const input = undefined

            const result = getHotelLocationsAdapter(input)

            expect(result).toEqual({
                cityCode: "",
                cityName: "",
                countryName: "",
                type: "" as TravelLocationType
            })
        })

        it("should handle non-record input gracefully", () => {
            const input = "not a record"

            const result = getHotelLocationsAdapter(input)

            expect(result).toEqual({
                cityCode: "",
                cityName: "",
                countryName: "",
                type: "" as TravelLocationType
            })
        })

        it("should handle missing fields", () => {
            const input = {
                cityCode: "RIO",
                cityName: "Rio de Janeiro"
                // Missing countryName and type
            }

            const result = getHotelLocationsAdapter(input)

            expect(result).toEqual({
                cityCode: "RIO",
                cityName: "Rio de Janeiro",
                countryName: "",
                type: "" as TravelLocationType
            })
        })

        it("should handle null field values", () => {
            const input = {
                cityCode: null,
                cityName: "Sao Paulo",
                countryName: null,
                type: "hotel"
            }

            const result = getHotelLocationsAdapter(input)

            expect(result).toEqual({
                cityCode: "",
                cityName: "Sao Paulo",
                countryName: "",
                type: "hotel" as TravelLocationType
            })
        })

        it("should handle undefined field values", () => {
            const input = {
                cityCode: undefined,
                cityName: "Sao Paulo",
                countryName: undefined,
                type: "hotel"
            }

            const result = getHotelLocationsAdapter(input)

            expect(result).toEqual({
                cityCode: "",
                cityName: "Sao Paulo",
                countryName: "",
                type: "hotel" as TravelLocationType
            })
        })

        it("should handle numeric field values", () => {
            const input = {
                cityCode: 123,
                cityName: "Test City",
                countryName: 456,
                type: "hotel"
            }

            const result = getHotelLocationsAdapter(input)

            expect(result).toEqual({
                cityCode: "", // getString solo convierte strings a strings
                cityName: "Test City",
                countryName: "", // getString solo convierte strings a strings
                type: "hotel" as TravelLocationType
            })
        })

        it("should handle boolean field values", () => {
            const input = {
                cityCode: true,
                cityName: "Test City",
                countryName: false,
                type: "hotel"
            }

            const result = getHotelLocationsAdapter(input)

            expect(result).toEqual({
                cityCode: "", // getString solo convierte strings a strings
                cityName: "Test City",
                countryName: "", // getString solo convierte strings a strings
                type: "hotel" as TravelLocationType
            })
        })

        it("should cast type to TravelLocationType", () => {
            const input = {
                cityCode: "BRA",
                cityName: "Brasilia",
                countryName: "Brazil",
                type: "hotel"
            }

            const result = getHotelLocationsAdapter(input)

            expect(typeof result.type).toBe("string")
            expect(result.type).toBe("hotel")
        })

        it("should handle empty string field values", () => {
            const input = {
                cityCode: "",
                cityName: "",
                countryName: "",
                type: ""
            }

            const result = getHotelLocationsAdapter(input)

            expect(result).toEqual({
                cityCode: "",
                cityName: "",
                countryName: "",
                type: "" as TravelLocationType
            })
        })

        it("should handle complex nested objects", () => {
            const input = {
                cityCode: "BRA",
                cityName: "Brasilia",
                countryName: "Brazil",
                type: "hotel",
                nested: {
                    value: "should be ignored"
                },
                array: [1, 2, 3]
            }

            const result = getHotelLocationsAdapter(input)

            expect(result).toEqual({
                cityCode: "BRA",
                cityName: "Brasilia",
                countryName: "Brazil",
                type: "hotel" as TravelLocationType
            })
        })
    })
})
