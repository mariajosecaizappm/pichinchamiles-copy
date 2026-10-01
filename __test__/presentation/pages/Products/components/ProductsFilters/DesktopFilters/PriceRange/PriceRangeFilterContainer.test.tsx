import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import PriceRangeFilterContainer from "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/PriceRange/PriceRangeFilterContainer"

const mockOnChangeFilter = vi.fn()
let mockSearchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => "/productos",
    useSearchParams: () => mockSearchParams,
}))

vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => ({
        searchValues: { brand: "", sort: "", recommended: false, search: "", category: "" },
        searchParams: mockSearchParams,
        onChangeFilter: mockOnChangeFilter,
        clearSearch: vi.fn(),
        pathname: "/productos",
    }),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/PriceRange/PriceRangeFilter", () => ({
    default: (props: Record<string, unknown>) => (
        <div data-testid="price-range-filter">
            <span data-testid="points">{String(props.points)}</span>
            <button data-testid="change-value" onClick={() => (props.onValueChange as (v: string) => void)("600-2000")}>
                Change Value
            </button>
            <div
                data-testid="press-option"
                onPointerDownCapture={() => {
                    const mockEvent = {
                        preventDefault: vi.fn(),
                        stopPropagation: vi.fn(),
                    }
                    ;(props.onPressOption as (e: unknown, v: string) => void)(mockEvent, "600-2000")
                }}
            >
                Press Option
            </div>
        </div>
    ),
}))

describe("PriceRangeFilterContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockSearchParams = new URLSearchParams()
    })

    it("should render PriceRangeFilter", () => {
        render(<PriceRangeFilterContainer />)
        expect(screen.getByTestId("price-range-filter")).toBeInTheDocument()
    })

    it("should pass empty points when no search param", () => {
        render(<PriceRangeFilterContainer />)
        expect(screen.getByTestId("points")).toHaveTextContent("")
    })

    it("should pass points value from search params", () => {
        mockSearchParams = new URLSearchParams("points=600-2000")
        render(<PriceRangeFilterContainer />)
        expect(screen.getByTestId("points")).toHaveTextContent("600-2000")
    })

    it("should call onChangeFilter when value changes", () => {
        render(<PriceRangeFilterContainer />)
        fireEvent.click(screen.getByTestId("change-value"))
        expect(mockOnChangeFilter).toHaveBeenCalledWith("points", "600-2000")
    })

    it("should NOT call onChangeFilter when selecting same value", () => {
        mockSearchParams = new URLSearchParams("points=600-2000")
        render(<PriceRangeFilterContainer />)
        fireEvent.click(screen.getByTestId("change-value"))
        expect(mockOnChangeFilter).not.toHaveBeenCalled()
    })

    it("should clear points on pointer down when same value selected", () => {
        mockSearchParams = new URLSearchParams("points=600-2000")
        render(<PriceRangeFilterContainer />)
        fireEvent.pointerDown(screen.getByTestId("press-option"))
        expect(mockOnChangeFilter).toHaveBeenCalledWith("points", "")
    })

    it("should NOT clear points on pointer down when different value", () => {
        mockSearchParams = new URLSearchParams("points=2001-5000")
        render(<PriceRangeFilterContainer />)
        fireEvent.pointerDown(screen.getByTestId("press-option"))
        expect(mockOnChangeFilter).not.toHaveBeenCalled()
    })
})

export {}
