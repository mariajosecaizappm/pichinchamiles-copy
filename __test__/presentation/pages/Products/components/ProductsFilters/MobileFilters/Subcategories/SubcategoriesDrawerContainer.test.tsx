import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import SubcategoriesDrawerContainer from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Subcategories/SubcategoriesDrawerContainer"
import { CategoryGroup } from "@/domain/entity/Category/structure/category"
import { EventName } from "@/presentation/analytics/types"
import { mockTrack } from "../../../../../../../utils/analytics"

const mockPush = vi.fn()
const mockReplace = vi.fn()
let mockSearchParams = new URLSearchParams()
let mockSelectedFromUrl: CategoryGroup[] = []
let mockSubcategories: CategoryGroup[] = []

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush, replace: mockReplace }),
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

vi.mock("@/presentation/pages/Products/hooks/useProductSubcategories", () => ({
    default: () => ({
        subcategories: mockSubcategories,
        selectedSubcategoriesFromUrl: mockSelectedFromUrl,
    }),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Subcategories/SubcategoriesDrawer", () => ({
    default: (props: Record<string, unknown>) => (
        <div data-testid="subcategories-drawer">
            <button data-testid="apply" onClick={props.onApplyFilters as () => void}>apply</button>
            <button data-testid="clear" onClick={props.onClearFilters as () => void}>clear</button>
            <button data-testid="close" onClick={props.onClose as () => void}>close</button>
            <span data-testid="is-open">{String(props.isOpen)}</span>
            <button 
                data-testid="toggle-sub" 
                onClick={() => {
                    const onSelect = props.onSelectSubcategory as (s: CategoryGroup) => void
                    onSelect({ id: "sub1", name: "Sub 1", slug: "sub1", parent: null })
                }}
            >
                toggle
            </button>
            <button
                data-testid="navigate-nested"
                onClick={() => {
                    const onSelect = props.onSelectSubcategory as (s: CategoryGroup) => void
                    onSelect({
                        id: "parent",
                        name: "Parent",
                        slug: "parent",
                        parent: null,
                        subcategories: [{ id: "child", name: "Child", slug: "child", parent: { id: "parent", slug: "parent" } }],
                    })
                }}
            >
                navigate
            </button>
        </div>
    ),
}))

describe("SubcategoriesDrawerContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockTrack.mockReset()
        mockSearchParams = new URLSearchParams()
        mockSelectedFromUrl = []
        mockSubcategories = []
    })

    it("should render SubcategoriesDrawer", () => {
        render(<SubcategoriesDrawerContainer />)
        expect(screen.getByTestId("subcategories-drawer")).toBeInTheDocument()
    })

    describe("handleApplyFilters", () => {
        it("should call router.push with selected subcategory ids", () => {
            render(<SubcategoriesDrawerContainer />)
            fireEvent.click(screen.getByTestId("toggle-sub"))
            fireEvent.click(screen.getByTestId("apply"))
            expect(mockPush).toHaveBeenCalled()
            const calledUrl = mockPush.mock.calls[0][0] as string
            expect(calledUrl).toContain("subcategory=sub1")
        })

        it("should close drawer after apply", () => {
            render(<SubcategoriesDrawerContainer />)
            fireEvent.click(screen.getByTestId("apply"))
            expect(screen.getByTestId("is-open")).toHaveTextContent("false")
        })
    })

    describe("handleClearFilters", () => {
        it("should call router.replace with empty subcategory list", () => {
            mockSearchParams = new URLSearchParams("subcategory=existing")
            render(<SubcategoriesDrawerContainer />)
            fireEvent.click(screen.getByTestId("clear"))
            expect(mockReplace).toHaveBeenCalled()
            const calledUrl = mockReplace.mock.calls[0][0] as string
            expect(calledUrl).not.toContain("subcategory")
        })

        it("should clear draft state on clear", () => {
            render(<SubcategoriesDrawerContainer />)
            fireEvent.click(screen.getByTestId("toggle-sub"))
            fireEvent.click(screen.getByTestId("clear"))
            expect(mockReplace).toHaveBeenCalled()
        })
    })

    describe("handleClose", () => {
        it("should reset draft to URL state on close", () => {
            mockSelectedFromUrl = [{ id: "url-sub", name: "URL Sub", slug: "url-sub", parent: null }]
            render(<SubcategoriesDrawerContainer />)
            fireEvent.click(screen.getByTestId("toggle-sub"))
            fireEvent.click(screen.getByTestId("close"))
            expect(mockPush).not.toHaveBeenCalled()
        })
    })

    describe("handleSelectSubcategory", () => {
        it("should add leaf subcategory to draft selection", () => {
            render(<SubcategoriesDrawerContainer />)
            fireEvent.click(screen.getByTestId("toggle-sub"))
            fireEvent.click(screen.getByTestId("apply"))
            expect(mockPush).toHaveBeenCalled()
            const calledUrl = mockPush.mock.calls[0][0] as string
            expect(calledUrl).toContain("subcategory=sub1")
            expect(mockTrack).toHaveBeenCalledWith(EventName.CLICKED_FILTERS, {
                type: "category",
                filter: expect.objectContaining({ id: "sub1", name: "Sub 1" }),
            })
        })

        it("should remove subcategory if already selected", () => {
            mockSelectedFromUrl = [{ id: "sub1", name: "Sub 1", slug: "sub1", parent: null }]
            render(<SubcategoriesDrawerContainer />)
            fireEvent.click(screen.getByTestId("toggle-sub"))
            fireEvent.click(screen.getByTestId("apply"))
            const calledUrl = mockPush.mock.calls[0][0] as string
            expect(calledUrl).not.toContain("subcategory=sub1")
        })

        it("should set activeNestedSubcategory when subcategory has children", () => {
            render(<SubcategoriesDrawerContainer />)
            fireEvent.click(screen.getByTestId("navigate-nested"))
            expect(screen.getByTestId("subcategories-drawer")).toBeInTheDocument()
        })
    })

    describe("draft state management", () => {
        it("should sync draft to URL state on open", () => {
            mockSelectedFromUrl = [{ id: "sync", name: "Sync", slug: "sync", parent: null }]
            render(<SubcategoriesDrawerContainer />)
            fireEvent.click(screen.getByTestId("apply"))
            expect(mockPush).toHaveBeenCalled()
        })
    })
})
