import { describe, it, expect, vi, beforeEach } from "vitest"
import ProductsSearchUseCase from "@/domain/interactors/Products/ProductsSearchUseCase"
import type IProductRepository from "@/domain/repository/Product/IProductRepository"
import { ProductSearch, ProductSuggestion } from "@/domain/entity/Product/product"
import { StringComparator, NumberComparator } from "@/domain/entity/List/list"

const mockProductRepository = {
    getProducts: vi.fn(),
    getProductSuggestions: vi.fn(),
    getProductSearch: vi.fn(),
    getProductBySlug: vi.fn()
} satisfies Partial<IProductRepository> as IProductRepository

describe("ProductsSearchUseCase", () => {
    let useCase: ProductsSearchUseCase

    beforeEach(() => {
        vi.clearAllMocks()
        useCase = new ProductsSearchUseCase(mockProductRepository)
    })

    describe("searchProducts", () => {
        it("should call repository with empty search parameters", async () => {
            const mockProductSearch: ProductSearch = {
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0
                    }
                },
                brandIds: [],
                categoryIds: [],
                categories: {}
            }

            vi.mocked(mockProductRepository.getProductSearch).mockResolvedValue(mockProductSearch)

            const params = {
                search: "",
                category: [],
                sort: "",
                brand: "",
                page: 1,
                perPage: 10
            }

            await useCase.searchProducts(params)

            expect(mockProductRepository.getProductSearch).toHaveBeenCalledWith({
                page: 1,
                pageSize: 10,
                categoryId: [],
                brandId: "",
                sort: undefined,
                minPointsPrice: undefined
            })
        })

        it("should call repository with search query parameters", async () => {
            const mockProductSearch: ProductSearch = {
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0
                    }
                },
                brandIds: [],
                categoryIds: [],
                categories: {}
            }

            vi.mocked(mockProductRepository.getProductSearch).mockResolvedValue(mockProductSearch)

            const params = {
                search: "test product",
                category: [],
                sort: "",
                brand: "",
                page: 1,
                perPage: 10
            }

            await useCase.searchProducts(params)

            expect(mockProductRepository.getProductSearch).toHaveBeenCalledWith({
                name: {
                    value: "test product",
                    comparator: StringComparator.CONTAINS
                },
                description: {
                    value: "test product",
                    comparator: StringComparator.CONTAINS
                },
                keywords: {
                    value: "test product",
                    comparator: StringComparator.CONTAINS
                },
                seoKeywords: {
                    value: "test product",
                    comparator: StringComparator.CONTAINS
                },
                page: 1,
                pageSize: 10,
                categoryId: [],
                brandId: "",
                sort: undefined,
                minPointsPrice: undefined
            })
        })

        it("should call repository with sort parameters", async () => {
            const mockProductSearch: ProductSearch = {
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0
                    }
                },
                brandIds: [],
                categoryIds: [],
                categories: {}
            }

            vi.mocked(mockProductRepository.getProductSearch).mockResolvedValue(mockProductSearch)

            const params = {
                search: "",
                category: [],
                sort: "points-desc",
                brand: "",
                page: 1,
                perPage: 10
            }

            await useCase.searchProducts(params)

            expect(mockProductRepository.getProductSearch).toHaveBeenCalledWith({
                page: 1,
                pageSize: 10,
                categoryId: [],
                brandId: "",
                sort: {
                    type: "desc",
                    field: "points"
                },
                minPointsPrice: undefined
            })
        })

        it("should call repository with priority-asc sort", async () => {
            const mockProductSearch: ProductSearch = {
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0
                    }
                },
                brandIds: [],
                categoryIds: [],
                categories: {}
            }

            vi.mocked(mockProductRepository.getProductSearch).mockResolvedValue(mockProductSearch)

            const params = {
                search: "",
                category: [],
                sort: "priority-asc",
                brand: "",
                page: 1,
                perPage: 10
            }

            await useCase.searchProducts(params)

            expect(mockProductRepository.getProductSearch).toHaveBeenCalledWith({
                page: 1,
                pageSize: 10,
                categoryId: [],
                brandId: "",
                sort: {
                    type: "asc",
                    field: "priority"
                },
                minPointsPrice: undefined
            })
        })

        it("should call repository with product IDs and default sort", async () => {
            const mockProductSearch: ProductSearch = {
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0
                    }
                },
                brandIds: [],
                categoryIds: [],
                categories: {}
            }

            vi.mocked(mockProductRepository.getProductSearch).mockResolvedValue(mockProductSearch)

            const params = {
                search: "",
                category: [],
                sort: "",
                brand: "",
                productIds: ["1", "2", "3"],
                page: 1,
                perPage: 10
            }

            await useCase.searchProducts(params)

            expect(mockProductRepository.getProductSearch).toHaveBeenCalledWith({
                page: 1,
                pageSize: 10,
                categoryId: [],
                brandId: "",
                sort: {
                    type: "asc",
                    field: "priority"
                },
                minPointsPrice: undefined,
                id: ["1", "2", "3"]
            })
        })

        it("should call repository with points range", async () => {
            const mockProductSearch: ProductSearch = {
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0
                    }
                },
                brandIds: [],
                categoryIds: [],
                categories: {}
            }

            vi.mocked(mockProductRepository.getProductSearch).mockResolvedValue(mockProductSearch)

            const params = {
                search: "",
                category: [],
                sort: "",
                brand: "",
                points: [1000, 5000],
                page: 1,
                perPage: 10
            }

            await useCase.searchProducts(params)

            expect(mockProductRepository.getProductSearch).toHaveBeenCalledWith({
                id: undefined,
                page: 1,
                pageSize: 10,
                categoryId: [],
                brandId: "",
                sort: undefined,
                minPointsPrice: {
                    value: 5000,
                    comparator: NumberComparator.LESS_THAN_EQUAL_TO,
                    and: {
                        value: 1000,
                        comparator: NumberComparator.GREATER_THAN_EQUAL_TO
                    }
                }
            })
        })

        it("should handle special case for 10001 points", async () => {
            const mockProductSearch: ProductSearch = {
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0
                    }
                },
                brandIds: [],
                categoryIds: [],
                categories: {}
            }

            vi.mocked(mockProductRepository.getProductSearch).mockResolvedValue(mockProductSearch)

            const params = {
                search: "",
                category: [],
                sort: "",
                brand: "",
                points: [10001],
                page: 1,
                perPage: 10
            }

            await useCase.searchProducts(params)

            expect(mockProductRepository.getProductSearch).toHaveBeenCalledWith({
                page: 1,
                pageSize: 10,
                categoryId: [],
                brandId: "",
                sort: undefined,
                minPointsPrice: {
                    value: 10001,
                    comparator: NumberComparator.GREATER_THAN_EQUAL_TO
                }
            })
        })

        it("should auto-add priority-asc sort when productIds provided without sort", async () => {
            const mockProductSearch: ProductSearch = {
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0
                    }
                },
                brandIds: [],
                categoryIds: [],
                categories: {}
            }

            vi.mocked(mockProductRepository.getProductSearch).mockResolvedValue(mockProductSearch)

            const params = {
                search: "",
                category: [],
                sort: "",
                brand: "",
                page: 1,
                perPage: 10,
                productIds: ["1", "2", "3"]
            }

            await useCase.searchProducts(params)

            expect(mockProductRepository.getProductSearch).toHaveBeenCalledWith({
                page: 1,
                pageSize: 10,
                categoryId: [],
                brandId: "",
                sort: {
                    field: "priority",
                    type: "asc"
                },
                id: ["1", "2", "3"],
                minPointsPrice: undefined
            })
        })

        it("should handle single point value less than 10001 as LESS_THAN_EQUAL_TO", async () => {
            const mockProductSearch: ProductSearch = {
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0
                    }
                },
                brandIds: [],
                categoryIds: [],
                categories: {}
            }

            vi.mocked(mockProductRepository.getProductSearch).mockResolvedValue(mockProductSearch)

            const params = {
                search: "",
                category: [],
                sort: "",
                brand: "",
                points: [5000],
                page: 1,
                perPage: 10
            }

            await useCase.searchProducts(params)

            expect(mockProductRepository.getProductSearch).toHaveBeenCalledWith({
                page: 1,
                pageSize: 10,
                categoryId: [],
                brandId: "",
                sort: undefined,
                minPointsPrice: {
                    value: 5000,
                    comparator: NumberComparator.LESS_THAN_EQUAL_TO
                }
            })
        })

        it("should handle range where max equals min as single value", async () => {
            const mockProductSearch: ProductSearch = {
                list: {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0
                    }
                },
                brandIds: [],
                categoryIds: [],
                categories: {}
            }

            vi.mocked(mockProductRepository.getProductSearch).mockResolvedValue(mockProductSearch)

            const params = {
                search: "",
                category: [],
                sort: "",
                brand: "",
                points: [5000, 5000],
                page: 1,
                perPage: 10
            }

            await useCase.searchProducts(params)

            expect(mockProductRepository.getProductSearch).toHaveBeenCalledWith(
                expect.objectContaining({
                    minPointsPrice: {
                        value: 5000,
                        comparator: NumberComparator.LESS_THAN_EQUAL_TO
                    }
                })
            )
        })

        it("should handle all parameters together", async () => {
            const mockProductSearch: ProductSearch = {
                list: {
                    data: [],
                    pagination: {
                        page: 2,
                        pageSize: 20,
                        total: 0,
                        totalPages: 0
                    }
                },
                brandIds: [],
                categoryIds: [],
                categories: {}
            }

            vi.mocked(mockProductRepository.getProductSearch).mockResolvedValue(mockProductSearch)

            const params = {
                search: "laptop",
                category: ["electronics", "computers"],
                sort: "priority-asc",
                brand: "apple",
                points: [1000, 5000],
                page: 2,
                perPage: 20,
                productIds: ["1", "2"]
            }

            await useCase.searchProducts(params)

            expect(mockProductRepository.getProductSearch).toHaveBeenCalledWith({
                name: {
                    value: "laptop",
                    comparator: StringComparator.CONTAINS
                },
                description: {
                    value: "laptop",
                    comparator: StringComparator.CONTAINS
                },
                keywords: {
                    value: "laptop",
                    comparator: StringComparator.CONTAINS
                },
                seoKeywords: {
                    value: "laptop",
                    comparator: StringComparator.CONTAINS
                },
                id: ["1", "2"],
                categoryId: ["electronics", "computers"],
                brandId: "apple",
                minPointsPrice: {
                    value: 5000,
                    comparator: NumberComparator.LESS_THAN_EQUAL_TO,
                    and: {
                        value: 1000,
                        comparator: NumberComparator.GREATER_THAN_EQUAL_TO
                    }
                },
                sort: {
                    type: "asc",
                    field: "priority"
                },
                page: 2,
                pageSize: 20
            })
        })
    })

    describe("getAutocompleteProducts", () => {
        it("should return empty array for empty search", async () => {
            vi.mocked(mockProductRepository.getProductSuggestions).mockResolvedValue([])

            const result = await useCase.getAutocompleteProducts("")

            expect(result).toEqual([])
            expect(mockProductRepository.getProductSuggestions).toHaveBeenCalledWith({
                name: undefined,
            })
        })

        it("should return empty array for whitespace-only search", async () => {
            vi.mocked(mockProductRepository.getProductSuggestions).mockResolvedValue([])

            const result = await useCase.getAutocompleteProducts("   ")

            expect(result).toEqual([])
            expect(mockProductRepository.getProductSuggestions).toHaveBeenCalledWith({
                name: {
                    value: "   ",
                    comparator: StringComparator.CONTAINS
                },
            })
        })

        it("should call repository with search parameters", async () => {
            const mockProducts: ProductSuggestion[] = [
                {
                    query: "Test Product",
                    popularity: 1,
                    objectID: "1"
                }
            ]

            vi.mocked(mockProductRepository.getProductSuggestions).mockResolvedValue(mockProducts)

            const result = await useCase.getAutocompleteProducts("test")

            expect(mockProductRepository.getProductSuggestions).toHaveBeenCalledWith({
                name: {
                    value: "test",
                    comparator: StringComparator.CONTAINS
                },
            })

            expect(result).toEqual(mockProducts)
        })

        it("should work without category parameter", async () => {
            const mockProducts: ProductSuggestion[] = []

            vi.mocked(mockProductRepository.getProductSuggestions).mockResolvedValue(mockProducts)

            await useCase.getAutocompleteProducts("test")

            expect(mockProductRepository.getProductSuggestions).toHaveBeenCalledWith({
                name: {
                    value: "test",
                    comparator: StringComparator.CONTAINS
                },
            })
        })
    })
})
