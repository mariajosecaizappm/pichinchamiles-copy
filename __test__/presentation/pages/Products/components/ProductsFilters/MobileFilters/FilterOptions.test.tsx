import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import FilterOptions from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterOptions"

describe("FilterOptions", () => {
    const options = [
        { value: "a", label: "Option A" },
        { value: "b", label: "Option B" },
    ]

    it("should render the title", () => {
        render(
            <FilterOptions title="Sort" options={options} selectedOption={null} onSelectionChange={vi.fn()} />
        )
        expect(screen.getByText("Sort")).toBeInTheDocument()
    })

    it("should render an option per item", () => {
        render(
            <FilterOptions title="Sort" options={options} selectedOption={null} onSelectionChange={vi.fn()} />
        )
        expect(screen.getByText("Option A")).toBeInTheDocument()
        expect(screen.getByText("Option B")).toBeInTheDocument()
    })

    it("should mark active option with data-active=true", () => {
        render(
            <FilterOptions title="Sort" options={options} selectedOption="a" onSelectionChange={vi.fn()} />
        )
        expect(screen.getByText("Option A").closest("button")).toHaveAttribute("data-active", "true")
        expect(screen.getByText("Option B").closest("button")).toHaveAttribute("data-active", "false")
    })

    it("should call onSelectionChange with value when clicking an unselected option", () => {
        const onSelectionChange = vi.fn()
        render(
            <FilterOptions title="Sort" options={options} selectedOption={null} onSelectionChange={onSelectionChange} />
        )
        fireEvent.click(screen.getByText("Option A"))
        expect(onSelectionChange).toHaveBeenCalledWith("a")
    })

    it("should call onSelectionChange with null when clicking the active option", () => {
        const onSelectionChange = vi.fn()
        render(
            <FilterOptions title="Sort" options={options} selectedOption="a" onSelectionChange={onSelectionChange} />
        )
        fireEvent.click(screen.getByText("Option A"))
        expect(onSelectionChange).toHaveBeenCalledWith(null)
    })
})
