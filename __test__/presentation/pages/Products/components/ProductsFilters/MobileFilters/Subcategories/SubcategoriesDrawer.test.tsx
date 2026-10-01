import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import SubcategoriesDrawer from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Subcategories/SubcategoriesDrawer"
import { CategoryGroup } from "@/domain/entity/Category/structure/category"

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer/FilterDrawer", () => ({
    default: (props: Record<string, unknown>) => (
        <div data-testid="filter-drawer" data-disabled={String(props.disabled)}>
            <span data-testid="trigger-label">{String(props.triggerLabel)}</span>
            <button data-testid="apply" onClick={props.onApplyFilters as () => void}>apply</button>
            <button data-testid="clear" onClick={props.onClearFilters as () => void}>clear</button>
            <button data-testid="close" onClick={props.onClose as () => void}>close</button>
            {props.children as React.ReactNode}
        </div>
    ),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Subcategories/SubcategoriesFiltersSection", () => ({
    default: ({ onSelectSubcategory }: { onSelectSubcategory: (s: CategoryGroup) => void }) => (
        <button
            data-testid="subs-section"
            onClick={() => onSelectSubcategory({ id: "s1", name: "S1", slug: "s1", parent: null, subcategories: [] } as CategoryGroup)}
        >
            select
        </button>
    ),
}))

const buildSub = (overrides: Partial<CategoryGroup> = {}): CategoryGroup => ({
    id: overrides.id ?? "1",
    name: overrides.name ?? "Sub",
    slug: overrides.slug ?? "sub",
    parent: overrides.parent ?? null,
    subcategories: overrides.subcategories ?? [],
})

const defaultProps = {
    isOpen: true,
    onOpenChange: vi.fn(),
    onApplyFilters: vi.fn(),
    onClearFilters: vi.fn(),
    onClose: vi.fn(),
    subcategories: [] as CategoryGroup[],
    selectedSubcategories: [] as CategoryGroup[],
    onSelectSubcategory: vi.fn(),
    activeSubcategory: null as CategoryGroup | null,
    setActiveSubcategory: vi.fn(),
}

describe("SubcategoriesDrawer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render with title 'Subcategorías'", () => {
        render(<SubcategoriesDrawer {...defaultProps} />)
        expect(screen.getByTestId("trigger-label")).toHaveTextContent("Subcategorías")
    })

    it("should disable the drawer when no subcategories are available", () => {
        render(<SubcategoriesDrawer {...defaultProps} subcategories={[]} disabled={true} />)
        expect(screen.getByTestId("filter-drawer")).toHaveAttribute("data-disabled", "true")
    })

    it("should enable the drawer when subcategories are available", () => {
        render(<SubcategoriesDrawer {...defaultProps} subcategories={[buildSub({ id: "1" })]} disabled={false} />)
        expect(screen.getByTestId("filter-drawer")).toHaveAttribute("data-disabled", "false")
    })

    it("should call onApplyFilters when apply is clicked", () => {
        const onApplyFilters = vi.fn()
        render(<SubcategoriesDrawer {...defaultProps} onApplyFilters={onApplyFilters} />)
        fireEvent.click(screen.getByTestId("apply"))
        expect(onApplyFilters).toHaveBeenCalled()
    })

    it("should call onClearFilters when clear is clicked", () => {
        const onClearFilters = vi.fn()
        render(<SubcategoriesDrawer {...defaultProps} onClearFilters={onClearFilters} />)
        fireEvent.click(screen.getByTestId("clear"))
        expect(onClearFilters).toHaveBeenCalled()
    })

    it("should call onClose when close is clicked", () => {
        const onClose = vi.fn()
        render(<SubcategoriesDrawer {...defaultProps} onClose={onClose} />)
        fireEvent.click(screen.getByTestId("close"))
        expect(onClose).toHaveBeenCalled()
    })

    it("should call onSelectSubcategory when a subcategory is selected", () => {
        const onSelectSubcategory = vi.fn()
        render(<SubcategoriesDrawer {...defaultProps} onSelectSubcategory={onSelectSubcategory} />)
        fireEvent.click(screen.getByTestId("subs-section"))
        expect(onSelectSubcategory).toHaveBeenCalledWith(
            expect.objectContaining({ id: "s1" })
        )
    })
})
