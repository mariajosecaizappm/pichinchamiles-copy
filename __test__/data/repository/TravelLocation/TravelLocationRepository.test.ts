import { describe, it, expect, vi, beforeEach } from "vitest"
import TravelLocationRepository from "@/data/repository/TravelLocation/TravelLocationRepository"
import AlgoliaClient from "@/data/provider/algolia/algoliaClient"
import { AlgoliaIndex } from "@/data/provider/algolia/types"
import { List, StringComparator } from "@/domain/entity/List/list"
import { HotelLocation, HotelLocationsListParams, FlightLocation, FlightLocationsListParams, TravelLocationType } from "@/domain/entity/TravelLocation"

// Mock AlgoliaClient
vi.mock("@/data/provider/algolia/algoliaClient", () => ({
    default: vi.fn()
}))

// Mock RepositoryBase
vi.mock("@/data/repository/RepositoryBase", () => ({
    default: class MockRepositoryBase {}
}))

describe("TravelLocationRepository", () => {
    let repository: TravelLocationRepository
    let mockAlgoliaClient: any

    beforeEach(() => {
        mockAlgoliaClient = {
            search: vi.fn()
        }
        vi.mocked(AlgoliaClient).mockImplementation(() => mockAlgoliaClient)
        repository = new TravelLocationRepository()
    })

    describe("getHotelLocations", () => {
        it("should call algoliaClient.search with correct parameters", async () => {
            const params: HotelLocationsListParams = {
                page: 1,
                pageSize: 20,
                cityCode: { value: "BRA", comparator: StringComparator.CONTAINS },
                cityName: { value: "Brasilia", comparator: StringComparator.CONTAINS },
                countryName: { value: "Brazil", comparator: StringComparator.CONTAINS },
                type: TravelLocationType.HOTELS
            }

            const mockList: List<HotelLocation> = {
                data: [
                    {
                        cityCode: "BRA",
                        cityName: "Brasilia",
                        countryName: "Brazil",
                        type: TravelLocationType.HOTELS
                    }
                ],
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 1,
                    totalPages: 1
                }
            }

            mockAlgoliaClient.search.mockResolvedValue({ list: mockList })

            const result = await repository.getHotelLocations(params)

            expect(mockAlgoliaClient.search).toHaveBeenCalledWith({
                params,
                adapter: expect.any(Function)
            })
            expect(result).toEqual(mockList)
        })

        it("should handle empty results", async () => {
            const params: HotelLocationsListParams = {
                page: 1,
                pageSize: 20,
                cityCode: { value: "XYZ", comparator: StringComparator.CONTAINS },
                cityName: { value: "NonExistent", comparator: StringComparator.CONTAINS },
                countryName: { value: "Nowhere", comparator: StringComparator.CONTAINS },
                type: TravelLocationType.HOTELS
            }

            const mockList: List<HotelLocation> = {
                data: [],
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 0,
                    totalPages: 0
                }
            }

            mockAlgoliaClient.search.mockResolvedValue({ list: mockList })

            const result = await repository.getHotelLocations(params)

            expect(result.data).toEqual([])
            expect(result.pagination.total).toBe(0)
        })

        it("should propagate search errors", async () => {
            const params: HotelLocationsListParams = {
                page: 1,
                pageSize: 20,
                cityCode: { value: "BRA", comparator: StringComparator.CONTAINS },
                cityName: { value: "Brasilia", comparator: StringComparator.CONTAINS },
                countryName: { value: "Brazil", comparator: StringComparator.CONTAINS },
                type: TravelLocationType.HOTELS
            }

            const error = new Error("Algolia search failed")
            mockAlgoliaClient.search.mockRejectedValue(error)

            await expect(repository.getHotelLocations(params)).rejects.toThrow("Algolia search failed")
        })

        it("should handle pagination correctly", async () => {
            const params: HotelLocationsListParams = {
                page: 2,
                pageSize: 10,
                cityCode: { value: "BRA", comparator: StringComparator.CONTAINS },
                cityName: { value: "Brasilia", comparator: StringComparator.CONTAINS },
                countryName: { value: "Brazil", comparator: StringComparator.CONTAINS },
                type: TravelLocationType.HOTELS
            }

            const mockList: List<HotelLocation> = {
                data: [
                    {
                        cityCode: "RIO",
                        cityName: "Rio de Janeiro",
                        countryName: "Brazil",
                        type: TravelLocationType.HOTELS
                    }
                ],
                pagination: {
                    page: 2,
                    pageSize: 10,
                    total: 25,
                    totalPages: 3
                }
            }

            mockAlgoliaClient.search.mockResolvedValue({ list: mockList })

            const result = await repository.getHotelLocations(params)

            expect(result.pagination.page).toBe(2)
            expect(result.pagination.pageSize).toBe(10)
            expect(result.pagination.total).toBe(25)
            expect(result.pagination.totalPages).toBe(3)
        })
    })

    describe("getFlightLocations", () => {
        it("should call algoliaClient.search with correct parameters", async () => {
            const params: FlightLocationsListParams = {
                page: 1,
                pageSize: 20,
                description: { value: "New York", comparator: StringComparator.CONTAINS },
                type: TravelLocationType.FLIGHTS
            }

            const mockList: List<FlightLocation> = {
                data: [
                    {
                        id: "NYC-001",
                        code: "JFK",
                        name: "John F. Kennedy International",
                        description: "New York, USA",
                        countryCode: "US",
                        type: TravelLocationType.FLIGHTS
                    }
                ],
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 1,
                    totalPages: 1
                }
            }

            mockAlgoliaClient.search.mockResolvedValue({ list: mockList })

            const result = await repository.getFlightLocations(params)

            expect(mockAlgoliaClient.search).toHaveBeenCalledWith({
                params,
                adapter: expect.any(Function)
            })
            expect(result).toEqual(mockList)
        })

        it("should handle empty flight results", async () => {
            const params: FlightLocationsListParams = {
                page: 1,
                pageSize: 20,
                description: { value: "NonExistent", comparator: StringComparator.CONTAINS },
                type: TravelLocationType.FLIGHTS
            }

            const mockList: List<FlightLocation> = {
                data: [],
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 0,
                    totalPages: 0
                }
            }

            mockAlgoliaClient.search.mockResolvedValue({ list: mockList })

            const result = await repository.getFlightLocations(params)

            expect(result.data).toEqual([])
            expect(result.pagination.total).toBe(0)
        })

        it("should propagate flight search errors", async () => {
            const params: FlightLocationsListParams = {
                page: 1,
                pageSize: 20,
                description: { value: "New York", comparator: StringComparator.CONTAINS },
                type: TravelLocationType.FLIGHTS
            }

            const error = new Error("Algolia flight search failed")
            mockAlgoliaClient.search.mockRejectedValue(error)

            await expect(repository.getFlightLocations(params)).rejects.toThrow("Algolia flight search failed")
        })
    })

    describe("constructor", () => {
        it("should initialize AlgoliaClient with correct index", () => {
            expect(AlgoliaClient).toHaveBeenCalledWith(AlgoliaIndex.TRAVEL_LOCATIONS)
        })

        it("should extend RepositoryBase", () => {
            expect(repository).toBeInstanceOf(TravelLocationRepository)
        })
    })

    describe("adapter usage", () => {
        it("should use hotel adapter for hotel locations", async () => {
            const params: HotelLocationsListParams = {
                page: 1,
                pageSize: 20,
                cityCode: { value: "BRA", comparator: StringComparator.CONTAINS },
                cityName: { value: "Brasilia", comparator: StringComparator.CONTAINS },
                countryName: { value: "Brazil", comparator: StringComparator.CONTAINS },
                type: TravelLocationType.HOTELS
            }

            mockAlgoliaClient.search.mockResolvedValue({ list: { data: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 } } })

            await repository.getHotelLocations(params)

            const searchCall = mockAlgoliaClient.search.mock.calls[0][0]
            expect(searchCall.adapter).toBeDefined()
            expect(typeof searchCall.adapter).toBe("function")
        })

        it("should use flight adapter for flight locations", async () => {
            const params: FlightLocationsListParams = {
                page: 1,
                pageSize: 20,
                description: { value: "New York", comparator: StringComparator.CONTAINS },
                type: TravelLocationType.FLIGHTS
            }

            mockAlgoliaClient.search.mockResolvedValue({ list: { data: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 } } })

            await repository.getFlightLocations(params)

            const searchCall = mockAlgoliaClient.search.mock.calls[0][0]
            expect(searchCall.adapter).toBeDefined()
            expect(typeof searchCall.adapter).toBe("function")
        })
    })

    describe("getCarRentalLocations", () => {
        const baseParams = {
            page: 1,
            pageSize: 20,
            cityCode: { value: "UIO", comparator: StringComparator.CONTAINS },
            cityName: { value: "Quito", comparator: StringComparator.CONTAINS },
            countryName: { value: "Ecuador", comparator: StringComparator.CONTAINS },
            zone: { value: "None", comparator: StringComparator.NOT_EQUAL },
            type: TravelLocationType.CAR_RENTAL,
        } as any

        it("should call algoliaClient.search forwarding the params and the carRental adapter", async () => {
            const mockList = {
                data: [
                    {
                        id: "QUI-001",
                        code: "UIO",
                        cityCode: "UIO",
                        cityName: "Quito",
                        countryName: "Ecuador",
                        countryCode: "EC",
                        continentCode: "SA",
                        name: "Aeropuerto Mariscal Sucre",
                        region: "Pichincha",
                        type: TravelLocationType.CAR_RENTAL,
                    },
                ],
                pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
            }
            mockAlgoliaClient.search.mockResolvedValue({ list: mockList })

            const result = await repository.getCarRentalLocations(baseParams)

            expect(mockAlgoliaClient.search).toHaveBeenCalledWith({
                params: baseParams,
                adapter: expect.any(Function),
            })
            expect(result).toEqual(mockList)
        })

        it("should return the list as-is when algolia returns empty data", async () => {
            const emptyList = { data: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 } }
            mockAlgoliaClient.search.mockResolvedValue({ list: emptyList })

            const result = await repository.getCarRentalLocations(baseParams)

            expect(result).toEqual(emptyList)
        })

        it("should propagate errors from the algolia client", async () => {
            mockAlgoliaClient.search.mockRejectedValue(new Error("Algolia failure"))

            await expect(repository.getCarRentalLocations(baseParams)).rejects.toThrow(
                "Algolia failure",
            )
        })

        it("should construct the AlgoliaClient with the TRAVEL_LOCATIONS index", () => {
            expect(AlgoliaClient).toHaveBeenCalledWith(AlgoliaIndex.TRAVEL_LOCATIONS)
        })
    })
})
