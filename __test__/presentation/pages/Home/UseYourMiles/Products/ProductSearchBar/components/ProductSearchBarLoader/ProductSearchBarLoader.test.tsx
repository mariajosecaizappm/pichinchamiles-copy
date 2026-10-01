import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import ProductSearchBarLoader from "@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/components/ProductSearchBarLoader/ProductSearchBarLoader"

vi.mock("@/presentation/components/icons/IconSearchLoader", () => ({
    default: ({className}: {className?: string}) => (
        <div data-testid="search-loader-icon" className={className}>Loader</div>
    ),
}))

describe("ProductSearchBarLoader", () => {
    it("should render with search query text", () => {
        render(<ProductSearchBarLoader searchQuery="laptop" />)

        expect(screen.getByText("Productos para laptop")).toBeInTheDocument()
    })

    it("should render loading icon", () => {
        render(<ProductSearchBarLoader searchQuery="test" />)

        expect(screen.getByTestId("search-loader-icon")).toBeInTheDocument()
    })

    it("should apply animate-spin class to icon", () => {
        render(<ProductSearchBarLoader searchQuery="test" />)

        const icon = screen.getByTestId("search-loader-icon")
        expect(icon).toHaveClass("animate-spin")
    })

    it("should render with empty search query", () => {
        render(<ProductSearchBarLoader searchQuery="" />)

        expect(screen.getByText("Buscando productos...")).toBeInTheDocument()
    })

    it("should apply correct container styling", () => {
        const {container} = render(<ProductSearchBarLoader searchQuery="test" />)

        const wrapper = container.firstChild as HTMLElement
        expect(wrapper).toHaveClass("flex")
        expect(wrapper).toHaveClass("flex-col")
        expect(wrapper).toHaveClass("items-center")
        expect(wrapper).toHaveClass("justify-center")
    })

    it("should apply fixed height on desktop", () => {
        const {container} = render(<ProductSearchBarLoader searchQuery="test" />)

        const wrapper = container.firstChild as HTMLElement
        expect(wrapper).toHaveClass("lg:h-[465px]")
    })

    it("should render icon in correct size container", () => {
        const {container} = render(<ProductSearchBarLoader searchQuery="test" />)

        const iconContainer = container.querySelector('[class*="mb-2.5"]')
        expect(iconContainer).toBeInTheDocument()
    })
})
