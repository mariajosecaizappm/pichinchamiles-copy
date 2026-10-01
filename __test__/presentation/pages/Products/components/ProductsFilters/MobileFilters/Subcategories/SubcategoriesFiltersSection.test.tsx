import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import SubcategoriesFiltersSection from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Subcategories/SubcategoriesFiltersSection"
import { CategoryGroup } from "@/domain/entity/Category/structure/category"

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Subcategories/SubcategoriesOptions", () => ({
    default: ({ subcategories }: { subcategories: CategoryGroup[] }) => (
        <div data-testid="subcategories-options" data-count={subcategories.length}>options</div>
    ),
}))

const buildSub = (overrides: Partial<CategoryGroup> = {}): CategoryGroup => ({
    id: overrides.id ?? "1",
    name: overrides.name ?? "Sub",
    slug: overrides.slug ?? "sub",
    parent: overrides.parent ?? null,
    subcategories: overrides.subcategories ?? [],
})

describe("SubcategoriesFiltersSection", () => {
    it("should render SubcategoriesOptions when no active subcategory", () => {
        const subs = [buildSub({ id: "1" }), buildSub({ id: "2" })]
        render(
            <SubcategoriesFiltersSection
                activeSubcategory={null}
                subcategories={subs}
                onSelectSubcategory={vi.fn()}
                selectedSubcategories={[]}
                setActiveSubcategory={vi.fn()}
            />
        )
        expect(screen.getByTestId("subcategories-options")).toBeInTheDocument()
        expect(screen.getByTestId("subcategories-options")).toHaveAttribute("data-count", "2")
    })

    it("should render breadcrumb and nested options when an active subcategory exists", () => {
        const nested = buildSub({ id: "n1", name: "Nested" })
        const active = buildSub({
            id: "a",
            name: "Active",
            subcategories: [nested],
        })
        render(
            <SubcategoriesFiltersSection
                activeSubcategory={active}
                subcategories={[active]}
                onSelectSubcategory={vi.fn()}
                selectedSubcategories={[]}
                setActiveSubcategory={vi.fn()}
            />
        )
        expect(screen.getByText("Active")).toBeInTheDocument()
        expect(screen.getByText("Nested")).toBeInTheDocument()
    })

    it("should call setActiveSubcategory(null) when breadcrumb back button is pressed", () => {
        const setActiveSubcategory = vi.fn()
        const active = buildSub({ id: "a", name: "Active", subcategories: [] })
        const { container } = render(
            <SubcategoriesFiltersSection
                activeSubcategory={active}
                subcategories={[active]}
                onSelectSubcategory={vi.fn()}
                selectedSubcategories={[]}
                setActiveSubcategory={setActiveSubcategory}
            />
        )
        const backButton = container.querySelector("button.text-grayscale-400") as HTMLElement
        expect(backButton).toBeInTheDocument()
        fireEvent.click(backButton)
        expect(setActiveSubcategory).toHaveBeenCalledWith(null)
    })

    it("should call onSelectSubcategory when a nested subcategory is pressed", () => {
        const onSelectSubcategory = vi.fn()
        const nested = buildSub({ id: "n1", name: "Nested" })
        const active = buildSub({ id: "a", name: "Active", subcategories: [nested] })
        render(
            <SubcategoriesFiltersSection
                activeSubcategory={active}
                subcategories={[active]}
                onSelectSubcategory={onSelectSubcategory}
                selectedSubcategories={[]}
                setActiveSubcategory={vi.fn()}
            />
        )
        fireEvent.click(screen.getByText("Nested"))
        expect(onSelectSubcategory).toHaveBeenCalledWith(nested)
    })

    it("should mark a nested subcategory as active when it is selected", () => {
        const nested = buildSub({ id: "n1", name: "Nested" })
        const active = buildSub({ id: "a", name: "Active", subcategories: [nested] })
        render(
            <SubcategoriesFiltersSection
                activeSubcategory={active}
                subcategories={[active]}
                onSelectSubcategory={vi.fn()}
                selectedSubcategories={[nested]}
                setActiveSubcategory={vi.fn()}
            />
        )
        expect(screen.getByText("Nested").closest("button")).toHaveAttribute("data-active", "true")
    })
})
