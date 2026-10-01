import { describe, it, expect, vi, beforeEach } from "vitest"

const mockSearch = vi.fn()

vi.mock("@/data/provider/algolia/algoliaClient", () => ({
    default: vi.fn().mockImplementation(() => ({
        search: mockSearch,
    })),
}))

vi.mock("@/data/adapters/Category/categoryAdapter", () => ({
    getCategoryAdapter: vi.fn(),
}))

import CategoryRepository from "@/data/repository/Category/CategoryRepository"
import { getCategoryAdapter } from "@/data/adapters/Category/categoryAdapter"

describe("CategoryRepository", () => {
    let repository: CategoryRepository

    beforeEach(() => {
        vi.clearAllMocks()
        process.env.NEXT_PUBLIC_API_URL = "https://api.test.com"
        process.env.NEXT_PUBLIC_CLIENT_ID = "test-client-id"
        process.env.NEXT_PUBLIC_CLIENT_SECRET = "test-client-secret"
        process.env.NEXT_PUBLIC_PROGRAM_ID = "test-program-id"
        repository = new CategoryRepository()
    })

    describe("getCategories", () => {
        it("should call algoliaClient.search with correct params when isMainCategory is true", async () => {
            const mockList = {
                data: [],
                pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
            }
            mockSearch.mockResolvedValue({ list: mockList })

            await repository.getCategories({ isMainCategory: true, pageSize: 20 })

            expect(mockSearch).toHaveBeenCalledWith({
                params: {
                    pageSize: 20,
                    programId: "test-program-id",
                },
                nameMap: {
                    programId: "programCategories.programId",
                },
                filters: expect.stringContaining("has_not_parent_slug"),
                adapter: getCategoryAdapter,
            })
        })

        it("should include programId in the filter when isMainCategory is true", async () => {
            const mockList = {
                data: [],
                pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
            }
            mockSearch.mockResolvedValue({ list: mockList })

            await repository.getCategories({ isMainCategory: true, pageSize: 20 })

            const callArgs = mockSearch.mock.calls[0][0]
            expect(callArgs.filters).toContain("test-program-id")
        })

        it("should not set filters when isMainCategory is false", async () => {
            const mockList = {
                data: [],
                pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
            }
            mockSearch.mockResolvedValue({ list: mockList })

            await repository.getCategories({ isMainCategory: false, pageSize: 10 })

            expect(mockSearch).toHaveBeenCalledWith(
                expect.objectContaining({
                    filters: undefined,
                })
            )
        })

        it("should not set filters when isMainCategory is not provided", async () => {
            const mockList = {
                data: [],
                pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
            }
            mockSearch.mockResolvedValue({ list: mockList })

            await repository.getCategories({ pageSize: 10 })

            expect(mockSearch).toHaveBeenCalledWith(
                expect.objectContaining({
                    filters: undefined,
                })
            )
        })

        it("should return the list from the algolia response", async () => {
            const mockCategories = [
                { id: "1", name: "Hogar", slug: "hogar", parent: null },
            ]
            const mockList = {
                data: mockCategories,
                pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
            }
            mockSearch.mockResolvedValue({ list: mockList })

            const result = await repository.getCategories({ isMainCategory: true, pageSize: 20 })

            expect(result).toEqual(mockList)
        })

        it("should pass additional params to algoliaClient.search", async () => {
            const mockList = {
                data: [],
                pagination: { page: 1, pageSize: 5, total: 0, totalPages: 0 },
            }
            mockSearch.mockResolvedValue({ list: mockList })

            await repository.getCategories({ pageSize: 5, page: 2 })

            expect(mockSearch).toHaveBeenCalledWith(
                expect.objectContaining({
                    params: expect.objectContaining({
                        pageSize: 5,
                        page: 2,
                        programId: "test-program-id",
                    }),
                })
            )
        })

        it("should propagate errors from algoliaClient", async () => {
            mockSearch.mockRejectedValue(new Error("Algolia error"))

            await expect(
                repository.getCategories({ isMainCategory: true, pageSize: 20 })
            ).rejects.toThrow("Algolia error")
        })

        it("should always map programId to programCategories.programId", async () => {
            const mockList = {
                data: [],
                pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
            }
            mockSearch.mockResolvedValue({ list: mockList })

            await repository.getCategories({ pageSize: 20 })

            expect(mockSearch).toHaveBeenCalledWith(
                expect.objectContaining({
                    nameMap: { programId: "programCategories.programId" },
                })
            )
        })
    })
})
