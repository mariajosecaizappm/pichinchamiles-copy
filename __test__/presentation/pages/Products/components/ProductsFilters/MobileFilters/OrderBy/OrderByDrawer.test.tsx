import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import OrderByDrawer from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/OrderBy/OrderByDrawer"

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer", () => ({
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

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/OrderBy/OrderByOptions", () => ({
    default: () => <div data-testid="order-by-options" />,
}))

import { OrderByValue } from "@/presentation/pages/Products/components/ProductsFilters/types"

const defaultProps = {
    onApplyFilters: vi.fn(),
    onClearFilters: vi.fn(),
    isOpen: true,
    onOpenChange: vi.fn(),
    onClose: vi.fn(),
    selectedOption: null as OrderByValue | null,
    onSelectOption: vi.fn(),
}

describe("OrderByDrawer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render FilterDrawer with title 'Ordenar por'", () => {
        render(<OrderByDrawer {...defaultProps} />)
        expect(screen.getByTestId("trigger-label")).toHaveTextContent("Ordenar por")
    })

    it("should call onApplyFilters when apply is clicked", () => {
        const onApplyFilters = vi.fn()
        render(<OrderByDrawer {...defaultProps} onApplyFilters={onApplyFilters} />)
        fireEvent.click(screen.getByTestId("apply"))
        expect(onApplyFilters).toHaveBeenCalled()
    })

    it("should call onClearFilters when clear is clicked", () => {
        const onClearFilters = vi.fn()
        render(<OrderByDrawer {...defaultProps} onClearFilters={onClearFilters} />)
        fireEvent.click(screen.getByTestId("clear"))
        expect(onClearFilters).toHaveBeenCalled()
    })

    it("should call onClose when close is clicked", () => {
        const onClose = vi.fn()
        render(<OrderByDrawer {...defaultProps} onClose={onClose} />)
        fireEvent.click(screen.getByTestId("close"))
        expect(onClose).toHaveBeenCalled()
    })

    it("should render OrderByOptions as child", () => {
        render(<OrderByDrawer {...defaultProps} />)
        expect(screen.getByTestId("order-by-options")).toBeInTheDocument()
    })
})
