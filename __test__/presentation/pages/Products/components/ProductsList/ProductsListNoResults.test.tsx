import ProductsListNoResults from "@/presentation/pages/Products/components/ProductsList/ProductsListNoResults"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

describe("ProductsListNoResults", () => {
    it("should render the default message when there is no search query", () => {
        render(<ProductsListNoResults />)

        expect(screen.getByTestId("products-list-no-results")).toHaveTextContent(
            "No hay productos disponibles por ahora.",
        )
        expect(screen.queryByRole("img", { hidden: true })).not.toBeInTheDocument()
    })

    it("should render the search message and icon when there is a search query", () => {
        const { container } = render(<ProductsListNoResults hasSearchQuery />)

        expect(screen.getByTestId("products-list-no-results")).toHaveTextContent(
            "Intenta con otro término",
        )
        expect(screen.getByTestId("products-list-no-results")).toHaveTextContent("de búsqueda")
        expect(container.querySelector("svg")).toBeInTheDocument()
    })

    it("should render the icon inside a circular container when there is a search query", () => {
        const { container } = render(<ProductsListNoResults hasSearchQuery />)

        const iconContainer = container.querySelector(".rounded-full.bg-darkGrayishBlue-100")

        expect(iconContainer).toBeInTheDocument()
        expect(iconContainer).toHaveClass("size-20")
        expect(iconContainer?.querySelector("svg")).toBeInTheDocument()
    })

    it("should expose an output element for live announcements", () => {
        render(<ProductsListNoResults hasSearchQuery />)

        const container = screen.getByTestId("products-list-no-results")
        const output = container.querySelector("output")

        expect(output).toBeInTheDocument()
        expect(output).toHaveAttribute("aria-live", "polite")
        expect(container).not.toHaveAttribute("role", "status")
    })
})
