import { describe, it, expect, vi, beforeEach } from "vitest"
import GetHotelsLocationsUseCase from "@/domain/interactors/TravelLocation/GetHotelsLocationsUseCase"
import ITravelLocationRepository from "@/domain/repository/TravelLocation/ITravelLocationRepository"
import { HotelLocation } from "@/domain/entity/TravelLocation"
import { StringComparator } from "@/domain/entity/List/list"

describe("GetHotelsLocationsUseCase", () => {
    let useCase: GetHotelsLocationsUseCase
    let mockRepository: vi.Mocked<ITravelLocationRepository>

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
        mockRepository = {
            getHotelLocations: vi.fn()
        } as unknown as vi.Mocked<ITravelLocationRepository>

        useCase = new GetHotelsLocationsUseCase(mockRepository)
    })

    describe("execute", () => {
        it("should return hotel locations when search with CONTAINS finds results", async () => {
            mockRepository.getHotelLocations.mockResolvedValue({
                data: mockHotelLocations,
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 3,
                    totalPages: 1
                }
            })

            const result = await useCase.execute("b")

            expect(mockRepository.getHotelLocations).toHaveBeenCalledWith({
                page: 1,
                pageSize: 20,
                cityCode: { value: "b", comparator: StringComparator.CONTAINS },
                cityName: { value: "b", comparator: StringComparator.CONTAINS },
                countryName: { value: "b", comparator: StringComparator.CONTAINS },
                type: "hotel"
            })
            expect(result).toEqual(mockHotelLocations)
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
                type: "hotel"
            })
            expect(result).toEqual([])
        })

        
        it("should handle repository errors gracefully", async () => {
            mockRepository.getHotelLocations.mockRejectedValue(new Error("API Error"))

            await expect(useCase.execute("test")).rejects.toThrow("API Error")
        })

        it("should pass correct parameters to repository", async () => {
            mockRepository.getHotelLocations.mockResolvedValue({
                data: mockHotelLocations,
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 3,
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
                type: "hotel"
            })
        })
    })
})
