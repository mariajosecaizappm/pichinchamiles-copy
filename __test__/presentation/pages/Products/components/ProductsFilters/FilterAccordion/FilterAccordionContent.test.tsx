import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import FilterAccordionContent from "@/presentation/pages/Products/components/ProductsFilters/FilterAccordion/FilterAccordionContent"

describe("FilterAccordionContent", () => {
    it("should render its children", () => {
        render(
            <FilterAccordionContent>
                <div data-testid="content">inner</div>
            </FilterAccordionContent>
        )
        expect(screen.getByTestId("content")).toBeInTheDocument()
    })

    it("should use flex-wrap layout classes", () => {
        const { container } = render(
            <FilterAccordionContent>
                <span>x</span>
            </FilterAccordionContent>
        )
        const wrapper = container.firstChild as HTMLElement
        expect(wrapper.className).toContain("flex")
        expect(wrapper.className).toContain("flex-wrap")
        expect(wrapper.className).toContain("gap-1")
    })
})
