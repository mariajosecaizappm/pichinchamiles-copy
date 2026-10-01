import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import OrderBySelect from "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/OrderBy/OrderBySelect"

const mockOnSelectionChange = vi.fn()

const defaultProps = {
    orderBy: null as string | null,
    onSelectionChange: mockOnSelectionChange,
    isPending: false,
}

vi.mock("@/presentation/components/Form/components/Select", () => ({
    Select: ({ selectedKeys, onSelectionChange, placeholder, children }: {
        selectedKeys: string[]
        onSelectionChange: (keys: Set<string>) => void
        placeholder: string
        children: React.ReactNode
    }) => (
        <div
            data-testid="select"
            data-selected={JSON.stringify(selectedKeys)}
            data-placeholder={placeholder}
        >
            <button data-testid="select-asc" onClick={() => onSelectionChange(new Set(["asc"]))}>asc</button>
            <button data-testid="select-desc" onClick={() => onSelectionChange(new Set(["desc"]))}>desc</button>
            <button data-testid="select-empty" onClick={() => onSelectionChange(new Set([]))}>empty</button>
            {children}
        </div>
    ),
}))

describe("OrderBySelect", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render the Select with 'Ordenar por' placeholder", () => {
        render(<OrderBySelect {...defaultProps} />)
        expect(screen.getByTestId("select")).toHaveAttribute("data-placeholder", "Ordenar por")
    })

    it("should pass orderBy as selectedKeys when present", () => {
        const props = { ...defaultProps, orderBy: "asc" }
        render(<OrderBySelect {...props} />)
        expect(screen.getByTestId("select")).toHaveAttribute("data-selected", JSON.stringify(["asc"]))
    })

    it("should pass empty array as selectedKeys when no orderBy", () => {
        render(<OrderBySelect {...defaultProps} />)
        expect(screen.getByTestId("select")).toHaveAttribute("data-selected", JSON.stringify([]))
    })

    it("should call onSelectionChange when selection changes", () => {
        render(<OrderBySelect {...defaultProps} />)
        fireEvent.click(screen.getByTestId("select-asc"))
        expect(mockOnSelectionChange).toHaveBeenCalled()
    })

    it("should call onSelectionChange when selection is cleared", () => {
        render(<OrderBySelect {...defaultProps} />)
        fireEvent.click(screen.getByTestId("select-empty"))
        expect(mockOnSelectionChange).toHaveBeenCalled()
    })
})
