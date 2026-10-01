import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import IconChevronDown from "@/presentation/components/icons/IconChevronDown"

describe("IconChevronDown", () => {
    it("should render an SVG element", () => {
        const { container } = render(<IconChevronDown />)
        const svg = container.querySelector("svg")
        expect(svg).toBeInTheDocument()
    })

    it("should have correct default SVG attributes", () => {
        const { container } = render(<IconChevronDown />)
        const svg = container.querySelector("svg")
        expect(svg).toHaveAttribute("width", "10")
        expect(svg).toHaveAttribute("height", "7")
        expect(svg).toHaveAttribute("viewBox", "0 0 10 7")
        expect(svg).toHaveAttribute("fill", "none")
    })

    it("should render a path with the default fill color", () => {
        const { container } = render(<IconChevronDown />)
        const path = container.querySelector("path")
        expect(path).toBeInTheDocument()
        expect(path).toHaveAttribute("fill", "#2F7ABF")
    })

    it("should allow overriding color and size", () => {
        const { container } = render(
            <IconChevronDown color="#0F265C" width={16} height={12} />,
        )
        const svg = container.querySelector("svg")
        const path = container.querySelector("path")
        expect(svg).toHaveAttribute("width", "16")
        expect(svg).toHaveAttribute("height", "12")
        expect(path).toHaveAttribute("fill", "#0F265C")
    })
})
