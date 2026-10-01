import { describe, it, expect } from "vitest"
import {
    DEFAULT_BRANDS_TO_SHOW,
    PRICE_RANGE_OPTIONS,
    ORDER_BY_OPTIONS,
    PRODUCT_SEARCH_KEYS,
    buildProductsHref,
    readSubcategoryIds,
    buildOrderBySearchParams,
    buildCategoryParams,
    buildSubcategoryReplaceParams,
    buildSingleKeyParams,
    CLEAR_ALL_FILTERS_PARAMS,
} from "@/presentation/pages/Products/components/ProductsFilters/ProductsFiltersConfig"

describe("ProductsFiltersConfig", () => {
    describe("constants", () => {
        it("should have correct DEFAULT_BRANDS_TO_SHOW value", () => {
            expect(DEFAULT_BRANDS_TO_SHOW).toBe(10)
        })

        it("should have correct PRICE_RANGE_OPTIONS", () => {
            expect(PRICE_RANGE_OPTIONS).toHaveLength(4)
            expect(PRICE_RANGE_OPTIONS[0]).toEqual({ value: "600-2000", label: "Entre 600 a 2.000 millas" })
            expect(PRICE_RANGE_OPTIONS[1]).toEqual({ value: "2001-5000", label: "Entre 2.001 a 5.000 millas" })
            expect(PRICE_RANGE_OPTIONS[2]).toEqual({ value: "5001-10000", label: "Entre 5.001 a 10.000 millas" })
            expect(PRICE_RANGE_OPTIONS[3]).toEqual({ value: "10001", label: "Más de 10.001 millas" })
        })

        it("should have correct ORDER_BY_OPTIONS", () => {
            expect(ORDER_BY_OPTIONS).toHaveLength(2)
            expect(ORDER_BY_OPTIONS[0]).toEqual({ value: "points-asc", label: "Millas: Menor a mayor" })
            expect(ORDER_BY_OPTIONS[1]).toEqual({ value: "points-desc", label: "Millas: Mayor a menor" })
        })

        it("should have correct PRODUCT_SEARCH_KEYS", () => {
            expect(PRODUCT_SEARCH_KEYS).toEqual({
                search: "search",
                category: "category",
                subcategory: "subcategory",
                brand: "brand",
                sort: "sort",
                recommended: "recommended",
                points: "points",
                page: "page",
            })
        })
    })

    describe("buildProductsHref", () => {
        it("should build href with query string when patch has values", () => {
            const searchParams = new URLSearchParams()
            const result = buildProductsHref("/productos", searchParams, { sort: "ASC" })
            expect(result).toBe("/productos?sort=ASC")
        })

        it("should build href without query string when patch is empty", () => {
            const searchParams = new URLSearchParams()
            const result = buildProductsHref("/productos", searchParams, {})
            expect(result).toBe("/productos")
        })

        it("should merge with existing search params", () => {
            const searchParams = new URLSearchParams("brand=b1")
            const result = buildProductsHref("/productos", searchParams, { sort: "ASC" })
            expect(result).toBe("/productos?brand=b1&sort=ASC")
        })

        it("should override existing param with same key", () => {
            const searchParams = new URLSearchParams("sort=DESC")
            const result = buildProductsHref("/productos", searchParams, { sort: "ASC" })
            expect(result).toBe("/productos?sort=ASC")
        })

        it("should delete param when value is null", () => {
            const searchParams = new URLSearchParams("sort=ASC")
            const result = buildProductsHref("/productos", searchParams, { sort: null })
            expect(result).toBe("/productos")
        })

        it("should delete param when value is empty string", () => {
            const searchParams = new URLSearchParams("sort=ASC")
            const result = buildProductsHref("/productos", searchParams, { sort: "" })
            expect(result).toBe("/productos")
        })

        it("should handle multiple keys in patch", () => {
            const searchParams = new URLSearchParams()
            const result = buildProductsHref("/productos", searchParams, {
                sort: "ASC",
                brand: "b1",
                points: "600-2000",
            })
            expect(result).toContain("sort=ASC")
            expect(result).toContain("brand=b1")
            expect(result).toContain("points=600-2000")
        })
    })

    describe("readSubcategoryIds", () => {
        it("should return empty array when no subcategory param", () => {
            const searchParams = new URLSearchParams()
            expect(readSubcategoryIds(searchParams)).toEqual([])
        })

        it("should parse single subcategory id", () => {
            const searchParams = new URLSearchParams("subcategory=abc123")
            expect(readSubcategoryIds(searchParams)).toEqual(["abc123"])
        })

        it("should parse multiple subcategory ids", () => {
            const searchParams = new URLSearchParams("subcategory=abc123,def456,ghi789")
            expect(readSubcategoryIds(searchParams)).toEqual(["abc123", "def456", "ghi789"])
        })

        it("should filter out empty strings", () => {
            const searchParams = new URLSearchParams("subcategory=abc123,,def456")
            expect(readSubcategoryIds(searchParams)).toEqual(["abc123", "def456"])
        })
    })

    describe("buildOrderBySearchParams", () => {
        it("should clear sort when value is null", () => {
            const result = buildOrderBySearchParams(null)
            expect(result.sort).toBeNull()
            expect(result.page).toBeNull()
        })

        it("should set sort to points-asc when value is 'points-asc'", () => {
            const result = buildOrderBySearchParams("points-asc")
            expect(result.sort).toBe("points-asc")
            expect(result.page).toBeNull()
        })

        it("should set sort to points-desc when value is 'points-desc'", () => {
            const result = buildOrderBySearchParams("points-desc")
            expect(result.sort).toBe("points-desc")
            expect(result.page).toBeNull()
        })
    })

    describe("buildCategoryParams", () => {
        it("should add id when not in current list", () => {
            const result = buildCategoryParams(["a", "b"], "c")
            expect(result.subcategory).toBe("a,b,c")
            expect(result.page).toBeNull()
        })

        it("should remove id when already in current list", () => {
            const result = buildCategoryParams(["a", "b", "c"], "b")
            expect(result.subcategory).toBe("a,c")
            expect(result.page).toBeNull()
        })

        it("should return null subcategory when list becomes empty", () => {
            const result = buildCategoryParams(["a"], "a")
            expect(result.subcategory).toBeNull()
            expect(result.page).toBeNull()
        })

        it("should handle empty current list", () => {
            const result = buildCategoryParams([], "a")
            expect(result.subcategory).toBe("a")
        })
    })

    describe("buildSubcategoryReplaceParams", () => {
        it("should join ids with comma", () => {
            const result = buildSubcategoryReplaceParams(["a", "b", "c"])
            expect(result.subcategory).toBe("a,b,c")
            expect(result.page).toBeNull()
        })

        it("should return null subcategory when ids empty", () => {
            const result = buildSubcategoryReplaceParams([])
            expect(result.subcategory).toBeNull()
            expect(result.page).toBeNull()
        })

        it("should handle single id", () => {
            const result = buildSubcategoryReplaceParams(["abc123"])
            expect(result.subcategory).toBe("abc123")
        })
    })

    describe("buildSingleKeyParams", () => {
        it("should set key and reset page", () => {
            const result = buildSingleKeyParams("brand", "b1")
            expect(result.brand).toBe("b1")
            expect(result.page).toBeNull()
        })

        it("should handle null value", () => {
            const result = buildSingleKeyParams("brand", null)
            expect(result.brand).toBeNull()
            expect(result.page).toBeNull()
        })

        it("should work with different keys", () => {
            const result = buildSingleKeyParams("points", "600-2000")
            expect(result.points).toBe("600-2000")
            expect(result.page).toBeNull()
        })
    })

    describe("CLEAR_ALL_FILTERS_PARAMS", () => {
        it("should clear all filter-related keys", () => {
            expect(CLEAR_ALL_FILTERS_PARAMS.search).toBeNull()
            expect(CLEAR_ALL_FILTERS_PARAMS.category).toBeNull()
            expect(CLEAR_ALL_FILTERS_PARAMS.sort).toBeNull()
            expect(CLEAR_ALL_FILTERS_PARAMS.recommended).toBeNull()
            expect(CLEAR_ALL_FILTERS_PARAMS.points).toBeNull()
            expect(CLEAR_ALL_FILTERS_PARAMS.brand).toBeNull()
            expect(CLEAR_ALL_FILTERS_PARAMS.subcategory).toBeNull()
            expect(CLEAR_ALL_FILTERS_PARAMS.page).toBeNull()
        })
    })
})
