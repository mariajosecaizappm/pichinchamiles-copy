import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import ProductsLayout from "@/app/productos/(catalog)/layout"

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/Categories", () => ({
    default: ({ className, wrapperClassName }: { className?: string; wrapperClassName?: string }) => (
        <div data-testid="product-categories" data-classname={className} data-wrapper={wrapperClassName}>
            Product Categories
        </div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/Categories/ProductCategoriesSkeleton", () => ({
    default: () => <div data-testid="product-categories-skeleton">Categories Loading...</div>,
}))

vi.mock("@/presentation/pages/Products/components/Categories/Subcategories", () => ({
    default: () => <div data-testid="subcategories">Subcategories</div>,
}))

vi.mock("@/presentation/pages/Products/ProductsBootstrap", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="products-bootstrap">{children}</div>,
}))

vi.mock("@/presentation/pages/Products/components/skeletons/ProductsSkeleton", () => ({
    default: () => <div data-testid="products-skeleton">Products Loading...</div>,
}))

vi.mock("@/presentation/pages/Products/components/ProductsList/ProductsListSkeleton", () => ({
    default: () => <div data-testid="products-list-skeleton">Products List Loading...</div>,
}))

describe("ProductsLayout", () => {
    it("should render ProductsBootstrap with children", () => {
        render(<ProductsLayout><div>Test Content</div></ProductsLayout>)

        expect(screen.getByTestId("products-bootstrap")).toBeInTheDocument()
        expect(screen.getByText("Test Content")).toBeInTheDocument()
    })

    it("should render ProductCategories component", () => {
        render(<ProductsLayout><div>Test Content</div></ProductsLayout>)

        expect(screen.getByTestId("product-categories")).toBeInTheDocument()
    })

    it("should render Subcategories component", () => {
        render(<ProductsLayout><div>Test Content</div></ProductsLayout>)

        expect(screen.getByTestId("subcategories")).toBeInTheDocument()
    })

    it("should pass className and wrapperClassName to ProductCategories", () => {
        render(<ProductsLayout><div>Test Content</div></ProductsLayout>)

        const categories = screen.getByTestId("product-categories")
        expect(categories).toHaveAttribute("data-classname", "mx-auto w-full lg:max-w-[calc(100%-80px)]")
        expect(categories).toHaveAttribute("data-wrapper", "w-full")
    })

    it("should render children inside main element", () => {
        render(<ProductsLayout><div data-testid="child-content">Child</div></ProductsLayout>)

        const main = screen.getByRole("main")
        expect(main).toBeInTheDocument()
        expect(main).toContainElement(screen.getByTestId("child-content"))
    })

    it("should have correct structure with bootstrap, categories, subcategories, and main", () => {
        render(<ProductsLayout><div>Content</div></ProductsLayout>)

        expect(screen.getByTestId("products-bootstrap")).toBeInTheDocument()
        expect(screen.getByTestId("product-categories")).toBeInTheDocument()
        expect(screen.queryByTestId("mobile-sticky-product-search-bar")).not.toBeInTheDocument()
        expect(screen.queryByTestId("product-search-bar")).not.toBeInTheDocument()
        expect(screen.getByTestId("subcategories")).toBeInTheDocument()
        expect(screen.getByRole("main")).toBeInTheDocument()
    })
})
