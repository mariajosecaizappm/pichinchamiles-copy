import { describe, it, expect, vi, beforeEach } from "vitest"
import { StringComparator } from "@/domain/entity/List/list"
import { TravelLocationType } from "@/domain/entity/TravelLocation"
import type { FlightLocation } from "@/domain/entity/TravelLocation"
import type ITravelLocationRepository from "@/domain/repository/TravelLocation/ITravelLocationRepository"
import GetFlightsLocationsUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/GetFlightsLocationsUseCase"

const emptyPagination = { page: 1, pageSize: 10, total: 0, totalPages: 0 }

const buildFlightLocation = (overrides: Partial<FlightLocation> & { id: string }): FlightLocation => ({
    type: TravelLocationType.FLIGHTS,
    code: "UIO",
    name: "Quito",
    description: "Quito, Ecuador",
    countryCode: "EC",
    ...overrides,
})

describe("GetFlightsLocationsUseCase", () => {
    let repository: ITravelLocationRepository
    let useCase: GetFlightsLocationsUseCase

    beforeEach(() => {
        repository = { getFlightLocations: vi.fn() } as unknown as ITravelLocationRepository
        useCase = new GetFlightsLocationsUseCase(repository)
    })

    it("should call repository with correct params", async () => {
        vi.mocked(repository.getFlightLocations).mockResolvedValue({ data: [], pagination: emptyPagination })

        await useCase.execute("Quito")

        expect(repository.getFlightLocations).toHaveBeenCalledWith({
            page: 1,
            pageSize: 10,
            description: { value: "Quito", comparator: StringComparator.CONTAINS },
            type: TravelLocationType.FLIGHTS,
        })
    })

    it("should return data array from the list result", async () => {
        const locations = [
            buildFlightLocation({ id: "loc-1", code: "UIO", description: "Quito, Ecuador" }),
            buildFlightLocation({ id: "loc-2", code: "GYE", description: "Guayaquil, Ecuador" }),
        ]
        vi.mocked(repository.getFlightLocations).mockResolvedValue({
            data: locations,
            pagination: { ...emptyPagination, total: 2 },
        })

        const result = await useCase.execute("Ecuador")

        expect(result).toHaveLength(2)
        expect(result[0].code).toBe("UIO")
        expect(result[1].code).toBe("GYE")
    })

    it("should return empty array when no locations found", async () => {
        vi.mocked(repository.getFlightLocations).mockResolvedValue({ data: [], pagination: emptyPagination })

        const result = await useCase.execute("xyz")

        expect(result).toHaveLength(0)
    })

    it("should propagate repository errors", async () => {
        vi.mocked(repository.getFlightLocations).mockRejectedValue(new Error("Network error"))

        await expect(useCase.execute("Quito")).rejects.toThrow("Network error")
    })
})
