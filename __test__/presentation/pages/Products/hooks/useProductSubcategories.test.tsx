import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook } from "@testing-library/react"
import useProductSubcategories from "@/presentation/pages/Products/hooks/useProductSubcategories"
import { CategoryGroup } from "@/domain/entity/Category/structure/category"
import Categorization from "@/domain/entity/Category/models/Categorization"

const mockUseParams = vi.fn()
const mockGetSubcategoriesBySlug = vi.fn()
let mockSearchParams = new URLSearchParams()
let mockCategorization: Categorization | null = null

vi.mock("next/navigation", () => ({
    useParams: () => mockUseParams(),
    useSearchParams: () => mockSearchParams,
}))

vi.mock("@/presentation/pages/Products/context/useProductsContext", () => ({
    useProductsContext: () => ({ categorization: mockCategorization }),
}))

describe("useProductSubcategories", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseParams.mockReturnValue({})
        mockSearchParams = new URLSearchParams()
        mockGetSubcategoriesBySlug.mockReturnValue([])
        mockCategorization = { getSubcategoriesBySlug: mockGetSubcategoriesBySlug } as unknown as Categorization
    })

    describe("subcategories", () => {
        it("should return empty array when no subcategory param", () => {
            const { result } = renderHook(() => useProductSubcategories())
            expect(result.current.subcategories).toEqual([])
        })

        it("should return empty array when no categorization", () => {
            mockUseParams.mockReturnValue({ subcategory: "phones" })
            mockCategorization = null
            const { result } = renderHook(() => useProductSubcategories())
            expect(result.current.subcategories).toEqual([])
        })

        it("should call getSubcategoriesBySlug with current subcategory", () => {
            mockUseParams.mockReturnValue({ subcategory: "phones" })
            mockCategorization = { getSubcategoriesBySlug: mockGetSubcategoriesBySlug } as unknown as Categorization
            const mockSubs: CategoryGroup[] = [{ id: "1", name: "Smartphones", slug: "smartphones", parent: null }]
            mockGetSubcategoriesBySlug.mockReturnValue(mockSubs)
            const { result } = renderHook(() => useProductSubcategories())
            expect(mockGetSubcategoriesBySlug).toHaveBeenCalledWith("phones")
            expect(result.current.subcategories).toEqual(mockSubs)
        })

        it("should memoize subcategories result", () => {
            mockUseParams.mockReturnValue({ subcategory: "phones" })
            const mockSubs: CategoryGroup[] = [{ id: "1", name: "Phones", slug: "phones", parent: null }]
            mockGetSubcategoriesBySlug.mockReturnValue(mockSubs)
            const { result, rerender } = renderHook(() => useProductSubcategories())
            const firstResult = result.current.subcategories
            rerender()
            expect(result.current.subcategories).toBe(firstResult)
        })
    })

    describe("committedSubcategoryIds", () => {
        it("should return empty array when no subcategory param", () => {
            const { result } = renderHook(() => useProductSubcategories())
            expect(result.current.committedSubcategoryIds).toEqual([])
        })

        it("should parse single subcategory id from URL", () => {
            mockSearchParams = new URLSearchParams("subcategory=abc123")
            const { result } = renderHook(() => useProductSubcategories())
            expect(result.current.committedSubcategoryIds).toEqual(["abc123"])
        })

        it("should parse multiple subcategory ids from URL", () => {
            mockSearchParams = new URLSearchParams("subcategory=abc123,def456,ghi789")
            const { result } = renderHook(() => useProductSubcategories())
            expect(result.current.committedSubcategoryIds).toEqual(["abc123", "def456", "ghi789"])
        })

        it("should filter out empty strings from comma list", () => {
            mockSearchParams = new URLSearchParams("subcategory=abc123,,def456")
            const { result } = renderHook(() => useProductSubcategories())
            expect(result.current.committedSubcategoryIds).toEqual(["abc123", "def456"])
        })

        it("should memoize committedSubcategoryIds result", () => {
            mockSearchParams = new URLSearchParams("subcategory=abc123")
            const { result, rerender } = renderHook(() => useProductSubcategories())
            const firstResult = result.current.committedSubcategoryIds
            rerender()
            expect(result.current.committedSubcategoryIds).toBe(firstResult)
        })
    })

    describe("selectedSubcategoriesFromUrl", () => {
        it("should return empty array when no subcategories match", () => {
            mockUseParams.mockReturnValue({ subcategory: "phones" })
            mockSearchParams = new URLSearchParams("subcategory=nonexistent")
            mockGetSubcategoriesBySlug.mockReturnValue([{ id: "1", name: "Phones", slug: "phones", parent: null }])
            const { result } = renderHook(() => useProductSubcategories())
            expect(result.current.selectedSubcategoriesFromUrl).toEqual([])
        })

        it("should return matching top-level subcategories", () => {
            mockUseParams.mockReturnValue({ subcategory: "phones" })
            mockSearchParams = new URLSearchParams("subcategory=1,2")
            const mockSubs: CategoryGroup[] = [
                { id: "1", name: "Smartphones", slug: "smartphones", parent: null },
                { id: "2", name: "Tablets", slug: "tablets", parent: null },
                { id: "3", name: "Laptops", slug: "laptops", parent: null },
            ]
            mockGetSubcategoriesBySlug.mockReturnValue(mockSubs)
            const { result } = renderHook(() => useProductSubcategories())
            expect(result.current.selectedSubcategoriesFromUrl).toHaveLength(2)
            expect(result.current.selectedSubcategoriesFromUrl.map(s => s.id)).toContain("1")
            expect(result.current.selectedSubcategoriesFromUrl.map(s => s.id)).toContain("2")
        })

        it("should return matching nested subcategories", () => {
            mockUseParams.mockReturnValue({ subcategory: "phones" })
            mockSearchParams = new URLSearchParams("subcategory=child1")
            const mockSubs: CategoryGroup[] = [
                {
                    id: "parent1",
                    name: "Parent",
                    slug: "parent",
                    parent: null,
                    subcategories: [
                        { id: "child1", name: "Child 1", slug: "child1", parent: { id: "parent1", slug: "parent" } },
                    ],
                },
            ]
            mockGetSubcategoriesBySlug.mockReturnValue(mockSubs)
            const { result } = renderHook(() => useProductSubcategories())
            expect(result.current.selectedSubcategoriesFromUrl).toHaveLength(1)
            expect(result.current.selectedSubcategoriesFromUrl[0].id).toBe("child1")
        })

        it("should combine top-level and nested matches", () => {
            mockUseParams.mockReturnValue({ subcategory: "phones" })
            mockSearchParams = new URLSearchParams("subcategory=parent1,child1")
            const mockSubs: CategoryGroup[] = [
                {
                    id: "parent1",
                    name: "Parent",
                    slug: "parent",
                    parent: null,
                    subcategories: [
                        { id: "child1", name: "Child 1", slug: "child1", parent: { id: "parent1", slug: "parent" } },
                    ],
                },
            ]
            mockGetSubcategoriesBySlug.mockReturnValue(mockSubs)
            const { result } = renderHook(() => useProductSubcategories())
            expect(result.current.selectedSubcategoriesFromUrl).toHaveLength(2)
        })

        it("should memoize selectedSubcategoriesFromUrl result", () => {
            mockUseParams.mockReturnValue({ subcategory: "phones" })
            mockSearchParams = new URLSearchParams("subcategory=1")
            mockGetSubcategoriesBySlug.mockReturnValue([{ id: "1", name: "Phone", slug: "phone", parent: null }])
            const { result, rerender } = renderHook(() => useProductSubcategories())
            const firstResult = result.current.selectedSubcategoriesFromUrl
            rerender()
            expect(result.current.selectedSubcategoriesFromUrl).toBe(firstResult)
        })
    })

    describe("integration", () => {
        it("should return all three values correctly integrated", () => {
            mockUseParams.mockReturnValue({ subcategory: "electronics" })
            mockSearchParams = new URLSearchParams("subcategory=phone1,tablet1")
            const mockSubs: CategoryGroup[] = [
                { id: "phone1", name: "Phone", slug: "phone", parent: null },
                {
                    id: "tablets",
                    name: "Tablets",
                    slug: "tablets",
                    parent: null,
                    subcategories: [
                        { id: "tablet1", name: "Tablet", slug: "tablet", parent: { id: "tablets", slug: "tablets" } },
                    ],
                },
            ]
            mockGetSubcategoriesBySlug.mockReturnValue(mockSubs)
            const { result } = renderHook(() => useProductSubcategories())
            expect(result.current.subcategories).toHaveLength(2)
            expect(result.current.committedSubcategoryIds).toEqual(["phone1", "tablet1"])
            expect(result.current.selectedSubcategoriesFromUrl).toHaveLength(2)
        })
    })
})
