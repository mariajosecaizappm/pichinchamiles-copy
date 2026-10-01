import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import BrandsDrawer from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/BrandsDrawer"

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer", () => ({
    default: (props: Record<string, unknown>) => (
        <div data-testid="filter-drawer">
            <span data-testid="trigger-label">{String(props.triggerLabel)}</span>
            <button data-testid="apply" onClick={props.onApplyFilters as () => void}>apply</button>
            <button data-testid="clear" onClick={props.onClearFilters as () => void}>clear</button>
            {props.children as React.ReactNode}
        </div>
    ),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/BrandsOptions", () => ({
    default: ({ brands, selectedBrand }: { brands: { id: string }[]; selectedBrand: string | null }) => (
        <div data-testid="brands-options" data-count={brands?.length ?? 0} data-selected={String(selectedBrand)} />
    ),
}))

import type { Brand } from "@/domain/entity/Brand/brand"

const defaultProps = {
    onApplyFilters: vi.fn(),
    onClearFilters: vi.fn(),
    onClose: vi.fn(),
    isOpen: true,
    onOpenChange: vi.fn(),
    brands: [{ id: "b1", name: "Brand 1", slug: "brand-1" }] as Brand[],
    isLoading: false,
    selectedBrand: null as string | null,
    onSelectBrand: vi.fn(),
}

describe("BrandsDrawer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render FilterDrawer with 'Marcas' label", () => {
        render(<BrandsDrawer {...defaultProps} />)
        expect(screen.getByTestId("trigger-label")).toHaveTextContent("Marcas")
    })

    it("should render BrandsOptions with brands data", () => {
        render(<BrandsDrawer {...defaultProps} />)
        expect(screen.getByTestId("brands-options")).toHaveAttribute("data-count", "1")
    })

    it("should call onApplyFilters when apply is clicked", () => {
        const onApplyFilters = vi.fn()
        render(<BrandsDrawer {...defaultProps} onApplyFilters={onApplyFilters} />)
        fireEvent.click(screen.getByTestId("apply"))
        expect(onApplyFilters).toHaveBeenCalled()
    })

    it("should call onClearFilters when clear is clicked", () => {
        const onClearFilters = vi.fn()
        render(<BrandsDrawer {...defaultProps} onClearFilters={onClearFilters} />)
        fireEvent.click(screen.getByTestId("clear"))
        expect(onClearFilters).toHaveBeenCalled()
    })

    it("should forward selectedBrand to BrandsOptions", () => {
        render(<BrandsDrawer {...defaultProps} selectedBrand="b1" />)
        expect(screen.getByTestId("brands-options")).toHaveAttribute("data-selected", "b1")
    })
})
