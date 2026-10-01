import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import MobileFilters from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/MobileFilters"

const mockUseParams = vi.fn()

vi.mock("next/navigation", () => ({
    useParams: () => mockUseParams(),
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => "/productos",
    useSearchParams: () => new URLSearchParams(),
}))

vi.mock("react-horizontal-scrolling-menu", () => ({
    ScrollMenu: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="scroll-menu">{children}</div>
    ),
}))

// Mock the barrel exports (containers)
vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands", () => ({
    default: () => <div data-testid="brands-drawer" />,
}))
vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/OrderBy", () => ({
    default: () => <div data-testid="order-by-drawer" />,
}))
vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/PriceRange", () => ({
    default: () => <div data-testid="price-range-drawer" />,
}))
vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Subcategories", () => ({
    default: () => <div data-testid="subcategories-drawer" />,
}))

describe("MobileFilters", () => {
    it("should always render OrderBy, PriceRange and Brands drawers", () => {
        mockUseParams.mockReturnValue({})
        render(<MobileFilters />)
        expect(screen.getByTestId("order-by-drawer")).toBeInTheDocument()
        expect(screen.getByTestId("price-range-drawer")).toBeInTheDocument()
        expect(screen.getByTestId("brands-drawer")).toBeInTheDocument()
    })

    it("should NOT render SubcategoriesDrawer when no subcategory param is present", () => {
        mockUseParams.mockReturnValue({})
        render(<MobileFilters />)
        expect(screen.queryByTestId("subcategories-drawer")).not.toBeInTheDocument()
    })

    it("should render SubcategoriesDrawer when subcategory param is present", () => {
        mockUseParams.mockReturnValue({ subcategory: "phones" })
        render(<MobileFilters />)
        expect(screen.getByTestId("subcategories-drawer")).toBeInTheDocument()
    })

    it("should wrap items in a ScrollMenu", () => {
        mockUseParams.mockReturnValue({})
        render(<MobileFilters />)
        expect(screen.getByTestId("scroll-menu")).toBeInTheDocument()
    })
})
