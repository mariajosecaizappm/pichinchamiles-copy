import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import OrderByOptions from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/OrderBy/OrderByOptions"
import { ORDER_BY_OPTIONS } from "@/presentation/pages/Products/components/ProductsFilters/ProductsFiltersConfig"

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
            onClick={() => onSelectionChange("desc")}
        />
    ),
}))

describe("OrderByOptions", () => {
    it("should render with the 'Ordenar por' title", () => {
        render(<OrderByOptions selectedOption={null} onSelectOption={vi.fn()} />)
        expect(screen.getByTestId("filter-options")).toHaveAttribute("data-title", "Ordenar por")
    })

    it("should pass ORDER_BY_OPTIONS as options", () => {
        render(<OrderByOptions selectedOption={null} onSelectOption={vi.fn()} />)
        expect(screen.getByTestId("filter-options")).toHaveAttribute(
            "data-options-count",
            String(ORDER_BY_OPTIONS.length)
        )
    })

    it("should forward selectedOption", () => {
        render(<OrderByOptions selectedOption={"asc"} onSelectOption={vi.fn()} />)
        expect(screen.getByTestId("filter-options")).toHaveAttribute("data-selected", "asc")
    })

    it("should forward onSelectOption callback", () => {
        const onSelectOption = vi.fn()
        render(<OrderByOptions selectedOption={null} onSelectOption={onSelectOption} />)
        screen.getByTestId("filter-options").click()
        expect(onSelectOption).toHaveBeenCalledWith("desc")
    })
})
