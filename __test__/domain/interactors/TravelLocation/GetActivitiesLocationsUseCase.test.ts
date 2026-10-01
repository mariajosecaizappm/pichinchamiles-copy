import { describe, it, expect, vi, beforeEach } from "vitest"
import GetActivitiesLocationsUseCase from "@/domain/interactors/TravelLocation/GetActivitiesLocationsUseCase"
import ITravelLocationRepository from "@/domain/repository/TravelLocation/ITravelLocationRepository"
import { ActivityLocation } from "@/domain/entity/TravelLocation/structure/activity"
import { StringComparator } from "@/domain/entity/List/list"
import { TravelLocationType } from "@/domain/entity/TravelLocation"

describe("GetActivitiesLocationsUseCase", () => {
    let useCase: GetActivitiesLocationsUseCase
    let mockRepository: vi.Mocked<ITravelLocationRepository>

    const mockActivityLocations: ActivityLocation[] = [
        {
            type: TravelLocationType.ACTIVITIES,
            cityCode: "NYC",
            cityName: "New York",
            countryName: "United States"
        },
        {
            type: TravelLocationType.ACTIVITIES,
            cityCode: "LAX",
            cityName: "Los Angeles", 
            countryName: "United States"
        },
        {
            type: TravelLocationType.ACTIVITIES,
            cityCode: "MIA",
            cityName: "Miami",
            countryName: "United States"
        },
        {
            type: TravelLocationType.ACTIVITIES,
            cityCode: "PAR",
            cityName: "Paris",
            countryName: "France"
        },
        {
            type: TravelLocationType.ACTIVITIES,
            cityCode: "LON",
            cityName: "London",
            countryName: "United Kingdom"
        }
    ]

    beforeEach(() => {
        mockRepository = {
            getHotelLocations: vi.fn()
        } as unknown as vi.Mocked<ITravelLocationRepository>

        useCase = new GetActivitiesLocationsUseCase(mockRepository)
    })

    describe("execute", () => {
        it("should return activity locations when search with CONTAINS finds results", async () => {
            mockRepository.getHotelLocations.mockResolvedValue({
                data: mockActivityLocations,
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 5,
                    totalPages: 1
                }
            })

            const result = await useCase.execute("new")

            expect(mockRepository.getHotelLocations).toHaveBeenCalledWith({
                page: 1,
                pageSize: 20,
                cityCode: { value: "new", comparator: StringComparator.CONTAINS },
                cityName: { value: "new", comparator: StringComparator.CONTAINS },
                countryName: { value: "new", comparator: StringComparator.CONTAINS },
                type: "activity"
            })
            expect(result).toEqual(mockActivityLocations)
        })

        it("should return empty array when search returns no results", async () => {
            mockRepository.getHotelLocations.mockResolvedValue({
                data: [],
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 0,
                    totalPages: 0
                }
            })

            const result = await useCase.execute("xyz")

            expect(mockRepository.getHotelLocations).toHaveBeenCalledWith({
                page: 1,
                pageSize: 20,
                cityCode: { value: "xyz", comparator: StringComparator.CONTAINS },
                cityName: { value: "xyz", comparator: StringComparator.CONTAINS },
                countryName: { value: "xyz", comparator: StringComparator.CONTAINS },
                type: "activity"
            })
            expect(result).toEqual([])
        })

        it("should handle repository errors gracefully", async () => {
            mockRepository.getHotelLocations.mockRejectedValue(new Error("API Error"))

            await expect(useCase.execute("test")).rejects.toThrow("API Error")
        })

        it("should pass correct parameters to repository", async () => {
            mockRepository.getHotelLocations.mockResolvedValue({
                data: mockActivityLocations,
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 5,
                    totalPages: 1
                }
            })

            await useCase.execute("test")

            expect(mockRepository.getHotelLocations).toHaveBeenCalledWith({
                page: 1,
                pageSize: 20,
                cityCode: { value: "test", comparator: StringComparator.CONTAINS },
                cityName: { value: "test", comparator: StringComparator.CONTAINS },
                countryName: { value: "test", comparator: StringComparator.CONTAINS },
                type: "activity"
            })
        })

        it("should search by city code", async () => {
            mockRepository.getHotelLocations.mockResolvedValue({
                data: [mockActivityLocations[0]], // NYC
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 1,
                    totalPages: 1
                }
            })

            const result = await useCase.execute("nyc")

            expect(mockRepository.getHotelLocations).toHaveBeenCalledWith({
                page: 1,
                pageSize: 20,
                cityCode: { value: "nyc", comparator: StringComparator.CONTAINS },
                cityName: { value: "nyc", comparator: StringComparator.CONTAINS },
                countryName: { value: "nyc", comparator: StringComparator.CONTAINS },
                type: "activity"
            })
            expect(result).toHaveLength(1)
            expect(result[0].cityCode).toBe("NYC")
        })

        it("should search by city name", async () => {
            mockRepository.getHotelLocations.mockResolvedValue({
                data: [mockActivityLocations[1]], // LAX
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 1,
                    totalPages: 1
                }
            })

            const result = await useCase.execute("angeles")

            expect(mockRepository.getHotelLocations).toHaveBeenCalledWith({
                page: 1,
                pageSize: 20,
                cityCode: { value: "angeles", comparator: StringComparator.CONTAINS },
                cityName: { value: "angeles", comparator: StringComparator.CONTAINS },
                countryName: { value: "angeles", comparator: StringComparator.CONTAINS },
                type: "activity"
            })
            expect(result).toHaveLength(1)
            expect(result[0].cityName).toBe("Los Angeles")
        })

        it("should search by country name", async () => {
            mockRepository.getHotelLocations.mockResolvedValue({
                data: [mockActivityLocations[3], mockActivityLocations[4]], // PAR, LON
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 2,
                    totalPages: 1
                }
            })

            const result = await useCase.execute("united")

            expect(mockRepository.getHotelLocations).toHaveBeenCalledWith({
                page: 1,
                pageSize: 20,
                cityCode: { value: "united", comparator: StringComparator.CONTAINS },
                cityName: { value: "united", comparator: StringComparator.CONTAINS },
                countryName: { value: "united", comparator: StringComparator.CONTAINS },
                type: "activity"
            })
            expect(result).toHaveLength(2)
        })

        it("should handle case insensitive search", async () => {
            mockRepository.getHotelLocations.mockResolvedValue({
                data: [mockActivityLocations[0]], // NYC
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 1,
                    totalPages: 1
                }
            })

            const result = await useCase.execute("NYC")

            expect(result).toHaveLength(1)
            expect(result[0].cityCode).toBe("NYC")
        })

        it("should handle partial matches", async () => {
            mockRepository.getHotelLocations.mockResolvedValue({
                data: mockActivityLocations.slice(0, 3), // US locations
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 3,
                    totalPages: 1
                }
            })

            const result = await useCase.execute("united")

            expect(result).toHaveLength(3)
            expect(result.every(location => location.countryName.includes("United"))).toBe(true)
        })

        it("should handle empty search string", async () => {
            mockRepository.getHotelLocations.mockResolvedValue({
                data: mockActivityLocations,
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 5,
                    totalPages: 1
                }
            })

            const result = await useCase.execute("")

            expect(mockRepository.getHotelLocations).toHaveBeenCalledWith({
                page: 1,
                pageSize: 20,
                cityCode: { value: "", comparator: StringComparator.CONTAINS },
                cityName: { value: "", comparator: StringComparator.CONTAINS },
                countryName: { value: "", comparator: StringComparator.CONTAINS },
                type: "activity"
            })
            expect(result).toEqual(mockActivityLocations)
        })

        it("should handle special characters in search", async () => {
            mockRepository.getHotelLocations.mockResolvedValue({
                data: [],
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 0,
                    totalPages: 0
                }
            })

            const result = await useCase.execute("ñáéíóú")

            expect(mockRepository.getHotelLocations).toHaveBeenCalledWith({
                page: 1,
                pageSize: 20,
                cityCode: { value: "ñáéíóú", comparator: StringComparator.CONTAINS },
                cityName: { value: "ñáéíóú", comparator: StringComparator.CONTAINS },
                countryName: { value: "ñáéíóú", comparator: StringComparator.CONTAINS },
                type: "activity"
            })
            expect(result).toEqual([])
        })

        it("should always use activity type", async () => {
            mockRepository.getHotelLocations.mockResolvedValue({
                data: mockActivityLocations,
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 5,
                    totalPages: 1
                }
            })

            await useCase.execute("any search")

            expect(mockRepository.getHotelLocations).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "activity"
                })
            )
        })

        it("should always use fixed pagination parameters", async () => {
            mockRepository.getHotelLocations.mockResolvedValue({
                data: mockActivityLocations,
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 5,
                    totalPages: 1
                }
            })

            await useCase.execute("any search")

            expect(mockRepository.getHotelLocations).toHaveBeenCalledWith(
                expect.objectContaining({
                    page: 1,
                    pageSize: 20
                })
            )
        })
    })
})
