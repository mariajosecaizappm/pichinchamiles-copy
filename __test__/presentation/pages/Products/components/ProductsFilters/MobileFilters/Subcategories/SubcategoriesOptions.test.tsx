import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import SubcategoriesOptions from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Subcategories/SubcategoriesOptions"
import { CategoryGroup } from "@/domain/entity/Category/structure/category"

const buildSub = (overrides: Partial<CategoryGroup> = {}): CategoryGroup => ({
    id: overrides.id ?? "1",
    name: overrides.name ?? "Sub",
    slug: overrides.slug ?? "sub",
    parent: overrides.parent ?? null,
    subcategories: overrides.subcategories ?? [],
})

describe("SubcategoriesOptions", () => {
    it("should render a toggle for each subcategory", () => {
        const subs = [
            buildSub({ id: "1", name: "Phones" }),
            buildSub({ id: "2", name: "Tablets" }),
        ]
        render(
            <SubcategoriesOptions subcategories={subs} onSelectSubcategory={vi.fn()} selectedSubcategories={[]} />
        )
        expect(screen.getByText("Phones")).toBeInTheDocument()
        expect(screen.getByText("Tablets")).toBeInTheDocument()
    })

    it("should mark a subcategory as active when included in selectedSubcategories", () => {
        const subs = [buildSub({ id: "1", name: "Phones" })]
        render(
            <SubcategoriesOptions
                subcategories={subs}
                onSelectSubcategory={vi.fn()}
                selectedSubcategories={[buildSub({ id: "1", name: "Phones" })]}
            />
        )
        expect(screen.getByText("Phones").closest("button")).toHaveAttribute("data-active", "true")
    })

    it("should mark a parent subcategory as active when a nested child is selected", () => {
        const parent = buildSub({ id: "parent", name: "Parent" })
        const child = buildSub({
            id: "child",
            name: "Child",
            parent: { id: "parent", slug: "parent" },
        })
        render(
            <SubcategoriesOptions
                subcategories={[parent]}
                onSelectSubcategory={vi.fn()}
                selectedSubcategories={[child]}
            />
        )
        expect(screen.getByText("Parent").closest("button")).toHaveAttribute("data-active", "true")
    })

    it("should call onSelectSubcategory when a subcategory is pressed", () => {
        const onSelectSubcategory = vi.fn()
        const sub = buildSub({ id: "1", name: "Phones" })
        render(
            <SubcategoriesOptions
                subcategories={[sub]}
                onSelectSubcategory={onSelectSubcategory}
                selectedSubcategories={[]}
            />
        )
        fireEvent.click(screen.getByText("Phones"))
        expect(onSelectSubcategory).toHaveBeenCalledWith(sub)
    })
})
