import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import Page, { generateMetadata } from "@/app/productos/(catalog)/categoria/[category]/page"
import Categorization from "@/domain/entity/Category/models/Categorization"
import { Category, CategoryParams } from "@/domain/entity/Category/structure/category"
import { Search } from "@/domain/entity/Product/product"
import pageMetadata from "@/presentation/config/metadata"

const mockGetCategorization = vi.fn()

vi.mock("@/presentation/pages/Products/lib/getCategorization", () => ({
    default: (options?: CategoryParams) => mockGetCategorization(options),
}))

vi.mock("@/presentation/pages/Products", () => ({
    default: ({ searchParams }: { searchParams: Record<string, string[]> }) => (
        <div data-testid="products" data-search-params={JSON.stringify(searchParams)}>
            Products Component
        </div>
    ),
}))

describe("Page (productos/categoria/[category])", () => {
    const mockCategories: Category[] = [
        { id: "1", name: "Electronics", slug: "electronics", parent: null },
        { id: "2", name: "Phones", slug: "phones", parent: { id: "1", slug: "electronics" } },
        { id: "3", name: "Tablets", slug: "tablets", parent: { id: "1", slug: "electronics" } },
    ]

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should generate metadata from category name", async () => {
        mockGetCategorization.mockResolvedValue(new Categorization(mockCategories))

        const metadata = await generateMetadata({
            params: Promise.resolve({ category: "electronics" }),
        })

        expect(metadata.title).toBe("Electronics")
    })

    it("should fall back to productos metadata when category is missing", async () => {
        mockGetCategorization.mockResolvedValue(new Categorization(mockCategories))

        const metadata = await generateMetadata({
            params: Promise.resolve({ category: "nonexistent" }),
        })

        expect(metadata).toEqual(pageMetadata.productos)
    })

    it("should treat null searchParams as empty object", async () => {
        const mockCategorization = new Categorization(mockCategories)
        mockCategorization.getCategoryAndSubcategoriesIds = vi.fn().mockReturnValue(["1"])
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const result = await Page({
            params: Promise.resolve({ category: "electronics" }),
            searchParams: Promise.resolve(null as unknown as Partial<Search>),
        })
        render(result)

        const products = screen.getByTestId("products")
        const searchParams = JSON.parse(products.getAttribute("data-search-params") || "{}")

        expect(searchParams).toEqual({ category: ["1"] })
    })

    it("should await params correctly", async () => {
        const mockCategorization = new Categorization(mockCategories)
        mockCategorization.getCategoryAndSubcategoriesIds = vi.fn().mockReturnValue(["1", "2", "3"])
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const params = Promise.resolve({ category: "electronics" })

        const result = await Page({ params })
        render(result)

        expect(screen.getByTestId("products")).toBeInTheDocument()
    })

    it("should call getCategorization without arguments", async () => {
        const mockCategorization = new Categorization(mockCategories)
        mockCategorization.getCategoryAndSubcategoriesIds = vi.fn().mockReturnValue(["1", "2", "3"])
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const params = Promise.resolve({ category: "electronics" })

        await Page({ params })

        expect(mockGetCategorization).toHaveBeenCalledWith(undefined)
    })

    it("should get category and subcategories ids using category slug", async () => {
        const mockCategorization = new Categorization(mockCategories)
        const getCategoryAndSubcategoriesIdsSpy = vi.fn().mockReturnValue(["1", "2", "3"])
        mockCategorization.getCategoryAndSubcategoriesIds = getCategoryAndSubcategoriesIdsSpy
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const params = Promise.resolve({ category: "electronics" })

        await Page({ params })

        expect(getCategoryAndSubcategoriesIdsSpy).toHaveBeenCalledWith("electronics")
    })

    it("should render Products with category ids in searchParams", async () => {
        const mockCategorization = new Categorization(mockCategories)
        mockCategorization.getCategoryAndSubcategoriesIds = vi.fn().mockReturnValue(["1", "2", "3"])
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const params = Promise.resolve({ category: "electronics" })

        const result = await Page({ params })
        render(result)

        const products = screen.getByTestId("products")
        const searchParams = JSON.parse(products.getAttribute("data-search-params") || "{}")

        expect(searchParams).toEqual({ category: ["1", "2", "3"] })
    })

    it("should preserve URL search params and override category with route category ids", async () => {
        const mockCategorization = new Categorization(mockCategories)
        mockCategorization.getCategoryAndSubcategoriesIds = vi.fn().mockReturnValue(["1", "2", "3"])
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const params = Promise.resolve({ category: "electronics" })
        const searchParams = Promise.resolve({
            page: 3,
            search: "phone",
            category: "from-query",
        })

        const result = await Page({ params, searchParams })
        render(result)

        const products = screen.getByTestId("products")
        const resolved = JSON.parse(products.getAttribute("data-search-params") || "{}")

        expect(resolved).toEqual({
            page: 3,
            search: "phone",
            category: ["1", "2", "3"],
        })
    })

    it("should return ProductsSkeleton when error is thrown", async () => {
        mockGetCategorization.mockRejectedValue(new Error("Failed to fetch"))

        const params = Promise.resolve({ category: "electronics" })

        const result = await Page({ params })

        expect(result).not.toBeNull()
    })

    it("should handle different category slugs", async () => {
        const mockCategorization = new Categorization(mockCategories)
        const getCategoryAndSubcategoriesIdsSpy = vi.fn().mockReturnValue(["2", "3"])
        mockCategorization.getCategoryAndSubcategoriesIds = getCategoryAndSubcategoriesIdsSpy
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const params = Promise.resolve({ category: "phones" })

        const result = await Page({ params })
        render(result)

        expect(getCategoryAndSubcategoriesIdsSpy).toHaveBeenCalledWith("phones")

        const products = screen.getByTestId("products")
        const searchParams = JSON.parse(products.getAttribute("data-search-params") || "{}")

        expect(searchParams).toEqual({ category: ["2", "3"] })
    })

    it("should handle empty category ids", async () => {
        const mockCategorization = new Categorization(mockCategories)
        mockCategorization.getCategoryAndSubcategoriesIds = vi.fn().mockReturnValue([])
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const params = Promise.resolve({ category: "nonexistent" })

        const result = await Page({ params })
        render(result)

        const products = screen.getByTestId("products")
        const searchParams = JSON.parse(products.getAttribute("data-search-params") || "{}")

        expect(searchParams).toEqual({ category: [] })
    })
})
