import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import PriceRangeFilter from "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/PriceRange/PriceRangeFilter"

const mockOnValueChange = vi.fn()
const mockOnPressOption = vi.fn()

const defaultProps = {
    points: "",
    onValueChange: mockOnValueChange,
    isPending: false,
    onPressOption: mockOnPressOption,
}

vi.mock("@/presentation/pages/Products/components/ProductsFilters/FilterAccordion", () => ({
    default: ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div data-testid="accordion" data-title={title}>{children}</div>
    ),
}))

vi.mock("@/presentation/components/Form/components/Radio", () => ({
    Radio: ({ value, children }: { value: string; children: React.ReactNode }) => (
        <label data-testid={`radio-${value}`}>{children}</label>
    ),
}))

vi.mock("@heroui/react", async () => {
    const actual = await vi.importActual<Record<string, unknown>>("@heroui/react")
    return {
        ...actual,
        RadioGroup: ({ value, onValueChange, children }: { value: string | null; onValueChange: (v: string) => void; children: React.ReactNode }) => (
            <div data-testid="radio-group" data-value={String(value)}>
                <button data-testid="change-600" onClick={() => onValueChange("600-2000")}>600</button>
                {children}
            </div>
        ),
    }
})

describe("PriceRangeFilter", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render the price range accordion", () => {
        render(<PriceRangeFilter {...defaultProps} />)
        expect(screen.getByTestId("accordion")).toHaveAttribute("data-title", "Rango de precios")
    })

    it("should render a Radio for every PRICE_RANGE option", () => {
        render(<PriceRangeFilter {...defaultProps} />)
        expect(screen.getByTestId("radio-600-2000")).toBeInTheDocument()
        expect(screen.getByTestId("radio-2001-5000")).toBeInTheDocument()
        expect(screen.getByTestId("radio-5001-10000")).toBeInTheDocument()
        expect(screen.getByTestId("radio-10001")).toBeInTheDocument()
    })

    it("should reflect current points selection in the RadioGroup", () => {
        const props = { ...defaultProps, points: "600-2000" }
        render(<PriceRangeFilter {...props} />)
        expect(screen.getByTestId("radio-group")).toHaveAttribute("data-value", "600-2000")
    })

    it("should call onValueChange when selecting a different value", () => {
        render(<PriceRangeFilter {...defaultProps} />)
        fireEvent.click(screen.getByTestId("change-600"))
        expect(mockOnValueChange).toHaveBeenCalledWith("600-2000")
    })

    it("should call onPressOption on pointer down", () => {
        render(<PriceRangeFilter {...defaultProps} />)
        const radio = screen.getByTestId("radio-600-2000")
        fireEvent.pointerDown(radio)
        expect(mockOnPressOption).toHaveBeenCalled()
    })
})
