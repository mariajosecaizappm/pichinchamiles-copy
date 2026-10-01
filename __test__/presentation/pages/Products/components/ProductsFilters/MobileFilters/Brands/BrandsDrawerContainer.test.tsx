import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import BrandsDrawerContainer from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/BrandsDrawerContainer"

const mockUseProductsContext = vi.fn()

vi.mock("@/presentation/pages/Products/context/useProductsContext", () => ({
    useProductsContext: () => mockUseProductsContext(),
}))

// BrandsDrawerContainer is now a thin wrapper delegating to BrandsDrawerBaseContainer,
// which owns all the real drawer/navigation logic. Mock the base container.
vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/BrandsDrawerBaseContainer",
    () => ({
        default: (props: Record<string, unknown>) => (
            <div data-testid="brands-drawer-base-container">
                <span data-testid="brand-ids">{JSON.stringify(props.brandIds)}</span>
            </div>
        ),
    }),
)

describe("BrandsDrawerContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render BrandsDrawerBaseContainer", () => {
        mockUseProductsContext.mockReturnValue({ productBrands: ["b1", "b2"] })

        render(<BrandsDrawerContainer />)

        expect(screen.getByTestId("brands-drawer-base-container")).toBeInTheDocument()
    })

    it("should pass productBrands from context as brandIds to BrandsDrawerBaseContainer", () => {
        mockUseProductsContext.mockReturnValue({ productBrands: ["b1", "b2"] })

        render(<BrandsDrawerContainer />)

        expect(screen.getByTestId("brand-ids")).toHaveTextContent(JSON.stringify(["b1", "b2"]))
    })

    it("should pass an empty array when context has no brands", () => {
        mockUseProductsContext.mockReturnValue({ productBrands: [] })

        render(<BrandsDrawerContainer />)

        expect(screen.getByTestId("brand-ids")).toHaveTextContent(JSON.stringify([]))
    })
})