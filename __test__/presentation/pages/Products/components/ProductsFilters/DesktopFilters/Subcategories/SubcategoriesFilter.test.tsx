import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import SubcategoriesFilter from "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/Subcategories/SubcategoriesFilter"
import { CategoryGroup } from "@/domain/entity/Category/structure/category"

const mockOnSelectSubcategory = vi.fn()
const mockSetActiveNestedSubcategory = vi.fn()

const defaultProps = {
    subcategories: [] as CategoryGroup[],
    activeNestedSubcategory: null as CategoryGroup | null,
    setActiveNestedSubcategory: mockSetActiveNestedSubcategory,
    onSelectSubcategory: mockOnSelectSubcategory,
    isPending: false,
}

vi.mock("@/presentation/pages/Products/components/ProductsFilters/FilterAccordion", () => ({
    default: ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div data-testid="accordion" data-title={title}>{children}</div>
    ),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/Subcategories/SubcategoryFilterItem", () => ({
    default: ({ subcategory, onSelectSubcategory }: { subcategory: CategoryGroup; onSelectSubcategory: (s: CategoryGroup) => void }) => (
        <button data-testid={`item-${subcategory.id}`} onClick={() => onSelectSubcategory(subcategory)}>
            {subcategory.name}
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

describe("SubcategoriesFilter", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render subcategories accordion with subcategories", () => {
        const props = {
            ...defaultProps,
            subcategories: [buildSub({ id: "1", name: "S1" })],
        }
        render(<SubcategoriesFilter {...props} />)
        expect(screen.getByTestId("accordion")).toHaveAttribute("data-title", "Subcategorías")
        expect(screen.getByTestId("item-1")).toBeInTheDocument()
    })

    it("should render empty when no subcategories provided", () => {
        const { container } = render(<SubcategoriesFilter {...defaultProps} />)
        expect(container.querySelector('[data-testid="accordion"]')).toBeInTheDocument()
    })

    it("should call onSelectSubcategory when a subcategory is clicked", () => {
        const sub = buildSub({ id: "leaf" })
        const props = {
            ...defaultProps,
            subcategories: [sub],
        }
        render(<SubcategoriesFilter {...props} />)
        fireEvent.click(screen.getByTestId("item-leaf"))
        expect(mockOnSelectSubcategory).toHaveBeenCalledWith(sub)
    })

    it("should show nested subcategories when activeNestedSubcategory is set", () => {
        const child = buildSub({ id: "c", name: "Child" })
        const parent = buildSub({ id: "p", name: "Parent", subcategories: [child] })
        const props = {
            ...defaultProps,
            subcategories: [parent],
            activeNestedSubcategory: parent,
        }
        render(<SubcategoriesFilter {...props} />)
        expect(screen.getByText("Parent")).toBeInTheDocument()
        expect(screen.getByTestId("item-c")).toBeInTheDocument()
    })

    it("should render breadcrumb when activeNestedSubcategory is set", () => {
        const child = buildSub({ id: "c", name: "Child" })
        const active = buildSub({ id: "a", name: "Active", subcategories: [child] })
        const props = {
            ...defaultProps,
            subcategories: [active],
            activeNestedSubcategory: active,
        }
        render(<SubcategoriesFilter {...props} />)
        expect(screen.getByText("Active")).toBeInTheDocument()
        expect(screen.getByText("Subcategorías")).toBeInTheDocument()
    })

    it("should call setActiveNestedSubcategory with null when breadcrumb back is clicked", () => {
        const active = buildSub({ id: "a", name: "Active", subcategories: [buildSub({ id: "c" })] })
        const props = {
            ...defaultProps,
            subcategories: [active],
            activeNestedSubcategory: active,
        }
        render(<SubcategoriesFilter {...props} />)
        fireEvent.click(screen.getByText("Subcategorías"))
        expect(mockSetActiveNestedSubcategory).toHaveBeenCalledWith(null)
    })

    it("should render top level subcategories when no activeNestedSubcategory", () => {
        const sub1 = buildSub({ id: "1", name: "Sub 1" })
        const sub2 = buildSub({ id: "2", name: "Sub 2" })
        const props = {
            ...defaultProps,
            subcategories: [sub1, sub2],
        }
        render(<SubcategoriesFilter {...props} />)
        expect(screen.getByTestId("item-1")).toBeInTheDocument()
        expect(screen.getByTestId("item-2")).toBeInTheDocument()
    })

    it("should support custom title and breadcrumb labels", () => {
        const active = buildSub({ id: "a", name: "Electronics", subcategories: [buildSub({ id: "c", name: "Phones" })] })
        render(
            <SubcategoriesFilter
                {...defaultProps}
                activeNestedSubcategory={active}
                title="Categorías"
                breadcrumbLabel="Categorías"
            />,
        )

        expect(screen.getByTestId("accordion")).toHaveAttribute("data-title", "Categorías")
        expect(screen.getByRole("button", { name: "Categorías" })).toBeInTheDocument()
    })
})
