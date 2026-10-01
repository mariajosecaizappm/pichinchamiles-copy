import Categorization from "@/domain/entity/Category/models/Categorization"
import type { Category } from "@/domain/entity/Category/structure/category"
import {
    getCategoryDisplayName,
    getProductCategorySlugsFromParams,
    getProductsBrowseTitle,
    isProductsPath,
    isProductsRootPath,
} from "@/presentation/helpers/product"
import { describe, expect, it } from "vitest"

const categories: Category[] = [
    { id: "1", name: "Electronics", slug: "electronics", parent: null },
    { id: "2", name: "Smart Phones", slug: "smart-phones", parent: { id: "1", slug: "electronics" } },
]

const categorization = new Categorization(categories)

describe("presentation/helpers/product", () => {
    it("should extract category and subcategory slugs from params", () => {
        expect(
            getProductCategorySlugsFromParams({
                category: ["electronics"],
                subcategory: "smart-phones",
            }),
        ).toEqual({
            categorySlug: "electronics",
            subcategorySlug: "smart-phones",
        })
    })

    it("should detect products paths and root path", () => {
        expect(isProductsPath("/productos")).toBe(true)
        expect(isProductsPath("/productos/categoria/electronics")).toBe(true)
        expect(isProductsPath("/ofertas")).toBe(false)
        expect(isProductsRootPath("/productos/")).toBe(true)
        expect(isProductsRootPath("/productos/categoria/electronics")).toBe(false)
    })

    it("should use categorization names and fallback to title case slug", () => {
        expect(getCategoryDisplayName("smart-phones", categorization)).toBe("Smart Phones")
        expect(getCategoryDisplayName("home-office", categorization)).toBe("Home Office")
    })

    it("should build browse titles for root, category, and subcategory routes", () => {
        expect(getProductsBrowseTitle({ pathname: "/productos", params: {}, categorization })).toBe(
            "Todos los productos",
        )
        expect(
            getProductsBrowseTitle({
                pathname: "/productos/categoria/electronics",
                params: { category: "electronics" },
                categorization,
            }),
        ).toBe("Electronics")
        expect(
            getProductsBrowseTitle({
                pathname: "/productos/categoria/electronics/smart-phones",
                params: { category: "electronics", subcategory: "smart-phones" },
                categorization,
            }),
        ).toBe("Smart Phones")
    })

    it("should return null for non-products paths", () => {
        expect(getProductsBrowseTitle({ pathname: "/ofertas", params: {}, categorization })).toBeNull()
    })
})
