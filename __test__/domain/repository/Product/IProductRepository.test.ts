import { describe, it, expect } from "vitest"
import IProductRepository from "@/domain/repository/Product/IProductRepository"
import { ProductListParams, Product } from "@/domain/entity/Product/product"
import { List } from "@/domain/entity/List/list"

describe("IProductRepository Interface", () => {
    it("should define the correct interface structure", () => {
        // This test verifies the interface exists and has the expected methods
        // Since interfaces are erased at runtime, we test the structure through implementation
        
        const mockRepository: IProductRepository = {
            getProducts: async (): Promise<List<Product>> => {
                return {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 0,
                        totalPages: 0
                    }
                }
            }
        }

        expect(mockRepository).toHaveProperty('getProducts')
        expect(typeof mockRepository.getProducts).toBe('function')
    })

    it("should accept ProductListParams as parameter", async () => {
        const mockRepository: IProductRepository = {
            getProducts: async (params: ProductListParams): Promise<List<Product>> => {
                expect(params).toHaveProperty('page')
                expect(params).toHaveProperty('pageSize')
                return {
                    data: [],
                    pagination: {
                        page: params.page || 1,
                        pageSize: params.pageSize || 10,
                        total: 0,
                        totalPages: 0
                    }
                }
            }
        }

        const params: ProductListParams = {
            page: 1,
            pageSize: 10
        }

        await mockRepository.getProducts(params)
    })

    it("should return a Promise of List", async () => {
        const mockRepository: IProductRepository = {
            getProducts: async (): Promise<List<Product>> => {
                return {
                    data: [],
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        total: 1,
                        totalPages: 1
                    }
                }
            }
        }

        const result = await mockRepository.getProducts({ page: 1, pageSize: 10 })
        
        expect(result).toHaveProperty('data')
        expect(result).toHaveProperty('pagination')
        expect(Array.isArray(result.data)).toBe(true)
        expect(result.pagination).toHaveProperty('page')
        expect(result.pagination).toHaveProperty('pageSize')
        expect(result.pagination).toHaveProperty('total')
        expect(result.pagination).toHaveProperty('totalPages')
    })
})
