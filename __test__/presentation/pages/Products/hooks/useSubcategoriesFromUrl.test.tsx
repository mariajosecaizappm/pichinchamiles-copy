import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook } from "@testing-library/react"
import useSubcategoriesFromUrl from "@/presentation/pages/Products/hooks/useSubcategoriesFromUrl"

const mockUseParams = vi.fn()
const mockGetSubcategoriesBySlug = vi.fn()
const mockContext: { categorization: { getSubcategoriesBySlug: typeof mockGetSubcategoriesBySlug } | null } = {
    categorization: { getSubcategoriesBySlug: mockGetSubcategoriesBySlug },
}

vi.mock("next/navigation", () => ({
    useParams: () => mockUseParams(),
}))

vi.mock("@/presentation/pages/Products/context/useProductsContext", () => ({
    useProductsContext: () => mockContext,
}))

describe("useSubcategoriesFromUrl", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseParams.mockReturnValue({})
        mockContext.categorization = { getSubcategoriesBySlug: mockGetSubcategoriesBySlug }
    })

    it("should return empty subcategories when no slug present in params", () => {
        const { result } = renderHook(() => useSubcategoriesFromUrl())
        expect(result.current.subcategories).toEqual([])
        expect(result.current.slug).toBe("")
        expect(mockGetSubcategoriesBySlug).not.toHaveBeenCalled()
    })

    it("should return empty subcategories when categorization is null", () => {
        mockContext.categorization = null
        mockUseParams.mockReturnValue({ subcategory: "phones" })
        const { result } = renderHook(() => useSubcategoriesFromUrl())
        expect(result.current.subcategories).toEqual([])
        expect(result.current.slug).toBe("phones")
    })

    it("should resolve subcategories via categorization when slug present (default key 'subcategory')", () => {
        const expected = [{ id: "1", name: "Phones" }]
        mockGetSubcategoriesBySlug.mockReturnValue(expected)
        mockUseParams.mockReturnValue({ subcategory: "phones" })
        const { result } = renderHook(() => useSubcategoriesFromUrl())
        expect(result.current.subcategories).toEqual(expected)
        expect(result.current.slug).toBe("phones")
        expect(mockGetSubcategoriesBySlug).toHaveBeenCalledWith("phones")
    })

    it("should read from 'category' param when paramKey is 'category'", () => {
        const expected = [{ id: "2", name: "Electronics" }]
        mockGetSubcategoriesBySlug.mockReturnValue(expected)
        mockUseParams.mockReturnValue({ category: "electronics", subcategory: "phones" })
        const { result } = renderHook(() => useSubcategoriesFromUrl("category"))
        expect(result.current.subcategories).toEqual(expected)
        expect(result.current.slug).toBe("electronics")
        expect(mockGetSubcategoriesBySlug).toHaveBeenCalledWith("electronics")
    })
})
