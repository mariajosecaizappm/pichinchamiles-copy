import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import ProductsCatalogLayout from "@/presentation/pages/Products/components/ProductsCatalogLayout"

vi.mock("@heroui/react", () => ({
    cn: (...classes: (string | false)[]) => classes.filter(Boolean).join(" "),
}))

describe("ProductsCatalogLayout", () => {
    it("renders desktop filters and children with default classes", () => {
        render(
            <ProductsCatalogLayout
                desktopFilters={<div data-testid="desktop-filters">filters</div>}
            >
                <div data-testid="children">content</div>
            </ProductsCatalogLayout>,
        )

        expect(screen.getByTestId("desktop-filters")).toBeInTheDocument()
        expect(screen.getByTestId("children")).toBeInTheDocument()

        const wrapper = screen.getByTestId("desktop-filters").parentElement
        expect(wrapper).toHaveClass("flex flex-col lg:flex-row")
        expect(wrapper).toHaveClass("lg:body-container")
    })

    it("applies the custom className", () => {
        render(
            <ProductsCatalogLayout
                desktopFilters={<div data-testid="desktop-filters">filters</div>}
                className="custom-class"
            >
                <div data-testid="children">content</div>
            </ProductsCatalogLayout>,
        )

        expect(screen.getByTestId("desktop-filters").parentElement).toHaveClass(
            "custom-class",
        )
    })
})
