import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import AllFiltersDrawerContainer from "@/presentation/pages/Products/components/ProductsFilters/AllFiltersDrawer/AllFiltersDrawerContainer"

beforeEach(() => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    }))
})

const mockApplyMany = vi.fn()
const mockOnOpen = vi.fn()
const mockOnOpenChange = vi.fn()
const mockSearchValues: { sort: string; recommended: boolean; brand: string; search: string; category: string } = {
    sort: "",
    recommended: false,
    brand: "",
    search: "",
    category: "",
}
let mockSearchParams = new URLSearchParams()
let mockProductBrands: string[] = []
let mockBrands: Array<{ id: string; name: string; slug: string }> = []
let mockIsLoadingBrands = false
let mockSubcategories: Array<{ id: string; name: string; slug: string; parent: null; subcategories?: unknown[] }> = []
let mockSelectedSubcategoriesFromUrl: Array<{ id: string }> = []

vi.mock("@heroui/react", async () => {
    const actual = await vi.importActual<Record<string, unknown>>("@heroui/react")
    return {
        ...actual,
        useDisclosure: () => ({ isOpen: false, onOpen: mockOnOpen, onOpenChange: mockOnOpenChange }),
    }
})

vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => ({
        searchValues: mockSearchValues,
        searchParams: mockSearchParams,
    }),
}))

vi.mock("@/presentation/pages/Products/context/useProductsContext", () => ({
    useProductsContext: () => ({ productBrands: mockProductBrands }),
}))

vi.mock("@/presentation/pages/Products/hooks/useProductBrands", () => ({
    default: () => ({ brands: mockBrands, isLoading: mockIsLoadingBrands }),
}))

vi.mock("@/presentation/pages/Products/hooks/useProductSubcategories", () => ({
    default: () => ({
        subcategories: mockSubcategories,
        selectedSubcategoriesFromUrl: mockSelectedSubcategoriesFromUrl,
    }),
}))

vi.mock("@/presentation/pages/Products/hooks/useFilterNavigation", () => ({
    default: () => ({ applyMany: mockApplyMany }),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/OrderBy/OrderByOptions", () => ({
    default: ({ selectedOption, onSelectOption }: { selectedOption: string | null; onSelectOption: (v: string | null) => void }) => (
        <button data-testid="order-by-options" onClick={() => onSelectOption("points-asc")}>{`order-${selectedOption}`}</button>
    ),
}))
vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/PriceRange/PriceRangeOptions", () => ({
    default: ({ selectedOption, onSelectionChange }: { selectedOption: string | null; onSelectionChange: (v: string | null) => void }) => (
        <button data-testid="price-range-options" onClick={() => onSelectionChange("600-2000")}>{`points-${selectedOption}`}</button>
    ),
}))
vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/BrandsOptions", () => ({
    default: ({ selectedBrand, onSelectBrand }: { selectedBrand: string | null; onSelectBrand: (v: string | null) => void }) => (
        <button data-testid="brands-options" onClick={() => onSelectBrand("b1")}>{`brands-${selectedBrand}`}</button>
    ),
}))
vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Subcategories/SubcategoriesFiltersSection", () => ({
    default: ({ onSelectSubcategory }: { onSelectSubcategory: (s: unknown) => void }) => (
        <button
            data-testid="select-subcategory"
            onClick={() => onSelectSubcategory({ id: "sub-1", name: "Sub 1", slug: "sub-1", parent: null })}
        >
            select-subcategory
        </button>
    ),
}))

// AllFiltersDrawerContainer now renders children (OrderByOptions, PriceRangeOptions,
// SubcategoriesFiltersSection, BrandsOptions) directly into AllFiltersDrawer, which
// itself is just a pass-through — mock it to expose isOpen/callbacks + children.
vi.mock("@/presentation/pages/Products/components/ProductsFilters/AllFiltersDrawer/AllFiltersDrawer", () => ({
    default: (props: Record<string, unknown>) => (
        <div data-testid="all-filters-drawer">
            <button data-testid="apply" onClick={props.onApplyFilters as () => void}>apply</button>
            <button data-testid="clear" onClick={props.onClearFilters as () => void}>clear</button>
            <button data-testid="close" onClick={props.handleClose as () => void}>close</button>
            {props.children as React.ReactNode}
        </div>
    ),
}))

describe("AllFiltersDrawerContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockSearchParams = new URLSearchParams()
        mockSearchValues.sort = ""
        mockSearchValues.recommended = false
        mockSearchValues.brand = ""
        mockSearchValues.category = ""
        mockProductBrands = []
        mockBrands = []
        mockIsLoadingBrands = false
        mockSubcategories = []
        mockSelectedSubcategoriesFromUrl = []
    })

    it("should render AllFiltersDrawer", () => {
        render(<AllFiltersDrawerContainer />)
        expect(screen.getByTestId("all-filters-drawer")).toBeInTheDocument()
    })

    it("should read productBrands from useProductsContext and pass to useProductBrands", () => {
        mockProductBrands = ["b1", "b2"]
        mockBrands = [{ id: "b1", name: "Brand 1", slug: "brand-1" }]
        render(<AllFiltersDrawerContainer />)
        expect(screen.getByTestId("brands-options")).toBeInTheDocument()
    })

    it("should call applyMany when apply is clicked", () => {
        render(<AllFiltersDrawerContainer />)
        fireEvent.click(screen.getByTestId("apply"))
        expect(mockApplyMany).toHaveBeenCalledTimes(1)
    })

    it("should call onOpenChange after apply", () => {
        render(<AllFiltersDrawerContainer />)
        fireEvent.click(screen.getByTestId("apply"))
        expect(mockOnOpenChange).toHaveBeenCalledTimes(1)
    })

    it("should call applyMany with CLEAR_ALL_FILTERS_PARAMS on clear", () => {
        render(<AllFiltersDrawerContainer />)
        fireEvent.click(screen.getByTestId("clear"))
        expect(mockApplyMany).toHaveBeenCalledTimes(1)
    })

    it("should call onOpenChange after clear", () => {
        render(<AllFiltersDrawerContainer />)
        fireEvent.click(screen.getByTestId("clear"))
        expect(mockOnOpenChange).toHaveBeenCalledTimes(1)
    })

    it("should not call applyMany on close", () => {
        render(<AllFiltersDrawerContainer />)
        fireEvent.click(screen.getByTestId("close"))
        expect(mockApplyMany).not.toHaveBeenCalled()
    })

    it("should not render BrandsOptions when brands is empty", () => {
        mockBrands = []
        render(<AllFiltersDrawerContainer />)
        expect(screen.queryByTestId("brands-options")).not.toBeInTheDocument()
    })

    it("should render BrandsOptions when brands is non-empty", () => {
        mockBrands = [{ id: "b1", name: "Brand 1", slug: "brand-1" }]
        render(<AllFiltersDrawerContainer />)
        expect(screen.getByTestId("brands-options")).toBeInTheDocument()
    })

    it("should render SubcategoriesFiltersSection only when subcategories exist", () => {
        mockSubcategories = [{ id: "s1", name: "Sub 1", slug: "sub-1", parent: null, subcategories: [] }]
        render(<AllFiltersDrawerContainer />)
        expect(screen.getByTestId("select-subcategory")).toBeInTheDocument()
    })

    it("should not render SubcategoriesFiltersSection when there are no subcategories", () => {
        mockSubcategories = []
        render(<AllFiltersDrawerContainer />)
        expect(screen.queryByTestId("select-subcategory")).not.toBeInTheDocument()
    })

    it("should forward committed sort from searchValues as initial draft state", () => {
        mockSearchValues.sort = "points-asc"
        render(<AllFiltersDrawerContainer />)
        expect(screen.getByTestId("order-by-options")).toHaveTextContent("order-points-asc")
    })

    it("should forward committed brand from searchValues as initial draft state to BrandsOptions", () => {
        mockSearchValues.brand = "b1"
        mockBrands = [{ id: "b1", name: "Brand 1", slug: "brand-1" }]
        render(<AllFiltersDrawerContainer />)
        expect(screen.getByTestId("brands-options")).toHaveTextContent("brands-b1")
    })

    it("should forward committed points from searchParams as initial draft state", () => {
        mockSearchParams = new URLSearchParams("points=600-2000")
        render(<AllFiltersDrawerContainer />)
        expect(screen.getByTestId("price-range-options")).toHaveTextContent("points-600-2000")
    })

    it("includes selected brand points and order in apply patch", () => {
        mockBrands = [{ id: "b1", name: "Brand 1", slug: "brand-1" }]
        render(<AllFiltersDrawerContainer />)
        fireEvent.click(screen.getByTestId("order-by-options"))
        fireEvent.click(screen.getByTestId("price-range-options"))
        fireEvent.click(screen.getByTestId("brands-options"))
        fireEvent.click(screen.getByTestId("apply"))
        expect(mockApplyMany).toHaveBeenCalledWith(
            expect.objectContaining({
                sort: expect.anything(),
                points: "600-2000",
                brand: "b1",
            })
        )
    })

    it("should add a flat subcategory when selected", () => {
        mockSubcategories = [{ id: "s1", name: "Sub 1", slug: "sub-1", parent: null, subcategories: [] }]
        render(<AllFiltersDrawerContainer />)
        fireEvent.click(screen.getByTestId("select-subcategory"))
        fireEvent.click(screen.getByTestId("apply"))
        expect(mockApplyMany).toHaveBeenCalledWith(
            expect.objectContaining({}),
        )
    })

    it("should reset draft state to committed values on close", () => {
        mockSearchValues.sort = "points-asc"
        render(<AllFiltersDrawerContainer />)
        fireEvent.click(screen.getByTestId("order-by-options"))
        expect(screen.getByTestId("order-by-options")).toHaveTextContent("order-points-asc")
        fireEvent.click(screen.getByTestId("close"))
        expect(screen.getByTestId("order-by-options")).toHaveTextContent("order-points-asc")
    })
})