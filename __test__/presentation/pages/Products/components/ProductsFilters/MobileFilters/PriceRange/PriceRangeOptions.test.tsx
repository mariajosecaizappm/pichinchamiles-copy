import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import PriceRangeOptions from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/PriceRange/PriceRangeOptions"
import { PRICE_RANGE_OPTIONS } from "@/presentation/pages/Products/components/ProductsFilters/ProductsFiltersConfig"

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterOptions", () => ({
    default: ({ title, options, selectedOption, onSelectionChange }: {
        title: string
        options: { value: string; label: string }[]
        selectedOption: string | null
        onSelectionChange: (v: string | null) => void
    }) => (
        <div
            data-testid="filter-options"
            data-title={title}
            data-selected={String(selectedOption)}
            data-options-count={options.length}
            onClick={() => onSelectionChange("600-2000")}
        />
    ),
}))

describe("PriceRangeOptions", () => {
    it("should render with the 'Rango de precios' title", () => {
        render(<PriceRangeOptions selectedOption={null} onSelectionChange={vi.fn()} />)
        expect(screen.getByTestId("filter-options")).toHaveAttribute("data-title", "Rango de precios")
    })

    it("should pass PRICE_RANGE_OPTIONS as options", () => {
        render(<PriceRangeOptions selectedOption={null} onSelectionChange={vi.fn()} />)
        expect(screen.getByTestId("filter-options")).toHaveAttribute(
            "data-options-count",
            String(PRICE_RANGE_OPTIONS.length)
        )
    })

    it("should forward selectedOption as selected option", () => {
        render(<PriceRangeOptions selectedOption={"600-2000"} onSelectionChange={vi.fn()} />)
        expect(screen.getByTestId("filter-options")).toHaveAttribute("data-selected", "600-2000")
    })

    it("should forward onSelectionChange callback", () => {
        const onSelectionChange = vi.fn()
        render(<PriceRangeOptions selectedOption={null} onSelectionChange={onSelectionChange} />)
        screen.getByTestId("filter-options").click()
        expect(onSelectionChange).toHaveBeenCalledWith("600-2000")
    })
})
