import { describe, it, expect, vi, beforeEach } from "vitest"
import { CarRentalLocation, TravelLocationType } from "@/domain/entity/TravelLocation"

const executeMock = vi.fn<(search: string) => Promise<CarRentalLocation[]>>()
const getMock = vi.fn((_token: unknown) => ({ execute: executeMock }))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: { get: (token: unknown) => getMock(token) },
}))

import { searchLocations } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Cars/actions"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const makeLocation = (overrides: Partial<CarRentalLocation> = {}): CarRentalLocation => ({
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
    ...overrides,
})

describe("Cars/actions.searchLocations", () => {
    beforeEach(() => {
        executeMock.mockReset()
        getMock.mockClear()
    })

    it("should resolve the GetCarRentalLocationsUseCase from the container with the correct symbol", async () => {
        executeMock.mockResolvedValue([])

        await searchLocations("qui")

        expect(getMock).toHaveBeenCalledWith(UseCaseTypes.GetCarRentalLocationsUseCase)
    })

    it("should call the use case with the search term", async () => {
        executeMock.mockResolvedValue([])

        await searchLocations("Quito")

        expect(executeMock).toHaveBeenCalledTimes(1)
        expect(executeMock).toHaveBeenCalledWith("Quito")
    })

    it("should map locations to { id: code, name }", async () => {
        executeMock.mockResolvedValue([
            makeLocation({ 
                code: "UIO", 
                cityName: "Quito",
                name: "Aeropuerto Mariscal Sucre",
                countryName: "Ecuador"
            }),
            makeLocation({ 
                code: "GYE", 
                cityName: "Guayaquil",
                name: "Aeropuerto José Joaquín de Olmedo",
                countryName: "Ecuador"
            }),
        ])

        const result = await searchLocations("aero")

        expect(result).toEqual([
            { id: "UIO", name: "Quito - Aeropuerto Mariscal Sucre - Ecuador (UIO)" },
            { id: "GYE", name: "Guayaquil - Aeropuerto José Joaquín de Olmedo - Ecuador (GYE)" },
        ])
    })

    it("should return an empty array when the use case returns no results", async () => {
        executeMock.mockResolvedValue([])

        const result = await searchLocations("xyz")

        expect(result).toEqual([])
    })

    it("should propagate use-case errors", async () => {
        executeMock.mockRejectedValue(new Error("Repo down"))

        await expect(searchLocations("anything")).rejects.toThrow("Repo down")
    })

    it("should not include unmapped fields in the response", async () => {
        executeMock.mockResolvedValue([makeLocation({ code: "UIO", name: "Quito" })])

        const result = await searchLocations("q")

        expect(Object.keys(result[0])).toEqual(["id", "name"])
    })

    describe("location name formatting", () => {
        it("should handle missing name field", async () => {
            executeMock.mockResolvedValue([
                makeLocation({ 
                    code: "UIO", 
                    cityName: "Quito",
                    name: undefined,
                    countryName: "Ecuador"
                })
            ])

            const result = await searchLocations("aero")

            expect(result).toEqual([
                { id: "UIO", name: "Quito - Ecuador (UIO)" }
            ])
        })

        it("should handle missing cityName field", async () => {
            executeMock.mockResolvedValue([
                makeLocation({ 
                    code: "UIO", 
                    cityName: undefined,
                    name: "Aeropuerto Mariscal Sucre",
                    countryName: "Ecuador"
                })
            ])

            const result = await searchLocations("aero")

            expect(result).toEqual([
                { id: "UIO", name: "Aeropuerto Mariscal Sucre - Ecuador (UIO)" }
            ])
        })

        it("should handle missing code field", async () => {
            executeMock.mockResolvedValue([
                makeLocation({ 
                    code: undefined, 
                    cityName: "Quito",
                    name: "Aeropuerto Mariscal Sucre",
                    countryName: "Ecuador"
                })
            ])

            const result = await searchLocations("aero")

            expect(result).toEqual([
                { id: "", name: "Quito - Aeropuerto Mariscal Sucre - Ecuador" }
            ])
        })

        it("should handle empty string fields", async () => {
            executeMock.mockResolvedValue([
                makeLocation({ 
                    code: "", 
                    cityName: "",
                    name: "",
                    countryName: ""
                })
            ])

            const result = await searchLocations("aero")

            expect(result).toEqual([
                { id: "", name: "" }
            ])
        })

        it("should handle all fields missing", async () => {
            executeMock.mockResolvedValue([
                makeLocation({ 
                    code: undefined, 
                    cityName: undefined,
                    name: undefined,
                    countryName: undefined
                })
            ])

            const result = await searchLocations("aero")

            expect(result).toEqual([
                { id: "", name: "" }
            ])
        })

        it("should handle only countryName present", async () => {
            executeMock.mockResolvedValue([
                makeLocation({ 
                    code: undefined, 
                    cityName: undefined,
                    name: undefined,
                    countryName: "Ecuador"
                })
            ])

            const result = await searchLocations("aero")

            expect(result).toEqual([
                { id: "", name: "Ecuador" }
            ])
        })
    })
})
