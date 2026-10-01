import { describe, it, expect } from "vitest"
import {
    PRODUCT_SEARCH_KEYS,
    buildOrderBySearchParams,
    buildSingleKeyParams,
    buildSubcategoryReplaceParams,
    buildCategoryParams,
} from "@/presentation/pages/Products/components/ProductsFilters/ProductsFiltersConfig"

// These tests were previously testing the deleted Products_Hook.
// They now test the equivalent helpers in ProductsFiltersConfig and the base hook.

describe("PRODUCT_SEARCH_KEYS", () => {
    it("should expose expected keys", () => {
        expect(PRODUCT_SEARCH_KEYS.brand).toBe("brand")
        expect(PRODUCT_SEARCH_KEYS.sort).toBe("sort")
        expect(PRODUCT_SEARCH_KEYS.subcategory).toBe("subcategory")
        expect(PRODUCT_SEARCH_KEYS.recommended).toBe("recommended")
        expect(PRODUCT_SEARCH_KEYS.points).toBe("points")
        expect(PRODUCT_SEARCH_KEYS.page).toBe("page")
    })
})

describe("buildOrderBySearchParams", () => {
    it("should produce null sort value when value is null", () => {
        const patch = buildOrderBySearchParams(null)
        expect(patch).toEqual({ sort: null, page: null })
    })
    it("should produce sort=points-asc when value is 'points-asc'", () => {
        const patch = buildOrderBySearchParams("points-asc")
        expect(patch).toEqual({ sort: "points-asc", page: null })
    })

    it("should produce sort=points-desc when value is 'points-desc'", () => {
        const patch = buildOrderBySearchParams("points-desc")
        expect(patch).toEqual({ sort: "points-desc", page: null })
    })
})

describe("buildSingleKeyParams", () => {
    it("should produce points + page reset", () => {
        expect(buildSingleKeyParams("points", "600-2000")).toEqual({ points: "600-2000", page: null })
    })

    it("should produce brand + page reset", () => {
        expect(buildSingleKeyParams("brand", "b1")).toEqual({ brand: "b1", page: null })
    })
})

describe("buildSubcategoryReplaceParams", () => {
    it("should replace subcategory with given ids", () => {
        const patch = buildSubcategoryReplaceParams(["c", "d"])
        expect(patch).toEqual({ subcategory: "c,d", page: null })
    })

    it("should return null subcategory when ids is empty", () => {
        const patch = buildSubcategoryReplaceParams([])
        expect(patch).toEqual({ subcategory: null, page: null })
    })
})

describe("buildCategoryParams (toggle)", () => {
    it("should add id when not in current list", () => {
        const patch = buildCategoryParams(["a"], "b")
        expect(patch).toEqual({ subcategory: "a,b", page: null })
    })

    it("should remove id when already in current list", () => {
        const patch = buildCategoryParams(["a", "b"], "a")
        expect(patch).toEqual({ subcategory: "b", page: null })
    })

    it("should produce null subcategory when removing the last value", () => {
        const patch = buildCategoryParams(["a"], "a")
        expect(patch).toEqual({ subcategory: null, page: null })
    })
})
