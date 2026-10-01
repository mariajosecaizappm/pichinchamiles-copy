import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import ShowAllFilters from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/ShowAllFilters"

describe("ShowAllFilters", () => {
    it("should show 'Ver todos' label when showAllBrands is false", () => {
        render(<ShowAllFilters showAll={false} setShowAll={vi.fn()} />)
        expect(screen.getByText("Ver todos")).toBeInTheDocument()
    })

    it("should show 'Ver menos' label when showAllBrands is true", () => {
        render(<ShowAllFilters showAll={true} setShowAll={vi.fn()} />)
        expect(screen.getByText("Ver menos")).toBeInTheDocument()
    })

    it("should toggle showAllBrands when pressed", () => {
        const setShowAllBrands = vi.fn()
        render(<ShowAllFilters showAll={false} setShowAll={setShowAllBrands} />)
        fireEvent.click(screen.getByRole("button"))
        expect(setShowAllBrands).toHaveBeenCalledWith(true)
    })

    it("should toggle to false when currently true", () => {
        const setShowAllBrands = vi.fn()
        render(<ShowAllFilters showAll={true} setShowAll={setShowAllBrands} />)
        fireEvent.click(screen.getByRole("button"))
        expect(setShowAllBrands).toHaveBeenCalledWith(false)
    })
})
