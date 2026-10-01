import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import SubcategoriesFilterContainer from "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/Subcategories/SubcategoriesFilterContainer"
import { CategoryGroup } from "@/domain/entity/Category/structure/category"
import { EventName } from "@/presentation/analytics/types"
import { mockTrack } from "../../../../../../../utils/analytics"

const mockPush = vi.fn()
const mockUseParams = vi.fn()
let mockSearchParams = new URLSearchParams()
let mockSubcategories: CategoryGroup[] = []

vi.mock("next/navigation", () => ({
    useParams: () => mockUseParams(),
    usePathname: () => "/productos/categoria/electronics",
    useRouter: () => ({ push: mockPush }),
    useSearchParams: () => mockSearchParams,
}))

vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => ({
        searchValues: { brand: "", sort: "", recommended: false, search: "", category: "" },
        searchParams: mockSearchParams,
        onChangeFilter: vi.fn(),
        clearSearch: vi.fn(),
        pathname: "/productos/categoria/electronics",
    }),
}))

vi.mock("@/presentation/pages/Products/hooks/useProductSubcategories", () => ({
    default: () => ({ subcategories: mockSubcategories }),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/Subcategories/SubcategoriesFilter", () => ({
    default: (props: Record<string, unknown>) => (
        <div data-testid="subcategories-filter">
            <span data-testid="subcategoriesCount">{Array.isArray(props.subcategories) ? props.subcategories.length : 0}</span>
            <span data-testid="activeNested">{props.activeNestedSubcategory ? (props.activeNestedSubcategory as CategoryGroup).name : "null"}</span>
            <button data-testid="select-subcategory" onClick={() => {
                const sub = { id: "sub1", name: "Sub 1", slug: "sub1", parent: null, subcategories: [] }
                ;(props.onSelectSubcategory as (s: CategoryGroup) => void)(sub)
            }}>
                Select Subcategory
            </button>
            <button data-testid="select-nested" onClick={() => {
                const sub = { id: "parent", name: "Parent", slug: "parent", parent: null, subcategories: [{ id: "child", name: "Child", slug: "child", parent: null, subcategories: [] }] }
                ;(props.onSelectSubcategory as (s: CategoryGroup) => void)(sub)
            }}>
                Select Nested
            </button>
            <button data-testid="set-active" onClick={() => {
                const sub = { id: "parent", name: "Parent", slug: "parent", parent: null, subcategories: [] }
                ;(props.setActiveNestedSubcategory as (s: CategoryGroup | null) => void)(sub)
            }}>
                Set Active
            </button>
        </div>
    ),
}))

const buildSub = (overrides: Partial<CategoryGroup> = {}): CategoryGroup => ({
    id: overrides.id ?? "1",
    name: overrides.name ?? "Sub",
    slug: overrides.slug ?? "sub",
    parent: overrides.parent ?? null,
    subcategories: overrides.subcategories ?? [],
})

describe("SubcategoriesFilterContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockTrack.mockReset()
        mockUseParams.mockReturnValue({ subcategory: "electronics" })
        mockSearchParams = new URLSearchParams()
        mockSubcategories = []
    })

    it("should return null when no subcategory param", () => {
        mockUseParams.mockReturnValue({})
        const { container } = render(<SubcategoriesFilterContainer />)
        expect(container.firstChild).toBeNull()
    })

    it("should return null when no subcategories", () => {
        mockSubcategories = []
        const { container } = render(<SubcategoriesFilterContainer />)
        expect(container.firstChild).toBeNull()
    })

    it("should render filter when main subcategory is not required", () => {
        mockUseParams.mockReturnValue({})
        mockSubcategories = [buildSub({ id: "1", name: "Category" })]

        render(
            <SubcategoriesFilterContainer
                requireMainSubcategory={false}
                title="Categorías"
                breadcrumbLabel="Categorías"
            />,
        )

        expect(screen.getByTestId("subcategories-filter")).toBeInTheDocument()
    })

    it("should render SubcategoriesFilter when params and subcategories exist", () => {
        mockSubcategories = [buildSub({ id: "1", name: "Sub 1" })]
        render(<SubcategoriesFilterContainer />)
        expect(screen.getByTestId("subcategories-filter")).toBeInTheDocument()
        expect(mockTrack).toHaveBeenCalledWith(EventName.VIEWED_FILTER, {
            filters: mockSubcategories,
        })
    })

    it("should pass subcategories to SubcategoriesFilter", () => {
        mockSubcategories = [
            buildSub({ id: "1", name: "Sub 1" }),
            buildSub({ id: "2", name: "Sub 2" }),
        ]
        render(<SubcategoriesFilterContainer />)
        expect(screen.getByTestId("subcategoriesCount")).toHaveTextContent("2")
    })

    it("should call router.push when selecting a leaf subcategory", () => {
        mockSubcategories = [buildSub({ id: "sub1", name: "Sub 1" })]
        render(<SubcategoriesFilterContainer />)
        fireEvent.click(screen.getByTestId("select-subcategory"))
        expect(mockPush).toHaveBeenCalled()
        expect(mockTrack).toHaveBeenCalledWith(EventName.CLICKED_FILTERS, {
            type: "category",
            filter: expect.objectContaining({ id: "sub1", name: "Sub 1" }),
        })
    })

    it("should set activeNestedSubcategory when selecting a subcategory with children", () => {
        mockSubcategories = [buildSub({ id: "parent", name: "Parent", subcategories: [buildSub({ id: "child" })] })]
        render(<SubcategoriesFilterContainer />)
        fireEvent.click(screen.getByTestId("select-nested"))
        expect(screen.getByTestId("subcategories-filter")).toBeInTheDocument()
    })

    it("should pass activeNestedSubcategory to SubcategoriesFilter", () => {
        mockSubcategories = [buildSub({ id: "parent", name: "Parent" })]
        render(<SubcategoriesFilterContainer />)
        fireEvent.click(screen.getByTestId("set-active"))
        expect(screen.getByTestId("activeNested")).toHaveTextContent("Parent")
    })
})

export {}
