import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import IconArrow from "@/presentation/components/icons/IconArrow"

describe("IconArrow", () => {
    it("should render an SVG element", () => {
        const { container } = render(<IconArrow />)
        const svg = container.querySelector("svg")
        expect(svg).toBeInTheDocument()
    })

    it("should have correct SVG attributes", () => {
        const { container } = render(<IconArrow />)
        const svg = container.querySelector("svg")
        expect(svg).toHaveAttribute("width", "12")
        expect(svg).toHaveAttribute("height", "8")
        expect(svg).toHaveAttribute("viewBox", "0 0 12 8")
        expect(svg).toHaveAttribute("fill", "none")
    })

    it("should render a path element", () => {
        const { container } = render(<IconArrow />)
        const path = container.querySelector("path")
        expect(path).toBeInTheDocument()
    })

    it("should have currentColor fill on the path", () => {
        const { container } = render(<IconArrow />)
        const path = container.querySelector("path")
        expect(path).toHaveAttribute("fill", "currentColor")
    })
})
