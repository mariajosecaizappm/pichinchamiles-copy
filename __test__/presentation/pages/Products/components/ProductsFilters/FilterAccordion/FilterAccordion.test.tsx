import { describe, it, expect } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import FilterAccordion from "@/presentation/pages/Products/components/ProductsFilters/FilterAccordion/FilterAccordion"

describe("FilterAccordion", () => {
    it("should render the title", () => {
        render(
            <FilterAccordion title="Marcas">
                <div>content</div>
            </FilterAccordion>
        )
        expect(screen.getByText("Marcas")).toBeInTheDocument()
    })

    it("should be collapsed by default", () => {
        render(
            <FilterAccordion title="Marcas">
                <div data-testid="accordion-child">child-content</div>
            </FilterAccordion>
        )
        expect(screen.getByRole("button", { name: "Marcas" })).toHaveAttribute("aria-expanded", "false")
    })

    it("should render children content when defaultExpanded is true", () => {
        render(
            <FilterAccordion title="Marcas" defaultExpanded>
                <div data-testid="accordion-child">child-content</div>
            </FilterAccordion>
        )
        expect(screen.getByTestId("accordion-child")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Marcas" })).toHaveAttribute("aria-expanded", "true")
    })

    it("should expand when the trigger is clicked from collapsed state", async () => {
        render(
            <FilterAccordion title="Marcas">
                <div data-testid="accordion-child">child-content</div>
            </FilterAccordion>
        )
        fireEvent.click(screen.getByRole("button", { name: "Marcas" }))
        await waitFor(() => {
            expect(screen.getByRole("button", { name: "Marcas" })).toHaveAttribute("aria-expanded", "true")
            expect(screen.getByTestId("accordion-child")).toBeInTheDocument()
        })
    })

    it("should expose aria-label matching title", () => {
        render(
            <FilterAccordion title="Rango de precios">
                <div>content</div>
            </FilterAccordion>
        )
        expect(screen.getByRole("button", { name: "Rango de precios" })).toBeInTheDocument()
    })
})
