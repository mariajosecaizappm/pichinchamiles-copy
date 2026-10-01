import GetProductCategoriesUseCase from "@/domain/interactors/Home/UseYourMiles/Products/GetProductCategoriesUseCase"
import type ICategoryRepository from "@/domain/repository/Category/ICategoryRepository"
import type IProductRepository from "@/domain/repository/Product/IProductRepository"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { Category } from "@/domain/entity/Category/structure/category"
import { List } from "@/domain/entity/List/list"
import { Product } from "@/domain/entity/Product/product"

const makeCategoryList = (data: Category[]) => ({
    data,
    pagination: { page: 1, pageSize: 1000, total: data.length, totalPages: 1 },
})

const makeProductList = (pageSize: number = 10): List<Product> => ({
    data: [] as Product[],
    pagination: { page: 1, pageSize, total: 0, totalPages: 0 },
})

describe("GetProductCategoriesUseCase", () => {
    let categoryRepository: ICategoryRepository
    let productRepository: IProductRepository
    let useCase: GetProductCategoriesUseCase

    beforeEach(() => {
        categoryRepository = { getCategories: vi.fn() } as unknown as ICategoryRepository
        productRepository = { getProductSearch: vi.fn() } as unknown as IProductRepository
        useCase = new GetProductCategoriesUseCase(categoryRepository, productRepository)
    })

    describe("getCategories", () => {
        it("should return only categories that have products (direct facet match)", async () => {
            const categories = [
                { id: "1", name: "Hogar", slug: "hogar", parent: null },
                { id: "2", name: "Cocina", slug: "cocina", parent: null },
            ]
            vi.mocked(categoryRepository.getCategories).mockResolvedValue(makeCategoryList(categories as Category[]))
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({
                list: makeProductList(),
                categories: { "Hogar": 5 },
                brandIds: [],
                categoryIds: ["1"],
            })

            const result = await useCase.getHomeMenuMainCategories()

            expect(result).toHaveLength(1)
            expect(result[0].id).toBe("1")
            expect(result[0].count).toBe(5)
        })

        it("should include parent category when a subcategory has products", async () => {
            const categories = [
                { id: "parent-1", name: "Electrónica", slug: "electronica", parent: null },
                { id: "sub-1", name: "Celulares", slug: "celulares", parent: { id: "parent-1", slug: "electronica" } },
            ]
            vi.mocked(categoryRepository.getCategories).mockResolvedValue(makeCategoryList(categories as Category[]))
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({
                list: makeProductList(),
                categories: { "Electrónica": 3, "Celulares": 3 },
                brandIds: [],
                categoryIds: ["parent-1", "sub-1"],
            })

            const result = await useCase.getHomeMenuMainCategories()

            expect(result).toHaveLength(2)
            const parent = result.find(c => c.id === "parent-1")
            const sub = result.find(c => c.id === "sub-1")
            expect(parent).toBeDefined()
            expect(parent?.count).toBe(3)
            expect(sub?.count).toBe(3)
        })

        it("should accumulate counts from multiple subcategories into parent", async () => {
            const categories = [
                { id: "parent-1", name: "Electrónica", slug: "electronica", parent: null },
                { id: "sub-1", name: "Celulares", slug: "celulares", parent: { id: "parent-1", slug: "electronica" } },
                { id: "sub-2", name: "Tablets", slug: "tablets", parent: { id: "parent-1", slug: "electronica" } },
            ]
            vi.mocked(categoryRepository.getCategories).mockResolvedValue(makeCategoryList(categories as Category[]))
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({
                list: makeProductList(),
                categories: { "Electrónica": 10, "Celulares": 3, "Tablets": 7 },
                brandIds: [],
                categoryIds: ["parent-1", "sub-1", "sub-2"],
            })

            const result = await useCase.getHomeMenuMainCategories()

            const parent = result.find(c => c.id === "parent-1")
            expect(parent?.count).toBe(10)
        })

        it("should return empty array when no categories have products", async () => {
            vi.mocked(categoryRepository.getCategories).mockResolvedValue(makeCategoryList([
                { id: "1", name: "Hogar", slug: "hogar", parent: null },
            ]))
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({
                list: makeProductList(),
                categories: {},
                brandIds: [],
                categoryIds: [],
            })

            const result = await useCase.getHomeMenuMainCategories()
            expect(result).toEqual([])
        })

        it("should exclude category not present in categoryIds", async () => {
            const categories = [
                { id: "1", name: "Hogar", slug: "hogar", parent: null },
                { id: "2", name: "Cocina", slug: "cocina", parent: null },
            ]
            vi.mocked(categoryRepository.getCategories).mockResolvedValue(makeCategoryList(categories as Category[]))
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({
                list: makeProductList(),
                categories: { "Hogar": 5, "Cocina": 3 },
                brandIds: [],
                categoryIds: ["1"], // Only category 1 is present
            })

            const result = await useCase.getHomeMenuMainCategories()

            expect(result).toHaveLength(1)
            expect(result[0].id).toBe("1")
            expect(result[0].name).toBe("Hogar")
        })

        it("should set count to 0 when category name is missing from categories facet", async () => {
            const categories = [
                { id: "1", name: "Hogar", slug: "hogar", parent: null },
            ]
            vi.mocked(categoryRepository.getCategories).mockResolvedValue(makeCategoryList(categories as Category[]))
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({
                list: makeProductList(),
                categories: {}, // No name facet for Hogar
                brandIds: [],
                categoryIds: ["1"],
            })

            const result = await useCase.getHomeMenuMainCategories()

            expect(result).toHaveLength(1)
            expect(result[0].count).toBe(0)
        })

        it("should allow facets-only product search when productPageSize is 0", async () => {
            const categories = [
                { id: "1", name: "Hogar", slug: "hogar", parent: null },
            ]
            vi.mocked(categoryRepository.getCategories).mockResolvedValue(makeCategoryList(categories as Category[]))
            vi.mocked(productRepository.getProductSearch).mockResolvedValue({
                list: makeProductList(0),
                categories: { "Hogar": 5 },
                brandIds: [],
                categoryIds: ["1"],
            })

            await useCase.getHomeMenuMainCategories(undefined, 0)

            expect(productRepository.getProductSearch).toHaveBeenCalledWith({
                page: 1,
                pageSize: 0,
            })
        })
    })
})
