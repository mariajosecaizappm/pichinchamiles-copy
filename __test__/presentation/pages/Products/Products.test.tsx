import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import Products from "@/presentation/pages/Products/Products"

vi.mock("@/presentation/pages/Products/components/DesktopToolbar", () => ({
    default: () => (
        <div data-testid="desktop-toolbar">
            <div data-testid="product-search-bar" />
            <div data-testid="order-by-select" />
        </div>
    ),
}))
vi.mock("@/presentation/pages/Products/components/ProductsFilters/DesktopFilters", () => ({
    default: () => <div data-testid="desktop-filters" />,
}))
vi.mock("@/presentation/pages/Products/components/ProductsToolbar/MobileToolbar", () => ({
    default: () => <div data-testid="mobile-toolbar" />,
}))
vi.mock("@/presentation/pages/Products/components/ProductsCatalogLayout", () => ({
    default: ({ desktopFilters, children }: { desktopFilters: React.ReactNode; children: React.ReactNode }) => (
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-4 lg:body-container lg:py-3">
            {desktopFilters}
            <div className="flex-1">{children}</div>
        </div>
    ),
}))
vi.mock("@/presentation/pages/Products/components/ProductsList", () => ({
    default: ({ searchParams }: { searchParams?: Record<string, unknown> }) => (
        <div data-testid="products-list" data-params={JSON.stringify(searchParams ?? null)} />
    ),
}))

vi.mock("@/presentation/pages/Products/components/ProductsList/ProductsListSkeleton", () => ({
    default: () => <div data-testid="products-list-skeleton" />,
}))

describe("Products", () => {
    it("should render all sub-components", () => {
        render(<Products />)
        expect(screen.getByTestId("mobile-toolbar")).toBeInTheDocument()
        expect(screen.getByTestId("desktop-filters")).toBeInTheDocument()
        expect(screen.getByTestId("desktop-toolbar")).toBeInTheDocument()
        expect(screen.getByTestId("product-search-bar")).toBeInTheDocument()
        expect(screen.getByTestId("order-by-select")).toBeInTheDocument()
        expect(screen.getByTestId("products-list")).toBeInTheDocument()
    })

    it("should render ProductSearchBar in DesktopToolbar", () => {
        render(<Products />)
        expect(screen.getByTestId("product-search-bar")).toBeInTheDocument()
    })

    it("should forward searchParams to ProductsList", () => {
        render(<Products searchParams={{ search: "phone" }} />)
        expect(screen.getByTestId("products-list")).toHaveAttribute(
            "data-params",
            JSON.stringify({ search: "phone" })
        )
    })

    it("should pass undefined searchParams when not provided", () => {
        render(<Products />)
        expect(screen.getByTestId("products-list")).toHaveAttribute("data-params", "null")
    })

    it("should render outer container with correct layout classes", () => {
        const { container } = render(<Products />)
        const outer = container.querySelector(".flex.flex-col") as HTMLElement
        expect(outer).toHaveClass("flex", "flex-col", "lg:flex-row", "lg:items-start", "lg:gap-4", "lg:body-container", "lg:py-3")
    })
})
