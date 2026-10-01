import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import ApplyFiltersAction from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer/FilterDrawerFooter/ApplyFiltersAction"

describe("ApplyFiltersAction", () => {
    it("should render 'Ver resultados' label", () => {
        render(<ApplyFiltersAction onApplyFilters={vi.fn()} />)
        expect(screen.getByText("Ver resultados")).toBeInTheDocument()
    })

    it("should call onApplyFilters when pressed", () => {
        const onApplyFilters = vi.fn()
        render(<ApplyFiltersAction onApplyFilters={onApplyFilters} />)
        fireEvent.click(screen.getByRole("button"))
        expect(onApplyFilters).toHaveBeenCalled()
    })
})
