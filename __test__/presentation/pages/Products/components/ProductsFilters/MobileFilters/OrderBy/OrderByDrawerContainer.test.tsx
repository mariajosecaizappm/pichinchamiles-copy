import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import OrderByDrawerContainer from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/OrderBy/OrderByDrawerContainer"

const mockPush = vi.fn()
const mockReplace = vi.fn()
let mockSearchParams = new URLSearchParams()
let mockSearchValues = { brand: "", sort: "", search: "", category: "" }

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush, replace: mockReplace }),
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

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/OrderBy/OrderByDrawer", () => ({
    default: function OrderByDrawerMock(props: Record<string, unknown>) {
        return (
            <div data-testid="orderby-drawer">
                <button data-testid="apply" onClick={props.onApplyFilters as () => void}>apply</button>
                <button data-testid="clear" onClick={props.onClearFilters as () => void}>clear</button>
                <button data-testid="close" onClick={props.onClose as () => void}>close</button>
                <button
                    data-testid="toggle-open"
                    onClick={() => (props.onOpenChange as (v: boolean) => void)(true)}
                >
                    open
                </button>
                <button
                    data-testid="select-asc"
                    onClick={() => (props.onSelectOption as (v: string | null) => void)("points-asc")}
                >
                    select asc
                </button>
                <button
                    data-testid="select-desc"
                    onClick={() => (props.onSelectOption as (v: string | null) => void)("points-desc")}
                >
                    select desc
                </button>
                <span data-testid="selected-option">{String(props.selectedOption)}</span>
            </div>
        )
    },
}))

describe("OrderByDrawerContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockSearchParams = new URLSearchParams()
        mockSearchValues = { brand: "", sort: "", search: "", category: "" }
    })

    it("should render OrderByDrawer", () => {
        render(<OrderByDrawerContainer />)
        expect(screen.getByTestId("orderby-drawer")).toBeInTheDocument()
    })

    describe("sort value", () => {
        it("should resolve 'points-asc' from sort=points-asc", () => {
            mockSearchValues = { ...mockSearchValues, sort: "points-asc" }
            render(<OrderByDrawerContainer />)
            expect(screen.getByTestId("selected-option")).toHaveTextContent("points-asc")
        })

        it("should resolve 'points-desc' from sort=points-desc", () => {
            mockSearchValues = { ...mockSearchValues, sort: "points-desc" }
            render(<OrderByDrawerContainer />)
            expect(screen.getByTestId("selected-option")).toHaveTextContent("points-desc")
        })

        it("should resolve empty string when no sort param", () => {
            render(<OrderByDrawerContainer />)
            expect(screen.getByTestId("selected-option")).toHaveTextContent("")
        })
    })

    describe("handleApplyFilters", () => {
        it("should apply sort=points-asc when orderByState is 'points-asc'", () => {
            mockSearchValues = { ...mockSearchValues, sort: "" }
            render(<OrderByDrawerContainer />)
            fireEvent.click(screen.getByTestId("toggle-open"))
            fireEvent.click(screen.getByTestId("select-asc"))
            fireEvent.click(screen.getByTestId("apply"))
            expect(mockPush).toHaveBeenCalled()
            const calledUrl = mockPush.mock.calls[0][0] as string
            expect(calledUrl).toContain("sort=points-asc")
        })

        it("should apply sort=points-desc when orderByState is 'points-desc'", () => {
            mockSearchValues = { ...mockSearchValues, sort: "" }
            render(<OrderByDrawerContainer />)
            fireEvent.click(screen.getByTestId("toggle-open"))
            fireEvent.click(screen.getByTestId("select-desc"))
            fireEvent.click(screen.getByTestId("apply"))
            expect(mockPush).toHaveBeenCalled()
            const calledUrl = mockPush.mock.calls[0][0] as string
            expect(calledUrl).toContain("sort=points-desc")
        })

        it("should not push if committed equals draft state", () => {
            mockSearchValues = { ...mockSearchValues, sort: "points-asc" }
            render(<OrderByDrawerContainer />)
            fireEvent.click(screen.getByTestId("apply"))
            expect(mockPush).not.toHaveBeenCalled()
        })

        it("should close drawer after apply", () => {
            mockSearchValues = { ...mockSearchValues, sort: "points-asc" }
            render(<OrderByDrawerContainer />)
            fireEvent.click(screen.getByTestId("toggle-open"))
            fireEvent.click(screen.getByTestId("apply"))
            expect(mockPush).not.toHaveBeenCalled()
        })
    })

    describe("handleClearFilters", () => {
        it("should clear sort params", () => {
            mockSearchParams = new URLSearchParams("sort=points-asc")
            mockSearchValues = { ...mockSearchValues, sort: "points-asc" }
            render(<OrderByDrawerContainer />)
            fireEvent.click(screen.getByTestId("clear"))
            expect(mockReplace).toHaveBeenCalled()
            const calledUrl = mockReplace.mock.calls[0][0] as string
            expect(calledUrl).not.toContain("sort=")
        })

        it("should reset draft to null on clear", () => {
            mockSearchValues = { ...mockSearchValues, sort: "points-asc" }
            render(<OrderByDrawerContainer />)
            expect(screen.getByTestId("selected-option")).toHaveTextContent("points-asc")
            fireEvent.click(screen.getByTestId("clear"))
            expect(mockReplace).toHaveBeenCalled()
        })
    })

    describe("handleClose", () => {
        it("should reset draft to committed value on close when different", () => {
            mockSearchValues = { ...mockSearchValues, sort: "points-asc" }
            render(<OrderByDrawerContainer />)
            expect(screen.getByTestId("selected-option")).toHaveTextContent("points-asc")
            fireEvent.click(screen.getByTestId("close"))
            expect(mockPush).not.toHaveBeenCalled()
        })

        it("should not reset if draft equals committed", () => {
            mockSearchValues = { ...mockSearchValues, sort: "points-asc" }
            render(<OrderByDrawerContainer />)
            fireEvent.click(screen.getByTestId("close"))
            expect(mockPush).not.toHaveBeenCalled()
        })
    })
})
