import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import SubcategoryPage, { generateMetadata } from "@/app/productos/(catalog)/categoria/[category]/[subcategory]/page"
import Categorization from "@/domain/entity/Category/models/Categorization"
import { Category } from "@/domain/entity/Category/structure/category"
import { Search } from "@/domain/entity/Product/product"
import pageMetadata from "@/presentation/config/metadata"

const mockGetCategorization = vi.fn()

vi.mock("@/presentation/pages/Products/lib/getCategorization", () => ({
    default: () => mockGetCategorization(),
}))

vi.mock("@/presentation/pages/Products", () => ({
    default: ({ searchParams }: { searchParams: Record<string, string[]> }) => (
        <div data-testid="products" data-search-params={JSON.stringify(searchParams)}>
            Products Component
        </div>
    ),
}))

vi.mock("@/presentation/pages/Products/components/skeletons/ProductsContentSkeleton", () => ({
    default: () => <div data-testid="products-content-skeleton">Loading Skeleton</div>,
}))

describe("SubcategoryPage (productos/categoria/[category]/[subcategory])", () => {
    const mockCategories: Category[] = [
        { id: "1", name: "Electronics", slug: "electronics", parent: null },
        { id: "2", name: "Phones", slug: "phones", parent: { id: "1", slug: "electronics" } },
        { id: "3", name: "Smartphones", slug: "smartphones", parent: { id: "2", slug: "phones" } },
    ]

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should generate metadata from subcategory name", async () => {
        mockGetCategorization.mockResolvedValue(new Categorization(mockCategories))

        const metadata = await generateMetadata({
            params: Promise.resolve({ category: "electronics", subcategory: "phones" }),
        })

        expect(metadata.title).toBe("Phones")
    })

    it("should fall back to productos metadata when subcategory is missing", async () => {
        mockGetCategorization.mockResolvedValue(new Categorization(mockCategories))

        const metadata = await generateMetadata({
            params: Promise.resolve({ category: "electronics", subcategory: "nonexistent" }),
        })

        expect(metadata).toEqual(pageMetadata.productos)
    })

    it("should treat null searchParams as empty object", async () => {
        const mockCategorization = new Categorization(mockCategories)
        mockCategorization.getCategoryAndSubcategoriesIds = vi.fn().mockReturnValue(["2"])
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const result = await SubcategoryPage({
            params: Promise.resolve({ category: "electronics", subcategory: "phones" }),
            searchParams: Promise.resolve(null as unknown as Partial<Search> & { subcategory?: string }),
        })
        render(result)

        const products = screen.getByTestId("products")
        const searchParams = JSON.parse(products.getAttribute("data-search-params") || "{}")

        expect(searchParams).toEqual({ category: ["2"] })
    })

    it("should await params correctly", async () => {
        const mockCategorization = new Categorization(mockCategories)
        mockCategorization.getCategoryAndSubcategoriesIds = vi.fn().mockReturnValue(["2", "3"])
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const params = Promise.resolve({ category: "electronics", subcategory: "phones" })

        const result = await SubcategoryPage({ params })
        render(result)

        expect(screen.getByTestId("products")).toBeInTheDocument()
    })

    it("should use subcategory slug (not category) for getCategoryAndSubcategoriesIds", async () => {
        const mockCategorization = new Categorization(mockCategories)
        const getCategoryAndSubcategoriesIdsSpy = vi.fn().mockReturnValue(["2", "3"])
        mockCategorization.getCategoryAndSubcategoriesIds = getCategoryAndSubcategoriesIdsSpy
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const params = Promise.resolve({ category: "electronics", subcategory: "phones" })

        await SubcategoryPage({ params })

        expect(getCategoryAndSubcategoriesIdsSpy).toHaveBeenCalledWith("phones")
        expect(getCategoryAndSubcategoriesIdsSpy).not.toHaveBeenCalledWith("electronics")
    })

    it("should render Products with category ids in searchParams", async () => {
        const mockCategorization = new Categorization(mockCategories)
        mockCategorization.getCategoryAndSubcategoriesIds = vi.fn().mockReturnValue(["2", "3"])
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const params = Promise.resolve({ category: "electronics", subcategory: "phones" })

        const result = await SubcategoryPage({ params })
        render(result)

        const products = screen.getByTestId("products")
        const searchParams = JSON.parse(products.getAttribute("data-search-params") || "{}")

        expect(searchParams).toEqual({ category: ["2", "3"] })
    })

    it("should preserve URL search params and use subcategory from query when provided", async () => {
        const mockCategorization = new Categorization(mockCategories)
        mockCategorization.getCategoryAndSubcategoriesIds = vi.fn().mockReturnValue(["2", "3"])
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const params = Promise.resolve({ category: "electronics", subcategory: "phones" })
        const searchParams = Promise.resolve({
            page: 2,
            search: "case",
            subcategory: "from-query",
        })

        const result = await SubcategoryPage({ params, searchParams })
        render(result)

        const products = screen.getByTestId("products")
        const resolved = JSON.parse(products.getAttribute("data-search-params") || "{}")

        // When searchParams.subcategory is provided, it's split into category array and subcategory is preserved
        expect(resolved).toEqual({
            page: 2,
            search: "case",
            subcategory: "from-query",
            category: ["from-query"],
        })
    })

    it("should call getCategorization without options", async () => {
        const mockCategorization = new Categorization(mockCategories)
        mockCategorization.getCategoryAndSubcategoriesIds = vi.fn().mockReturnValue(["3"])
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const params = Promise.resolve({ category: "electronics", subcategory: "smartphones" })

        await SubcategoryPage({ params })

        expect(mockGetCategorization).toHaveBeenCalledWith()
    })

    it("should handle different subcategory slugs", async () => {
        const mockCategorization = new Categorization(mockCategories)
        const getCategoryAndSubcategoriesIdsSpy = vi.fn().mockReturnValue(["3"])
        mockCategorization.getCategoryAndSubcategoriesIds = getCategoryAndSubcategoriesIdsSpy
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const params = Promise.resolve({ category: "phones", subcategory: "smartphones" })

        const result = await SubcategoryPage({ params })
        render(result)

        expect(getCategoryAndSubcategoriesIdsSpy).toHaveBeenCalledWith("smartphones")

        const products = screen.getByTestId("products")
        const searchParams = JSON.parse(products.getAttribute("data-search-params") || "{}")

        expect(searchParams).toEqual({ category: ["3"] })
    })

    it("should handle empty category ids", async () => {
        const mockCategorization = new Categorization(mockCategories)
        mockCategorization.getCategoryAndSubcategoriesIds = vi.fn().mockReturnValue([])
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const params = Promise.resolve({ category: "electronics", subcategory: "nonexistent" })

        const result = await SubcategoryPage({ params })
        render(result)

        const products = screen.getByTestId("products")
        const searchParams = JSON.parse(products.getAttribute("data-search-params") || "{}")

        expect(searchParams).toEqual({ category: [] })
    })

    it("should render Suspense wrapper", async () => {
        const mockCategorization = new Categorization(mockCategories)
        mockCategorization.getCategoryAndSubcategoriesIds = vi.fn().mockReturnValue(["2"])
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const params = Promise.resolve({ category: "electronics", subcategory: "phones" })

        const result = await SubcategoryPage({ params })
        render(result)

        // Suspense renders its children, so Products should be visible
        expect(screen.getByTestId("products")).toBeInTheDocument()
    })

    it("should render ProductsContentSkeleton when getCategorization throws", async () => {
        mockGetCategorization.mockRejectedValue(new Error("Failed to fetch categorization"))

        const params = Promise.resolve({ category: "electronics", subcategory: "phones" })

        const result = await SubcategoryPage({ params })
        render(result)

        expect(screen.getByTestId("products-content-skeleton")).toBeInTheDocument()
        expect(screen.queryByTestId("products")).not.toBeInTheDocument()
    })

    it("should render ProductsContentSkeleton when params reject", async () => {
        const mockCategorization = new Categorization(mockCategories)
        mockCategorization.getCategoryAndSubcategoriesIds = vi.fn().mockReturnValue(["2"])
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const params = Promise.reject(new Error("Invalid params"))

        const result = await SubcategoryPage({ params })
        render(result)

        expect(screen.getByTestId("products-content-skeleton")).toBeInTheDocument()
    })
})
