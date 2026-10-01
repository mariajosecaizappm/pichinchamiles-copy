import {describe, it, expect, vi, beforeEach} from "vitest"
import ProductRepository from "@/data/repository/Product/ProductRepository"
import {ProductListParams} from "@/domain/entity/Product/product"

const mockSearch = vi.fn()
vi.mock("@/data/provider/algolia/algoliaClient", () => ({
    default: class {
        search = mockSearch
    }
}))
vi.mock("@/data/adapters/Product/productAdapter")

describe("ProductRepository", () => {
    let productRepository: ProductRepository

    beforeEach(() => {
        vi.clearAllMocks()
        process.env.NEXT_PUBLIC_PROGRAM_ID = "program-1"
        productRepository = new ProductRepository()
    })

    describe("getProducts", () => {
        it("should return product list from algolia search", async () => {
            const mockParams: ProductListParams = {
                page: 1,
                pageSize: 10
            }
            const mockList = {
                data: [],
                pagination: {
                    page: 1,
                    pageSize: 10,
                    total: 0,
                    totalPages: 0
                }
            }

            mockSearch.mockResolvedValue({ list: mockList, facets: {} })

            const result = await productRepository.getProducts(mockParams)

            expect(mockSearch).toHaveBeenCalled()
            expect(result).toEqual(mockList)
        })
    })

    describe("getProductSearch", () => {
        it("should call algolia client search and return list, categories and brands", async () => {
            const mockParams: ProductListParams = {
                page: 1,
                pageSize: 10,
                categoryId: "cat-1"
            }
            const mockList = {
                data: [],
                pagination: {
                    page: 1,
                    pageSize: 10,
                    total: 0,
                    totalPages: 0
                }
            }

            mockSearch.mockResolvedValue({
                list: mockList,
                facets: {
                    "brand.brandId": { "b1": 2, "b2": 0 },
                    "categories.categoryId": { "c1": 1 },
                    "categories.name": { "Cat A": 3 }
                }
            })

            const result = await productRepository.getProductSearch(mockParams)

            expect(mockSearch).toHaveBeenCalledWith(expect.objectContaining({
                nameMap: {
                    brandSlug: "brand.slug",
                    brandId: "brand.brandId",
                    categoryId: "categories.categoryId",
                    parentCategoryId: "categories.parentId"
                },
                params: {
                    ...mockParams,
                    programId: "program-1"
                }
            }))
            expect(result).toEqual({
                list: mockList,
                brandIds: ["b1"],
                categoryIds: ["c1"],
                categories: { "Cat A": 3 }
            })
        })
    })

    describe("getProductSuggestions", () => {
        it("should call algolia client search with suggestions index and return suggestions", async () => {
            const mockParams: ProductListParams = {
                page: 1,
                pageSize: 10,
                name: "test query"
            }

            const mockSuggestions = [
                { query: "test", popularity: 100, objectID: "1" },
                { query: "test query", popularity: 50, objectID: "2" }
            ]

            mockSearch.mockResolvedValue({
                list: {
                    data: mockSuggestions,
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 2,
                        totalPages: 1
                    }
                }
            })

            const result = await productRepository.getProductSuggestions(mockParams)

            expect(mockSearch).toHaveBeenCalledWith(expect.objectContaining({
                params: {
                    ...mockParams,
                    query: "test query"
                }
            }))
            expect(result).toEqual(mockSuggestions)
        })
    })
})
