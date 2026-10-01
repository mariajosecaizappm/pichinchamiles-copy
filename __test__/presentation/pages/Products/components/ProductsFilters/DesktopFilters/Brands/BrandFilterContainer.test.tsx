import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import BrandFilterContainer from "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/Brands/BrandFilterContainer"

const mockUseProductsContext = vi.fn()

vi.mock("@/presentation/pages/Products/context/useProductsContext", () => ({
    useProductsContext: () => mockUseProductsContext(),
}))

// BrandFilterContainer is now a thin wrapper delegating to BrandFilterBaseContainer,
// which owns all the real filter logic. Mock the base container, not BrandFilter.
vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/Brands/BrandFilterBaseContainer",
    () => ({
        default: (props: Record<string, unknown>) => (
            <div data-testid="brand-filter-base-container">
                <span data-testid="brand-ids">{JSON.stringify(props.brandIds)}</span>
            </div>
        ),
    }),
)

describe("BrandFilterContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render BrandFilterBaseContainer", () => {
        mockUseProductsContext.mockReturnValue({ productBrands: ["brand1", "brand2"] })

        render(<BrandFilterContainer />)

        expect(screen.getByTestId("brand-filter-base-container")).toBeInTheDocument()
    })

    it("should pass productBrands from context as brandIds to BrandFilterBaseContainer", () => {
        mockUseProductsContext.mockReturnValue({ productBrands: ["brand1", "brand2"] })

        render(<BrandFilterContainer />)

        expect(screen.getByTestId("brand-ids")).toHaveTextContent(JSON.stringify(["brand1", "brand2"]))
    })

    it("should pass an empty array when context has no brands", () => {
        mockUseProductsContext.mockReturnValue({ productBrands: [] })

        render(<BrandFilterContainer />)

        expect(screen.getByTestId("brand-ids")).toHaveTextContent(JSON.stringify([]))
    })
})