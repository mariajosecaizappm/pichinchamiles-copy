import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import PriceRangeDrawer from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/PriceRange/PriceRangeDrawer"

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer/FilterDrawer", () => ({
    default: (props: Record<string, unknown>) => (
        <div data-testid="filter-drawer">
            <span data-testid="trigger-label">{String(props.triggerLabel)}</span>
            <button data-testid="apply" onClick={props.onApplyFilters as () => void}>apply</button>
            <button data-testid="clear" onClick={props.onClearFilters as () => void}>clear</button>
            <button data-testid="close" onClick={props.onClose as () => void}>close</button>
            {props.children as React.ReactNode}
        </div>
    ),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/PriceRange/PriceRangeOptions", () => ({
    default: () => <div data-testid="price-range-options" />,
}))

const defaultProps = {
    onApplyFilters: vi.fn(),
    onClearFilters: vi.fn(),
    isOpen: true,
    onOpenChange: vi.fn(),
    onClose: vi.fn(),
    selectedOption: null as string | null,
    onSelectionChange: vi.fn(),
}

describe("PriceRangeDrawer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render FilterDrawer with title 'Rango de precios'", () => {
        render(<PriceRangeDrawer {...defaultProps} />)
        expect(screen.getByTestId("trigger-label")).toHaveTextContent("Rango de precios")
    })

    it("should call onApplyFilters when apply is clicked", () => {
        const onApplyFilters = vi.fn()
        render(<PriceRangeDrawer {...defaultProps} onApplyFilters={onApplyFilters} />)
        fireEvent.click(screen.getByTestId("apply"))
        expect(onApplyFilters).toHaveBeenCalled()
    })

    it("should call onClearFilters when clear is clicked", () => {
        const onClearFilters = vi.fn()
        render(<PriceRangeDrawer {...defaultProps} onClearFilters={onClearFilters} />)
        fireEvent.click(screen.getByTestId("clear"))
        expect(onClearFilters).toHaveBeenCalled()
    })

    it("should call onClose when close is clicked", () => {
        const onClose = vi.fn()
        render(<PriceRangeDrawer {...defaultProps} onClose={onClose} />)
        fireEvent.click(screen.getByTestId("close"))
        expect(onClose).toHaveBeenCalled()
    })

    it("should render PriceRangeOptions as child", () => {
        render(<PriceRangeDrawer {...defaultProps} />)
        expect(screen.getByTestId("price-range-options")).toBeInTheDocument()
    })
})
