import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import DesktopFilters from "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/DesktopFilters"

// DesktopFilters no longer accepts props or renders a heading/clear-filters button —
// it is now a plain composition of PriceRangeFilter, SubcategoriesFilter, BrandFilter,
// wrapped in Dividers. Heading/clear-filters/variant logic moved to DesktopFiltersWrapper.
vi.mock("@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/Brands", () => ({
    default: () => <div data-testid="brand-filter" />,
}))
vi.mock("@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/PriceRange", () => ({
    default: () => <div data-testid="price-range-filter" />,
}))
vi.mock("@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/Subcategories", () => ({
    default: () => <div data-testid="subcategories-filter" />,
}))

describe("DesktopFilters", () => {
    it("should render PriceRangeFilter, SubcategoriesFilter and BrandFilter", () => {
        render(<DesktopFilters />)
        expect(screen.getByTestId("price-range-filter")).toBeInTheDocument()
        expect(screen.getByTestId("subcategories-filter")).toBeInTheDocument()
        expect(screen.getByTestId("brand-filter")).toBeInTheDocument()
    })

    it("should render two dividers surrounding the filter sections", () => {
        const { container } = render(<DesktopFilters />)
        const dividers = container.querySelectorAll("hr")
        expect(dividers.length).toBe(2)
    })

    it("should render PriceRangeFilter before SubcategoriesFilter and BrandFilter", () => {
        const { container } = render(<DesktopFilters />)
        const order = Array.from(container.querySelectorAll("[data-testid]")).map((el) =>
            el.getAttribute("data-testid"),
        )
        expect(order).toEqual(["price-range-filter", "subcategories-filter", "brand-filter"])
    })
})