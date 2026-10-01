import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import ProductsBootstrap from "@/presentation/pages/Products/ProductsBootstrap"
import { Category } from "@/domain/entity/Category/structure/category"
import Categorization from "@/domain/entity/Category/models/Categorization"

const mockGetCategorization = vi.fn()

vi.mock("@/presentation/pages/Products/lib/getCategorization", () => ({
    default: () => mockGetCategorization(),
}))

vi.mock("@/presentation/pages/Products/context/ProductsProvider", () => ({
    default: ({ children, categories }: {
        children: React.ReactNode
        categories: Category[]
    }) => (
        <div data-testid="products-provider" data-categories={JSON.stringify(categories)}>
            {children}
        </div>
    ),
}))

vi.mock("@/presentation/pages/Products/components/skeletons/ProductsSkeleton", () => ({
    default: () => <div data-testid="products-skeleton">Loading...</div>,
}))

describe("ProductsBootstrap", () => {
    it("should render provider with categories when getCategorization resolves", async () => {
        const mockCategories: Category[] = [
            { id: "1", name: "Electronics", slug: "electronics", parent: null },
            { id: "2", name: "Phones", slug: "phones", parent: { id: "1", slug: "electronics" } },
        ]

        const mockCategorization = new Categorization(mockCategories)
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const result = await ProductsBootstrap({ children: <div>Test Children</div> })
        render(result)

        expect(screen.getByTestId("products-provider")).toBeInTheDocument()
        expect(screen.getByText("Test Children")).toBeInTheDocument()

        const provider = screen.getByTestId("products-provider")
        const categoriesData = JSON.parse(provider.getAttribute("data-categories") || "[]")
        expect(categoriesData).toEqual(mockCategories)
    })

    it("should render ProductsSkeleton when getCategorization rejects", async () => {
        mockGetCategorization.mockRejectedValue(new Error("Failed to fetch"))

        const result = await ProductsBootstrap({ children: <div>Test Children</div> })
        render(result)

        expect(screen.getByTestId("products-skeleton")).toBeInTheDocument()
        expect(screen.queryByText("Test Children")).not.toBeInTheDocument()
    })

    it("should pass children to provider", async () => {
        const mockCategories: Category[] = [
            { id: "1", name: "Electronics", slug: "electronics", parent: null },
        ]

        const mockCategorization = new Categorization(mockCategories)
        mockGetCategorization.mockResolvedValue(mockCategorization)

        const result = await ProductsBootstrap({
            children: (
                <div>
                    <span>Child 1</span>
                    <span>Child 2</span>
                </div>
            ),
        })
        render(result)

        expect(screen.getByText("Child 1")).toBeInTheDocument()
        expect(screen.getByText("Child 2")).toBeInTheDocument()
    })
})
