import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import AllFiltersDrawer from "@/presentation/pages/Products/components/ProductsFilters/AllFiltersDrawer/AllFiltersDrawer"

// AllFiltersDrawer is now a thin pass-through: it forwards isOpen/onOpen/onOpenChange/
// handleClose/onClearFilters/onApplyFilters/children straight to AllFiltersWrapper,
// which owns all the actual drawer/footer/header rendering logic.
vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/AllFiltersDrawer/components/AllFiltersWrapper",
    () => ({
        default: (props: Record<string, unknown>) => (
            <div data-testid="all-filters-wrapper">
                <span data-testid="is-open">{String(props.isOpen)}</span>
                <button data-testid="open" onClick={props.onOpen as () => void}>open</button>
                <button data-testid="open-change" onClick={props.onOpenChange as () => void}>open-change</button>
                <button data-testid="handle-close" onClick={props.handleClose as () => void}>handle-close</button>
                <button data-testid="clear" onClick={props.onClearFilters as () => void}>clear</button>
                <button data-testid="apply" onClick={props.onApplyFilters as () => void}>apply</button>
                {props.children as React.ReactNode}
            </div>
        ),
    }),
)

const defaultProps = {
    isOpen: true,
    onOpen: vi.fn(),
    onOpenChange: vi.fn(),
    handleClose: vi.fn(),
    onClearFilters: vi.fn(),
    onApplyFilters: vi.fn(),
}

describe("AllFiltersDrawer", () => {
    it("should render AllFiltersWrapper", () => {
        render(
            <AllFiltersDrawer {...defaultProps}>
                <div data-testid="child" />
            </AllFiltersDrawer>,
        )
        expect(screen.getByTestId("all-filters-wrapper")).toBeInTheDocument()
    })

    it("should forward isOpen to AllFiltersWrapper", () => {
        render(
            <AllFiltersDrawer {...defaultProps} isOpen={false}>
                <div />
            </AllFiltersDrawer>,
        )
        expect(screen.getByTestId("is-open")).toHaveTextContent("false")
    })

    it("should render children inside AllFiltersWrapper", () => {
        render(
            <AllFiltersDrawer {...defaultProps}>
                <div data-testid="filter-child">child content</div>
            </AllFiltersDrawer>,
        )
        expect(screen.getByTestId("filter-child")).toBeInTheDocument()
    })

    it("should forward onOpen to AllFiltersWrapper", () => {
        const onOpen = vi.fn()
        render(
            <AllFiltersDrawer {...defaultProps} onOpen={onOpen}>
                <div />
            </AllFiltersDrawer>,
        )
        fireEvent.click(screen.getByTestId("open"))
        expect(onOpen).toHaveBeenCalledTimes(1)
    })

    it("should forward onOpenChange to AllFiltersWrapper", () => {
        const onOpenChange = vi.fn()
        render(
            <AllFiltersDrawer {...defaultProps} onOpenChange={onOpenChange}>
                <div />
            </AllFiltersDrawer>,
        )
        fireEvent.click(screen.getByTestId("open-change"))
        expect(onOpenChange).toHaveBeenCalledTimes(1)
    })

    it("should forward handleClose to AllFiltersWrapper", () => {
        const handleClose = vi.fn()
        render(
            <AllFiltersDrawer {...defaultProps} handleClose={handleClose}>
                <div />
            </AllFiltersDrawer>,
        )
        fireEvent.click(screen.getByTestId("handle-close"))
        expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it("should forward onClearFilters to AllFiltersWrapper", () => {
        const onClearFilters = vi.fn()
        render(
            <AllFiltersDrawer {...defaultProps} onClearFilters={onClearFilters}>
                <div />
            </AllFiltersDrawer>,
        )
        fireEvent.click(screen.getByTestId("clear"))
        expect(onClearFilters).toHaveBeenCalledTimes(1)
    })

    it("should forward onApplyFilters to AllFiltersWrapper", () => {
        const onApplyFilters = vi.fn()
        render(
            <AllFiltersDrawer {...defaultProps} onApplyFilters={onApplyFilters}>
                <div />
            </AllFiltersDrawer>,
        )
        fireEvent.click(screen.getByTestId("apply"))
        expect(onApplyFilters).toHaveBeenCalledTimes(1)
    })
})