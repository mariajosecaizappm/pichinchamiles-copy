import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import DesktopFiltersContainer from "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/DesktopFiltersContainer"
import { useParams } from "next/navigation"

const mockHandleClearFilters = vi.fn()
let mockIsPending = false
const mockGetSubcategoriesBySlug = vi.fn(() => [])

vi.mock("next/navigation", () => ({
    useParams: vi.fn(() => ({})),
}))

// useFilterNavigation now owns clear-filters + transition state (method/wrapTransition
// config), replacing the old raw useTransition + inline URL-building approach.
vi.mock("@/presentation/pages/Products/hooks/useFilterNavigation", () => ({
    default: (config: Record<string, unknown>) => {
        mockUseFilterNavigationConfig(config)
        return { handleClearFilters: mockHandleClearFilters, isPending: mockIsPending }
    },
}))
const mockUseFilterNavigationConfig = vi.fn()

vi.mock("@/presentation/pages/Products/context/useProductsContext", () => ({
    useProductsContext: () => ({
        categorization: { getSubcategoriesBySlug: mockGetSubcategoriesBySlug },
    }),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/DesktopFilters", () => ({
    default: () => <div data-testid="desktop-filters" />,
}))

// DesktopFiltersWrapper now owns onClearFilters wiring, isLoading, and the sticky
// className (including the "aside" element) — DesktopFilters itself takes no props.
vi.mock("@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/DesktopFiltersWrapper", () => ({
    default: ({
        children,
        onClearFilters,
        isLoading,
        className,
    }: {
        children: React.ReactNode
        onClearFilters: () => void
        isLoading?: boolean
        className?: string
    }) => (
        <aside data-testid="desktop-filters-wrapper" className={className} data-loading={String(isLoading)}>
            <button data-testid="clear-filters" onClick={onClearFilters}>Clear Filters</button>
            {children}
        </aside>
    ),
}))

describe("DesktopFiltersContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useParams).mockReturnValue({})
        mockGetSubcategoriesBySlug.mockReturnValue([])
        mockIsPending = false
    })

    it("should render DesktopFiltersWrapper wrapping DesktopFilters", () => {
        render(<DesktopFiltersContainer />)
        expect(screen.getByTestId("desktop-filters-wrapper")).toBeInTheDocument()
        expect(screen.getByTestId("desktop-filters")).toBeInTheDocument()
    })

    it("should call useFilterNavigation with method 'push' and wrapTransition true", () => {
        render(<DesktopFiltersContainer />)
        expect(mockUseFilterNavigationConfig).toHaveBeenCalledWith({ method: "push", wrapTransition: true })
    })

    it("should pass isPending from useFilterNavigation as isLoading", () => {
        mockIsPending = true
        render(<DesktopFiltersContainer />)
        expect(screen.getByTestId("desktop-filters-wrapper")).toHaveAttribute("data-loading", "true")
    })

    it("should apply default sticky top when category has no subcategories", () => {
        render(<DesktopFiltersContainer />)
        expect(screen.getByTestId("desktop-filters-wrapper")).toHaveClass("lg:top-[201px]")
    })

    it("should apply taller sticky top when category has subcategories", () => {
        vi.mocked(useParams).mockReturnValue({ category: "electronics" })
        mockGetSubcategoriesBySlug.mockReturnValue([{ id: "sub-1", name: "Phones" }])

        render(<DesktopFiltersContainer />)

        expect(screen.getByTestId("desktop-filters-wrapper")).toHaveClass("lg:top-[257px]")
    })

    it("should call handleClearFilters from useFilterNavigation when clear is triggered", () => {
        render(<DesktopFiltersContainer />)
        fireEvent.click(screen.getByTestId("clear-filters"))
        expect(mockHandleClearFilters).toHaveBeenCalledTimes(1)
    })
})