import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import PriceRangeDrawerContainer from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/PriceRange/PriceRangeDrawerContainer"

const mockPush = vi.fn()
const mockReplace = vi.fn()
let mockSearchParams = new URLSearchParams()
let mockSearchValues = { brand: "", sort: "", recommended: false, search: "", category: "" }

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush, replace: mockReplace }),
    usePathname: () => "/productos",
    useSearchParams: () => mockSearchParams,
}))

vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => ({
        searchValues: mockSearchValues,
        searchParams: mockSearchParams,
        onChangeFilter: vi.fn(),
        clearSearch: vi.fn(),
        pathname: "/productos",
    }),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/PriceRange/PriceRangeDrawer", () => ({
    default: (props: Record<string, unknown>) => (
        <div data-testid="price-drawer">
            <button data-testid="apply" onClick={props.onApplyFilters as () => void}>apply</button>
            <button data-testid="clear" onClick={props.onClearFilters as () => void}>clear</button>
            <button data-testid="close" onClick={props.onClose as () => void}>close</button>
            <button 
                data-testid="toggle-open" 
                onClick={() => (props.onOpenChange as (v: boolean) => void)(true)}
            >
                open
            </button>
            <span data-testid="selected-option">{String(props.selectedOption)}</span>
        </div>
    ),
}))

describe("PriceRangeDrawerContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockSearchParams = new URLSearchParams()
        mockSearchValues = { brand: "", sort: "", recommended: false, search: "", category: "" }
    })

    it("should render PriceRangeDrawer", () => {
        render(<PriceRangeDrawerContainer />)
        expect(screen.getByTestId("price-drawer")).toBeInTheDocument()
    })

    describe("initial state from URL", () => {
        it("should read points from URL params", () => {
            mockSearchParams = new URLSearchParams("points=600-2000")
            render(<PriceRangeDrawerContainer />)
            expect(screen.getByTestId("selected-option")).toHaveTextContent("600-2000")
        })

        it("should handle null when no points param", () => {
            render(<PriceRangeDrawerContainer />)
            expect(screen.getByTestId("selected-option")).toHaveTextContent("null")
        })

        it("should handle different point ranges", () => {
            mockSearchParams = new URLSearchParams("points=2001-5000")
            render(<PriceRangeDrawerContainer />)
            expect(screen.getByTestId("selected-option")).toHaveTextContent("2001-5000")
        })
    })

    describe("handleApplyFilters", () => {
        it("should apply points filter when selected", () => {
            mockSearchParams = new URLSearchParams("points=600-2000")
            render(<PriceRangeDrawerContainer />)
            fireEvent.click(screen.getByTestId("toggle-open"))
            fireEvent.click(screen.getByTestId("apply"))
            expect(mockPush).toHaveBeenCalled()
            const calledUrl = mockPush.mock.calls[0][0] as string
            expect(calledUrl).toContain("points=600-2000")
        })

        it("should apply different point ranges", () => {
            mockSearchParams = new URLSearchParams("points=10001")
            render(<PriceRangeDrawerContainer />)
            fireEvent.click(screen.getByTestId("toggle-open"))
            fireEvent.click(screen.getByTestId("apply"))
            expect(mockPush).toHaveBeenCalled()
            const calledUrl = mockPush.mock.calls[0][0] as string
            expect(calledUrl).toContain("points=10001")
        })

        it("should close drawer after apply", () => {
            mockSearchParams = new URLSearchParams("points=600-2000")
            render(<PriceRangeDrawerContainer />)
            fireEvent.click(screen.getByTestId("toggle-open"))
            fireEvent.click(screen.getByTestId("apply"))
            expect(mockPush).toHaveBeenCalled()
        })

        it("should merge points with existing params", () => {
            mockSearchParams = new URLSearchParams("brand=b1&points=600-2000")
            render(<PriceRangeDrawerContainer />)
            fireEvent.click(screen.getByTestId("toggle-open"))
            fireEvent.click(screen.getByTestId("apply"))
            const calledUrl = mockPush.mock.calls[0][0] as string
            expect(calledUrl).toContain("brand=b1")
            expect(calledUrl).toContain("points=600-2000")
        })
    })

    describe("handleClearFilters", () => {
        it("should clear points filter from URL", () => {
            mockSearchParams = new URLSearchParams("points=600-2000")
            render(<PriceRangeDrawerContainer />)
            fireEvent.click(screen.getByTestId("clear"))
            expect(mockReplace).toHaveBeenCalled()
            const calledUrl = mockReplace.mock.calls[0][0] as string
            expect(calledUrl).not.toContain("points=")
        })

        it("should reset points state to null", () => {
            mockSearchParams = new URLSearchParams("points=600-2000")
            render(<PriceRangeDrawerContainer />)
            expect(screen.getByTestId("selected-option")).toHaveTextContent("600-2000")
            fireEvent.click(screen.getByTestId("clear"))
            expect(mockReplace).toHaveBeenCalled()
        })

        it("should preserve other params when clearing points", () => {
            mockSearchParams = new URLSearchParams("brand=b1&points=600-2000&sort=ASC")
            render(<PriceRangeDrawerContainer />)
            fireEvent.click(screen.getByTestId("clear"))
            const calledUrl = mockReplace.mock.calls[0][0] as string
            expect(calledUrl).toContain("brand=b1")
            expect(calledUrl).toContain("sort=ASC")
            expect(calledUrl).not.toContain("points=")
        })
    })

    describe("handleClose", () => {
        it("should reset draft to committed value on close", () => {
            mockSearchParams = new URLSearchParams("points=600-2000")
            render(<PriceRangeDrawerContainer />)
            expect(screen.getByTestId("selected-option")).toHaveTextContent("600-2000")
            fireEvent.click(screen.getByTestId("close"))
            expect(mockPush).not.toHaveBeenCalled()
        })

        it("should close drawer on handleClose", () => {
            mockSearchParams = new URLSearchParams("points=600-2000")
            render(<PriceRangeDrawerContainer />)
            fireEvent.click(screen.getByTestId("toggle-open"))
            fireEvent.click(screen.getByTestId("close"))
            expect(mockPush).not.toHaveBeenCalled()
        })
    })

    describe("draft state management", () => {
        it("should initialize draft from URL on mount", () => {
            mockSearchParams = new URLSearchParams("points=5001-10000")
            render(<PriceRangeDrawerContainer />)
            expect(screen.getByTestId("selected-option")).toHaveTextContent("5001-10000")
        })
    })
})
