import { beforeEach, describe, expect, it, vi } from "vitest"
import AlgoliaClient from "@/data/provider/algolia/algoliaClient"
import { AlgoliaIndex } from "@/data/provider/algolia/types"
import { List } from "@/domain/entity/List/list"
import { Location, LocationGrade, LocationsListParams } from "@/domain/entity/Location/structure/location"

vi.mock("@/data/provider/algolia/algoliaClient", () => ({
    default: vi.fn(),
}))

vi.mock("@/data/repository/RepositoryBase", () => ({
    default: class MockRepositoryBase {},
}))

describe("LocationRepository", () => {
    let mockAlgoliaClient: { search: ReturnType<typeof vi.fn> }

    beforeEach(() => {
        mockAlgoliaClient = { search: vi.fn() }
        vi.mocked(AlgoliaClient).mockImplementation(() => mockAlgoliaClient as unknown as AlgoliaClient)
        vi.clearAllMocks()
        process.env.NEXT_PUBLIC_PROGRAM_ID = "test-program-id"
    })

    it("initializes AlgoliaClient with LOCATIONS index", async () => {
        vi.resetModules()
        const { default: LocationRepository } = await import("@/data/repository/Location/LocationRepository")
        new LocationRepository()

        expect(AlgoliaClient).toHaveBeenCalledWith(AlgoliaIndex.LOCATIONS)
    })

    it("calls algoliaClient.search with params and getLocationsAdapter", async () => {
        vi.resetModules()
        const params: LocationsListParams = {
            page: 1,
            pageSize: 20,
            grade: LocationGrade.CITY,
            parentId: "state-1",
            availableForDelivery: true,
        }

        const mockList: List<Location> = {
            data: [
                {
                    id: "city-1",
                    name: "Quito",
                    grade: LocationGrade.CITY,
                    availableForDelivery: true,
                    parentId: "state-1",
                },
            ],
            pagination: {
                page: 1,
                pageSize: 20,
                total: 1,
                totalPages: 1,
            },
        }

        mockAlgoliaClient.search.mockResolvedValue({ list: mockList })

        const { default: LocationRepository } = await import("@/data/repository/Location/LocationRepository")
        const repository = new LocationRepository()
        const result = await repository.getLocations(params)

        expect(mockAlgoliaClient.search).toHaveBeenCalledWith({
            params,
            adapter: expect.any(Function),
        })

        const searchCall = mockAlgoliaClient.search.mock.calls[0][0]
        expect(searchCall.adapter).toBeDefined()
        expect(typeof searchCall.adapter).toBe("function")
        expect(searchCall.adapter({
            id: "city-1",
            name: "Quito",
            grade: LocationGrade.CITY,
            availableForDelivery: true,
            parentId: "state-1",
        })).toEqual(mockList.data[0])

        expect(result).toEqual(mockList)
    })

    it("propagates search errors", async () => {
        vi.resetModules()
        const params: LocationsListParams = { page: 1, pageSize: 10 }
        const error = new Error("Algolia search failed")
        mockAlgoliaClient.search.mockRejectedValue(error)

        const { default: LocationRepository } = await import("@/data/repository/Location/LocationRepository")
        const repository = new LocationRepository()

        await expect(repository.getLocations(params)).rejects.toThrow("Algolia search failed")
    })
})
