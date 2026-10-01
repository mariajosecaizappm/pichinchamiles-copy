import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import OrderBySelectContainer from "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/OrderBy/OrderBySelectContainer"

const mockPush = vi.fn()
let mockSearchValues = { sort: "", brand: "", search: "", category: "" }
let mockSearchParams = new URLSearchParams()

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
    usePathname: () => "/productos",
    useSearchParams: () => mockSearchParams,
}))

vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => ({
        searchValues: mockSearchValues,
        searchParams: mockSearchParams,
        pathname: "/productos",
    }),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/OrderBy/OrderBySelect", () => ({
    default: (props: Record<string, unknown>) => (
        <div data-testid="order-by-select">
            <span data-testid="orderBy">{String(props.orderBy)}</span>
            <button data-testid="select-asc" onClick={() => (props.onSelectionChange as (k: Set<string>) => void)(new Set(["points-asc"]))}>
                Select Asc
            </button>
            <button data-testid="select-desc" onClick={() => (props.onSelectionChange as (k: Set<string>) => void)(new Set(["points-desc"]))}>
                Select Desc
            </button>
            <button data-testid="select-same" onClick={() => (props.onSelectionChange as (k: Set<string>) => void)(new Set(["points-asc"]))}>
                Select Same
            </button>
            <button data-testid="select-empty" onClick={() => (props.onSelectionChange as (k: Set<string>) => void)(new Set())}>
                Clear
            </button>
        </div>
    ),
}))

describe("OrderBySelectContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockSearchValues = { sort: "", brand: "", search: "", category: "" }
        mockSearchParams = new URLSearchParams()
    })

    it("should render OrderBySelect", () => {
        render(<OrderBySelectContainer />)
        expect(screen.getByTestId("order-by-select")).toBeInTheDocument()
    })

    it("should resolve orderBy from sort param", () => {
        mockSearchValues = { ...mockSearchValues, sort: "points-asc" }
        render(<OrderBySelectContainer />)
        expect(screen.getByTestId("orderBy")).toHaveTextContent("points-asc")
    })

    it("should resolve empty string when no order params", () => {
        render(<OrderBySelectContainer />)
        expect(screen.getByTestId("orderBy")).toHaveTextContent("")
    })

    it("should call router.push on selection change", () => {
        render(<OrderBySelectContainer />)
        fireEvent.click(screen.getByTestId("select-asc"))
        expect(mockPush).toHaveBeenCalled()
    })

    it("should call router.push on clear selection", () => {
        mockSearchValues = { ...mockSearchValues, sort: "points-asc" }
        render(<OrderBySelectContainer />)
        fireEvent.click(screen.getByTestId("select-empty"))
        expect(mockPush).toHaveBeenCalled()
    })
})

export {}
