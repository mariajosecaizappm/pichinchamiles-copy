import { describe, it, expect, vi, beforeEach } from "vitest"
import { mapAutocompleteLocations, hotelsSchema, hotelsInitialValues, parseValuesToParams, MAX_CHILDREN_AGES } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Hotels/Form/HotelsFormConfig"
import { HotelLocation } from "@/domain/entity/TravelLocation"
import GetHotelsLocationsUseCase from "@/domain/interactors/TravelLocation/GetHotelsLocationsUseCase"
import container from "@/presentation/config/inversify.config"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

// Mock the container
vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: vi.fn()
    }
}))

describe("HotelsFormConfig", () => {
    let mockGetHotelsLocations: vi.MockedFunction<GetHotelsLocationsUseCase['execute']>

    const mockHotelLocations: HotelLocation[] = [
        {
            cityCode: "BRA",
            cityName: "Brasilia",
            countryName: "Brazil"
        },
        {
            cityCode: "RIO",
            cityName: "Rio de Janeiro",
            countryName: "Brazil"
        },
        {
            cityCode: "SP",
            cityName: "Sao Paulo",
            countryName: "Brazil"
        }
    ]

    beforeEach(() => {
        mockGetHotelsLocations = vi.fn()
        vi.mocked(container).get.mockReturnValue({
            execute: mockGetHotelsLocations
        } as unknown as GetHotelsLocationsUseCase)
    })

    describe("MAX_CHILDREN_AGES", () => {
        it("should be 17", () => {
            expect(MAX_CHILDREN_AGES).toBe(17)
        })
    })

    describe("mapAutocompleteLocations", () => {
        it("should map hotel locations to autocomplete options", async () => {
            mockGetHotelsLocations.mockResolvedValue(mockHotelLocations)

            const result = await mapAutocompleteLocations("test")

            expect(container.get).toHaveBeenCalledWith(UseCaseTypes.GetHotelsLocationsUseCase)
            expect(mockGetHotelsLocations).toHaveBeenCalledWith("test")
            expect(result).toEqual([
                {
                    value: "BRA",
                    label: "Brasilia - Brazil(BRA)"
                },
                {
                    value: "RIO", 
                    label: "Rio de Janeiro - Brazil(RIO)"
                },
                {
                    value: "SP",
                    label: "Sao Paulo - Brazil(SP)"
                }
            ])
        })

        it("should handle locations without city code", async () => {
            const locationsWithoutCode: HotelLocation[] = [
                {
                    cityCode: "",
                    cityName: "Brasilia",
                    countryName: "Brazil"
                }
            ]
            mockGetHotelsLocations.mockResolvedValue(locationsWithoutCode)

            const result = await mapAutocompleteLocations("test")

            expect(result).toEqual([
                {
                    value: "",
                    label: "Brasilia - Brazil"
                }
            ])
        })

        it("should handle locations without city name", async () => {
            const locationsWithoutName: HotelLocation[] = [
                {
                    cityCode: "BRA",
                    cityName: "",
                    countryName: "Brazil"
                }
            ]
            mockGetHotelsLocations.mockResolvedValue(locationsWithoutName)

            const result = await mapAutocompleteLocations("test")

            expect(result).toEqual([
                {
                    value: "BRA",
                    label: "Brazil(BRA)"
                }
            ])
        })
    })

    describe("hotelsSchema", () => {
        it("should validate required fields correctly", async () => {
            const validData = {
                destination: { id: "BRA", name: "Brasilia - Brazil(BRA)" },
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
                adults: 2,
                childrens: 0,
                ageChildren1: undefined,
                ageChildren2: undefined,
                ageChildren3: undefined,
                ageChildren4: undefined,
                passengersInfo: "1 Habitación, 2 Huéspedes"
            }

            const result = await hotelsSchema.validate(validData)
            expect(result).toEqual(validData)
        })

        it("should require destination to be an object with id and name", async () => {
            const invalidData = {
                destination: null,
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
                adults: 2,
                childrens: 0,
                ageChildren1: undefined,
                ageChildren2: undefined,
                ageChildren3: undefined,
                ageChildren4: undefined,
                passengersInfo: "1 Habitación, 2 Huéspedes"
            }

            await expect(hotelsSchema.validate(invalidData)).rejects.toThrow()
        })

        it("should require ageChildren1 when childrens >= 1", async () => {
            const invalidData = {
                destination: { id: "BRA", name: "Brasilia - Brazil(BRA)" },
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
                adults: 2,
                childrens: 1,
                ageChildren1: undefined,
                ageChildren2: undefined,
                ageChildren3: undefined,
                ageChildren4: undefined,
                passengersInfo: "1 Habitación, 2 Huéspedes"
            }

            await expect(hotelsSchema.validate(invalidData)).rejects.toThrow()
        })

        it("should require ageChildren2 when childrens >= 2", async () => {
            const invalidData = {
                destination: { id: "BRA", name: "Brasilia - Brazil(BRA)" },
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
                adults: 2,
                childrens: 2,
                ageChildren1: 5,
                ageChildren2: undefined,
                ageChildren3: undefined,
                ageChildren4: undefined,
                passengersInfo: "1 Habitación, 2 Huéspedes"
            }

            await expect(hotelsSchema.validate(invalidData)).rejects.toThrow()
        })

        it("should validate age limits", async () => {
            const invalidData = {
                destination: { id: "BRA", name: "Brasilia - Brazil(BRA)" },
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
                adults: 2,
                childrens: 1,
                ageChildren1: 18, // Over MAX_CHILDREN_AGES
                ageChildren2: undefined,
                ageChildren3: undefined,
                ageChildren4: undefined,
                passengersInfo: "1 Habitación, 2 Huéspedes"
            }

            await expect(hotelsSchema.validate(invalidData)).rejects.toThrow("La edad máxima es 17 años")
        })

        it("should validate that endDate is after startDate", async () => {
            const invalidData = {
                destination: { id: "BRA", name: "Brasilia - Brazil(BRA)" },
                startDate: new Date("2024-01-02"),
                endDate: new Date("2024-01-01"), // Before startDate
                adults: 2,
                childrens: 0,
                ageChildren1: undefined,
                ageChildren2: undefined,
                ageChildren3: undefined,
                ageChildren4: undefined,
                passengersInfo: "1 Habitación, 2 Huéspedes"
            }

            await expect(hotelsSchema.validate(invalidData)).rejects.toThrow("La fecha de salida debe ser posterior a la fecha de entrada")
        })

        it("should validate minimum adults", async () => {
            const invalidData = {
                destination: { id: "BRA", name: "Brasilia - Brazil(BRA)" },
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
                adults: 0, // Less than minimum
                childrens: 0,
                ageChildren1: undefined,
                ageChildren2: undefined,
                ageChildren3: undefined,
                ageChildren4: undefined,
                passengersInfo: "1 Habitación, 2 Huéspedes"
            }

            await expect(hotelsSchema.validate(invalidData)).rejects.toThrow("Debe haber al menos 1 adulto")
        })
    })

    describe("hotelsInitialValues", () => {
        it("should have correct initial values", () => {
            expect(hotelsInitialValues).toEqual({
                destination: null,
                startDate: null,
                endDate: null,
                adults: 2,
                childrens: 0,
                ageChildren1: 0,
                ageChildren2: 0,
                ageChildren3: 0,
                ageChildren4: 0,
                passengersInfo: "1 Habitación, 2 Huéspedes"
            })
        })
    })

    describe("parseValuesToParams", () => {
        it("should convert form values to hotel params", () => {
            const values = {
                destination: { id: "BRA", name: "Brasilia - Brazil(BRA)" },
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
                adults: 2,
                childrens: 1,
                ageChildren1: 5,
                ageChildren2: 0,
                ageChildren3: 0,
                ageChildren4: 0,
                passengersInfo: "1 Habitación, 3 Huéspedes"
            }

            const result = parseValuesToParams(values)

            expect(result).toEqual({
                destination: "BRA",
                adults: 2,
                ageChildrens: [5],
                checkIn: new Date("2024-01-01"),
                checkOut: new Date("2024-01-02")
            })
        })

        it("should filter out zero age children", () => {
            const values = {
                destination: { id: "BRA", name: "Brasilia - Brazil(BRA)" },
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
                adults: 2,
                childrens: 3,
                ageChildren1: 5,
                ageChildren2: 0,
                ageChildren3: 8,
                ageChildren4: 0,
                passengersInfo: "1 Habitación, 5 Huéspedes"
            }

            const result = parseValuesToParams(values)

            expect(result.ageChildrens).toEqual([5, 8])
        })

        it("should handle undefined age children", () => {
            const values = {
                destination: { id: "BRA", name: "Brasilia - Brazil(BRA)" },
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
                adults: 2,
                childrens: 2,
                ageChildren1: 5,
                ageChildren2: undefined,
                ageChildren3: 8,
                ageChildren4: undefined,
                passengersInfo: "1 Habitación, 4 Huéspedes"
            }

            const result = parseValuesToParams(values)

            expect(result.ageChildrens).toEqual([5, 8])
        })

        it("should use default dates when null", () => {
            const values = {
                destination: { id: "BRA", name: "Brasilia - Brazil(BRA)" },
                startDate: null,
                endDate: null,
                adults: 2,
                childrens: 0,
                ageChildren1: 0,
                ageChildren2: 0,
                ageChildren3: 0,
                ageChildren4: 0,
                passengersInfo: "1 Habitación, 2 Huéspedes"
            }

            const result = parseValuesToParams(values)

            expect(result.checkIn).toBeInstanceOf(Date)
            expect(result.checkOut).toBeInstanceOf(Date)
        })

        it("should handle empty destination", () => {
            const values = {
                destination: null,
                startDate: new Date("2024-01-01"),
                endDate: new Date("2024-01-02"),
                adults: 2,
                childrens: 0,
                ageChildren1: 0,
                ageChildren2: 0,
                ageChildren3: 0,
                ageChildren4: 0,
                passengersInfo: "1 Habitación, 2 Huéspedes"
            }

            const result = parseValuesToParams(values)

            expect(result.destination).toBe("")
        })
    })
})
