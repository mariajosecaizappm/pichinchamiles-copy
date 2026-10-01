import { describe, expect, it, vi } from "vitest"
import GetLocationsUseCase from "@/domain/interactors/Location/GetLocationsUseCase"
import { Location, LocationGrade } from "@/domain/entity/Location/structure/location"
import { StringComparator } from "@/domain/entity/List/list"
import type ILocationRepository from "@/domain/repository/Location/ILocationRepository"

const mockLocations: Location[] = [
    {
        id: "loc-1",
        name: "Quito",
        grade: LocationGrade.CITY,
        availableForDelivery: true,
        parentId: "state-1",
    },
    {
        id: "loc-2",
        name: "Guayaquil",
        grade: LocationGrade.CITY,
        availableForDelivery: true,
        parentId: "state-2",
    },
]

describe("GetLocationsUseCase", () => {
    const locationRepository = {
        getLocations: vi.fn(),
    }

    const useCase = new GetLocationsUseCase(locationRepository as unknown as ILocationRepository)

    describe("getLocation", () => {
        it("should call repository with query params and return data", async () => {
            locationRepository.getLocations.mockResolvedValueOnce({
                data: mockLocations,
                pagination: { page: 1, pageSize: 300, total: 2, totalPages: 1 },
            })

            const result = await useCase.getLocation({
                grade: LocationGrade.CITY,
                query: "qui",
            })

            expect(locationRepository.getLocations).toHaveBeenCalledWith({
                query: { value: "qui" },
                grade: LocationGrade.CITY,
                page: 1,
                pageSize: 300,
                availableForDelivery: true,
            })
            expect(result).toEqual(mockLocations)
        })

        it("should propagate repository errors", async () => {
            locationRepository.getLocations.mockRejectedValueOnce(new Error("locations down"))

            await expect(
                useCase.getLocation({ grade: LocationGrade.STATE, query: "pich" }),
            ).rejects.toThrow("locations down")
        })
    })

    describe("getLocations", () => {
        it("should include name filter when inputValue is provided", async () => {
            locationRepository.getLocations.mockResolvedValueOnce({
                data: [mockLocations[0]],
                pagination: { page: 1, pageSize: 300, total: 1, totalPages: 1 },
            })

            const result = await useCase.getLocations("state-1", LocationGrade.CITY, "qui")

            expect(locationRepository.getLocations).toHaveBeenCalledWith({
                name: { value: "qui", comparator: StringComparator.CONTAINS },
                grade: LocationGrade.CITY,
                parentId: "state-1",
                page: 1,
                pageSize: 300,
            })
            expect(result).toEqual([mockLocations[0]])
        })

        it("should omit name filter when inputValue is empty", async () => {
            locationRepository.getLocations.mockResolvedValueOnce({
                data: mockLocations,
                pagination: { page: 1, pageSize: 300, total: 2, totalPages: 1 },
            })

            const result = await useCase.getLocations("state-1", LocationGrade.CITY, "")

            expect(locationRepository.getLocations).toHaveBeenCalledWith({
                name: undefined,
                grade: LocationGrade.CITY,
                parentId: "state-1",
                page: 1,
                pageSize: 300,
            })
            expect(result).toEqual(mockLocations)
        })

        it("should include availableForDelivery filter when explicitly provided (zone search)", async () => {
            locationRepository.getLocations.mockResolvedValueOnce({
                data: mockLocations,
                pagination: { page: 1, pageSize: 300, total: 2, totalPages: 1 },
            })

            const result = await useCase.getLocations("city-1", LocationGrade.ZONE, "", true)

            expect(locationRepository.getLocations).toHaveBeenCalledWith({
                name: undefined,
                grade: LocationGrade.ZONE,
                parentId: "city-1",
                page: 1,
                pageSize: 300,
                availableForDelivery: true,
            })
            expect(result).toEqual(mockLocations)
        })

        it("should propagate repository errors", async () => {
            locationRepository.getLocations.mockRejectedValueOnce(new Error("search failed"))

            await expect(
                useCase.getLocations("state-1", LocationGrade.ZONE, "centro"),
            ).rejects.toThrow("search failed")
        })
    })
})
