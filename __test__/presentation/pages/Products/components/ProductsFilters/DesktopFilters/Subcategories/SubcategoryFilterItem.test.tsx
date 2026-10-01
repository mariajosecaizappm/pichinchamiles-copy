import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import SubcategoryFilterItem from "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/Subcategories/SubcategoryFilterItem"
import { CategoryGroup } from "@/domain/entity/Category/structure/category"

let mockSearchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => "/productos",
    useSearchParams: () => mockSearchParams,
}))

vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => ({
        searchValues: { sort: "", recommended: false, brand: "", search: "", category: "" },
        searchParams: mockSearchParams,
        onChangeFilter: vi.fn(),
        clearSearch: vi.fn(),
        pathname: "/productos",
    }),
}))

vi.mock("@/presentation/components/Form/components/Checkbox", () => ({
    Checkbox: ({ label, isSelected, isDisabled, onValueChange }: {
        label: string
        isSelected?: boolean
        isDisabled?: boolean
        onValueChange?: () => void
    }) => (
        <button
            data-testid={`checkbox-${label}`}
            data-selected={String(!!isSelected)}
            data-disabled={String(!!isDisabled)}
            onClick={() => onValueChange?.()}
        >
            {label}
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

describe("SubcategoryFilterItem", () => {
    beforeEach(() => {
        mockSearchParams = new URLSearchParams()
    })

    it("should render the subcategory name", () => {
        render(
            <SubcategoryFilterItem subcategory={buildSub({ id: "1", name: "Phones" })} onSelectSubcategory={vi.fn()} isPending={false} />
        )
        expect(screen.getByText("Phones")).toBeInTheDocument()
    })

    it("should mark as selected when its id is in current subcategories", () => {
        mockSearchParams = new URLSearchParams("subcategory=1")
        render(
            <SubcategoryFilterItem subcategory={buildSub({ id: "1", name: "Phones" })} onSelectSubcategory={vi.fn()} isPending={false} />
        )
        expect(screen.getByTestId("checkbox-Phones")).toHaveAttribute("data-selected", "true")
    })

    it("should mark as selected when a nested child id is in current subcategories", () => {
        mockSearchParams = new URLSearchParams("subcategory=child")
        const sub = buildSub({ id: "p", name: "Parent", subcategories: [buildSub({ id: "child" })] })
        render(<SubcategoryFilterItem subcategory={sub} onSelectSubcategory={vi.fn()} isPending={false} />)
        expect(screen.getByTestId("checkbox-Parent")).toHaveAttribute("data-selected", "true")
    })

    it("should mark as disabled when isPending is true", () => {
        render(
            <SubcategoryFilterItem subcategory={buildSub({ id: "1", name: "Phones" })} onSelectSubcategory={vi.fn()} isPending={true} />
        )
        expect(screen.getByTestId("checkbox-Phones")).toHaveAttribute("data-disabled", "true")
    })

    it("should call onSelectSubcategory when the wrapper is clicked", () => {
        const onSelectSubcategory = vi.fn()
        const sub = buildSub({ id: "1", name: "Phones" })
        const { container } = render(
            <SubcategoryFilterItem subcategory={sub} onSelectSubcategory={onSelectSubcategory} isPending={false} />
        )
        fireEvent.click(container.firstChild as HTMLElement)
        expect(onSelectSubcategory).toHaveBeenCalledWith(sub)
    })
})
