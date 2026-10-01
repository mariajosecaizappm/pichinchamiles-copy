import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest"
import GetCarRentalLocationsUseCase from "@/domain/interactors/TravelLocation/GetCarRentalLocationsUseCase"
import type ITravelLocationRepository from "@/domain/repository/TravelLocation/ITravelLocationRepository"
import { CarRentalLocation, TravelLocationType } from "@/domain/entity/TravelLocation"
import { StringComparator } from "@/domain/entity/List/list"

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

const mockLocations: CarRentalLocation[] = [
    baseLocation,
    { ...baseLocation, id: "GYE-001", code: "GYE", cityCode: "GYE", cityName: "Guayaquil" },
]

describe("GetCarRentalLocationsUseCase", () => {
    let useCase: GetCarRentalLocationsUseCase
    let mockRepository: Mocked<ITravelLocationRepository>

    beforeEach(() => {
        mockRepository = {
            getFlightLocations: vi.fn(),
            getHotelLocations: vi.fn(),
            getCarRentalLocations: vi.fn(),
        } as unknown as Mocked<ITravelLocationRepository>

        useCase = new GetCarRentalLocationsUseCase(mockRepository)
    })

    describe("execute", () => {
        it("should call the repository with all expected query params", async () => {
            mockRepository.getCarRentalLocations.mockResolvedValue({
                data: mockLocations,
                pagination: { page: 1, pageSize: 20, total: 2, totalPages: 1 },
            })

            await useCase.execute("qui")

            expect(mockRepository.getCarRentalLocations).toHaveBeenCalledTimes(1)
            expect(mockRepository.getCarRentalLocations).toHaveBeenCalledWith({
                page: 1,
                pageSize: 20,
                cityCode: { value: "qui", comparator: StringComparator.CONTAINS },
                cityName: { value: "qui", comparator: StringComparator.CONTAINS },
                countryName: { value: "qui", comparator: StringComparator.CONTAINS },
                zone: { value: "None", comparator: StringComparator.NOT_EQUAL },
                type: TravelLocationType.CAR_RENTAL,
            })
        })

        it("should return only the data array from the repository response", async () => {
            mockRepository.getCarRentalLocations.mockResolvedValue({
                data: mockLocations,
                pagination: { page: 1, pageSize: 20, total: 2, totalPages: 1 },
            })

            const result = await useCase.execute("qui")

            expect(result).toEqual(mockLocations)
            expect(result).toHaveLength(2)
        })

        it("should return an empty array when the repository returns no locations", async () => {
            mockRepository.getCarRentalLocations.mockResolvedValue({
                data: [],
                pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
            })

            const result = await useCase.execute("xyz")

            expect(result).toEqual([])
        })

        it("should propagate the search term unchanged into all string filters", async () => {
            mockRepository.getCarRentalLocations.mockResolvedValue({
                data: [],
                pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
            })

            await useCase.execute("Buenos Aires")

            const callArg = mockRepository.getCarRentalLocations.mock.calls[0][0]
            expect(callArg.cityCode).toEqual({ value: "Buenos Aires", comparator: StringComparator.CONTAINS })
            expect(callArg.cityName).toEqual({ value: "Buenos Aires", comparator: StringComparator.CONTAINS })
            expect(callArg.countryName).toEqual({ value: "Buenos Aires", comparator: StringComparator.CONTAINS })
        })

        it("should always exclude zone='None' via NOT_EQUAL comparator", async () => {
            mockRepository.getCarRentalLocations.mockResolvedValue({
                data: [],
                pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
            })

            await useCase.execute("anything")

            const callArg = mockRepository.getCarRentalLocations.mock.calls[0][0]
            expect(callArg.zone).toEqual({ value: "None", comparator: StringComparator.NOT_EQUAL })
        })

        it("should accept an empty search string and still fire the request", async () => {
            mockRepository.getCarRentalLocations.mockResolvedValue({
                data: mockLocations,
                pagination: { page: 1, pageSize: 20, total: 2, totalPages: 1 },
            })

            const result = await useCase.execute("")

            expect(mockRepository.getCarRentalLocations).toHaveBeenCalledWith(
                expect.objectContaining({
                    cityCode: { value: "", comparator: StringComparator.CONTAINS },
                }),
            )
            expect(result).toEqual(mockLocations)
        })

        it("should propagate repository errors", async () => {
            mockRepository.getCarRentalLocations.mockRejectedValue(new Error("Algolia down"))

            await expect(useCase.execute("test")).rejects.toThrow("Algolia down")
        })
    })
})
