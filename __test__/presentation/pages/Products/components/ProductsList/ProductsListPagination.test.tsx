import ProductsListPagination from "@/presentation/pages/Products/components/ProductsList/ProductsListPagination"
import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mockOnChangePage = vi.fn()

const mockPagination = vi.hoisted(() => vi.fn())

vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => ({
        searchValues: {
            search: "",
            category: "",
            brand: "",
            sort: "",
            recommended: undefined,
        },
        searchParams: new URLSearchParams(),
        onChangeFilter: vi.fn(),
        clearSearch: vi.fn(),
        onChangePage: mockOnChangePage,
    }),
}))

vi.mock("@/presentation/components/Pagination", () => ({
    default: (props: { total: number; page: number; onChange: (page: number) => void }) => {
        const result = mockPagination(props)
        if (result !== undefined) {
            return result
        }
        return (
            <button type="button" data-testid="pagination" onClick={() => props.onChange(3)}>
                Pagination {props.page}/{props.total}
            </button>
        )
    },
}))

describe("ProductsListPagination", () => {
    beforeEach(() => {
        mockOnChangePage.mockClear()
        mockPagination.mockClear()
    })

    it("should render nothing when there is one page or less", () => {
        const { container } = render(<ProductsListPagination page={1} totalPages={1} />)

        expect(container.firstChild).toBeNull()
    })

    it("should pass current page and total pages to pagination", () => {
        render(<ProductsListPagination page={2} totalPages={5} />)

        expect(screen.getByTestId("pagination")).toHaveTextContent("Pagination 2/5")
        expect(mockPagination).toHaveBeenCalledWith(expect.objectContaining({ page: 2, total: 5 }))
    })

    it("should delegate page changes to onChangePage from useProductSearch", () => {
        render(<ProductsListPagination page={2} totalPages={5} />)

        screen.getByTestId("pagination").click()

        expect(mockOnChangePage).toHaveBeenCalledWith(3)
    })

    it("should call onChangePage when navigating to first page", () => {
        mockPagination.mockImplementationOnce((props: { onChange: (page: number) => void }) => {
            props.onChange(1)
            return null
        })

        render(<ProductsListPagination page={2} totalPages={5} />)

        expect(mockOnChangePage).toHaveBeenCalledWith(1)
    })
})
