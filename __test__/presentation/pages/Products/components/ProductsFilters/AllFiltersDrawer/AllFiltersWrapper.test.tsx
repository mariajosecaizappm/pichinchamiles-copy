import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import AllFiltersWrapper from "@/presentation/pages/Products/components/ProductsFilters/AllFiltersDrawer/components/AllFiltersWrapper"

const mockOnOpen = vi.fn()
const mockOnOpenChange = vi.fn()
const mockHandleClose = vi.fn()
const mockOnClearFilters = vi.fn()
const mockOnApplyFilters = vi.fn()
const mockDrawerClose = vi.fn()

vi.mock("@heroui/react", () => ({
    Button: ({
        children,
        onClick,
        onPress,
        ...rest
    }: {
        children?: React.ReactNode
        onClick?: (e?: unknown) => void
        onPress?: (e?: unknown) => void
    }) => (
        <button
            type="button"
            onClick={(e) => {
                onClick?.(e)
                onPress?.(e)
            }}
            {...rest}
        >
            {children}
        </button>
    ),
    Drawer: ({
        isOpen,
        onOpenChange,
        children,
    }: {
        isOpen: boolean
        onOpenChange: (open: boolean) => void
        children: React.ReactNode
    }) => (
        <div data-testid="drawer" data-open={String(isOpen)}>
            <button
                type="button"
                data-testid="drawer-dismiss"
                onClick={() => onOpenChange(false)}
            >
                dismiss
            </button>
            <button
                type="button"
                data-testid="drawer-open-change-true"
                onClick={() => onOpenChange(true)}
            >
                open-change-true
            </button>
            {children}
        </div>
    ),
    DrawerContent: ({
        children,
    }: {
        children: (onClose: () => void) => React.ReactNode
    }) => <div data-testid="drawer-content">{children(mockDrawerClose)}</div>,
    DrawerBody: ({
        children,
        className,
    }: {
        children: React.ReactNode
        className?: string
    }) => (
        <div data-testid="drawer-body" className={className}>
            {children}
        </div>
    ),
}))

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer/FilterDrawerHeader",
    () => ({
        default: ({ onClose }: { onClose: () => void }) => (
            <button type="button" data-testid="header-close" onClick={onClose}>
                header-close
            </button>
        ),
    })
)

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/AllFiltersDrawer/AllFiltersTrigger",
    () => ({
        default: ({ onOpen }: { onOpen: () => void }) => (
            <button type="button" data-testid="all-filters-trigger" onClick={onOpen}>
                trigger
            </button>
        ),
    })
)

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer/FilterDrawerFooter/FilterDrawerFooter",
    () => ({
        default: ({
            onClearFilters,
            onApplyFilters,
        }: {
            onClearFilters: () => void
            onApplyFilters: () => void
        }) => (
            <div data-testid="filter-drawer-footer">
                <button
                    type="button"
                    data-testid="footer-clear"
                    onClick={onClearFilters}
                >
                    clear
                </button>
                <button
                    type="button"
                    data-testid="footer-apply"
                    onClick={onApplyFilters}
                >
                    apply
                </button>
            </div>
        ),
    })
)

const defaultProps = {
    isOpen: false,
    onOpen: mockOnOpen,
    onOpenChange: mockOnOpenChange,
    handleClose: mockHandleClose,
    onClearFilters: mockOnClearFilters,
    onApplyFilters: mockOnApplyFilters,
    children: <div data-testid="children">filters</div>,
}

describe("AllFiltersWrapper", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("renders trigger, drawer and children", () => {
        render(<AllFiltersWrapper {...defaultProps} />)

        expect(screen.getByTestId("drawer")).toBeInTheDocument()
        expect(screen.getByTestId("children")).toBeInTheDocument()
        expect(screen.getByTestId("filter-drawer-footer")).toBeInTheDocument()
        // trigger real (AllFiltersTrigger no mockeado)
        expect(screen.getAllByRole("button").length).toBeGreaterThan(0)
    })

    it("calls onOpen when trigger is clicked", () => {
        render(<AllFiltersWrapper {...defaultProps} />)

        // primer botón del árbol = AllFiltersTrigger
        const trigger = screen.getAllByRole("button")[0]
        fireEvent.click(trigger)

        expect(mockOnOpen).toHaveBeenCalledTimes(1)
    })

    it("passes isOpen to Drawer", () => {
        render(<AllFiltersWrapper {...defaultProps} isOpen />)

        expect(screen.getByTestId("drawer")).toHaveAttribute("data-open", "true")
    })

    it("calls handleClose and onOpenChange when drawer dismisses (open=false)", () => {
        render(<AllFiltersWrapper {...defaultProps} isOpen />)

        fireEvent.click(screen.getByTestId("drawer-dismiss"))

        expect(mockHandleClose).toHaveBeenCalledTimes(1)
        expect(mockOnOpenChange).toHaveBeenCalledTimes(1)
    })

    it("calls only onOpenChange when onOpenChange receives open=true", () => {
        render(<AllFiltersWrapper {...defaultProps} />)

        fireEvent.click(screen.getByTestId("drawer-open-change-true"))

        expect(mockHandleClose).not.toHaveBeenCalled()
        expect(mockOnOpenChange).toHaveBeenCalledTimes(1)
    })

    it("calls handleClose and drawer onClose from header", () => {
        render(<AllFiltersWrapper {...defaultProps} isOpen />)

        fireEvent.click(screen.getByTestId("header-close"))

        expect(mockHandleClose).toHaveBeenCalledTimes(1)
        expect(mockDrawerClose).toHaveBeenCalledTimes(1)
    })

    it("forwards onClearFilters to footer", () => {
        render(<AllFiltersWrapper {...defaultProps} />)

        fireEvent.click(screen.getByTestId("footer-clear"))

        expect(mockOnClearFilters).toHaveBeenCalledTimes(1)
    })

    it("forwards onApplyFilters to footer", () => {
        render(<AllFiltersWrapper {...defaultProps} />)

        fireEvent.click(screen.getByTestId("footer-apply"))

        expect(mockOnApplyFilters).toHaveBeenCalledTimes(1)
    })
})