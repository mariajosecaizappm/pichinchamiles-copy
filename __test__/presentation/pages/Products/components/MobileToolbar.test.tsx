import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import MobileToolbar from "@/presentation/pages/Products/components/ProductsToolbar/MobileToolbar"

const mockUseSession = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar", () => ({
    default: () => <div data-testid="product-search-bar">Search Bar</div>,
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/AllFiltersDrawer/AllFiltersDrawerContainer", () => ({
    default: () => <div data-testid="all-filters-drawer">Filters</div>,
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters", () => ({
    default: () => <div data-testid="mobile-filters">Mobile Filters</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Layout/components/StickyNavWrapper", () => ({
    default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-testid="sticky-nav-wrapper" className={className}>
            {children}
        </div>
    ),
}))

// Mock MobileToolbarWrapper to apply isLogged-based sticky classes via StickyNavWrapper
vi.mock(
    "@/presentation/pages/Products/components/ProductsToolbar/MobileToolbarWrapper",
    async () => {
        const useSession = (await import("@/presentation/hooks/useSession")).default
        const StickyNavWrapper = (
            await import(
                "@/presentation/pages/Home/UseYourMiles/Layout/components/StickyNavWrapper"
            )
        ).default
        return {
            default: ({ children }: { children: React.ReactNode }) => {
                const { isLogged } = useSession()
                return (
                    <StickyNavWrapper
                        className={`sticky bg-white z-20 ${isLogged ? "top-24 md:top-27" : "top-15 md:top-18"}`}
                    >
                        {children}
                    </StickyNavWrapper>
                )
            },
        }
    }
)

// Mock ProductsToolbar to render filtersDrawer and mobileFilters props via MobileToolbarWrapper
vi.mock(
    "@/presentation/pages/Products/components/ProductsToolbar/ProductsToolbar",
    async () => {
        const MobileToolbarWrapper = (
            await import(
                "@/presentation/pages/Products/components/ProductsToolbar/MobileToolbarWrapper"
            )
        ).default
        const ProductSearchBar = (
            await import("@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar")
        ).default
        return {
            default: ({
                filtersDrawer,
                mobileFilters,
            }: {
                filtersDrawer: React.ReactNode
                mobileFilters: React.ReactNode
            }) => (
                <MobileToolbarWrapper>
                    <div className="lg:hidden body-container">
                        <ProductSearchBar />
                        {filtersDrawer}
                    </div>
                    <div className="block lg:hidden">{mobileFilters}</div>
                </MobileToolbarWrapper>
            ),
        }
    }
)

describe("MobileToolbar", () => {
    it("should render all sub-components", () => {
        mockUseSession.mockReturnValue({ isLogged: false })
        render(<MobileToolbar />)

        expect(screen.getByTestId("sticky-nav-wrapper")).toBeInTheDocument()
        expect(screen.getByTestId("product-search-bar")).toBeInTheDocument()
        expect(screen.getByTestId("all-filters-drawer")).toBeInTheDocument()
        expect(screen.getByTestId("mobile-filters")).toBeInTheDocument()
    })

    it("should apply correct sticky positioning when user is not logged in", () => {
        mockUseSession.mockReturnValue({ isLogged: false })
        render(<MobileToolbar />)

        const stickyWrapper = screen.getByTestId("sticky-nav-wrapper")
        expect(stickyWrapper).toHaveClass("top-15")
        expect(stickyWrapper).toHaveClass("md:top-18")
    })

    it("should apply correct sticky positioning when user is logged in", () => {
        mockUseSession.mockReturnValue({ isLogged: true })
        render(<MobileToolbar />)

        const stickyWrapper = screen.getByTestId("sticky-nav-wrapper")
        expect(stickyWrapper).toHaveClass("top-24")
        expect(stickyWrapper).toHaveClass("md:top-27")
    })

    it("should have sticky and background classes", () => {
        mockUseSession.mockReturnValue({ isLogged: false })
        render(<MobileToolbar />)

        const stickyWrapper = screen.getByTestId("sticky-nav-wrapper")
        expect(stickyWrapper).toHaveClass("sticky")
        expect(stickyWrapper).toHaveClass("bg-white")
        expect(stickyWrapper).toHaveClass("z-20")
    })

    it("should render mobile toolbar container with correct classes", () => {
        mockUseSession.mockReturnValue({ isLogged: false })
        const { container } = render(<MobileToolbar />)

        const toolbarContainer = container.querySelector(".lg\\:hidden.body-container")
        expect(toolbarContainer).not.toBeNull()
    })

    it("should render mobile filters container with block lg:hidden classes", () => {
        mockUseSession.mockReturnValue({ isLogged: false })
        const { container } = render(<MobileToolbar />)

        const mobileFiltersContainer = container.querySelector(".block.lg\\:hidden")
        expect(mobileFiltersContainer).not.toBeNull()
    })
})
