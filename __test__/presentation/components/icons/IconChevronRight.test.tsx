import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import IconChevronRight from "@/presentation/components/icons/IconChevronRight"

describe("IconChevronRight", () => {
    it("should render an SVG element", () => {
        const { container } = render(<IconChevronRight />)
        const svg = container.querySelector("svg")
        expect(svg).toBeInTheDocument()
    })

    it("should have correct default SVG attributes", () => {
        const { container } = render(<IconChevronRight />)
        const svg = container.querySelector("svg")
        expect(svg).toHaveAttribute("width", "5")
        expect(svg).toHaveAttribute("height", "9")
        expect(svg).toHaveAttribute("viewBox", "0 0 6 6")
        expect(svg).toHaveAttribute("fill", "none")
        expect(svg).toHaveAttribute("data-testid", "chevron-right-icon")
    })

    it("should render a path with currentColor fill by default", () => {
        const { container } = render(<IconChevronRight />)
        const path = container.querySelector("path")
        expect(path).toBeInTheDocument()
        expect(path).toHaveAttribute("fill", "currentColor")
    })

    it("should allow overriding color and size", () => {
        const { container } = render(<IconChevronRight color="#0F265C" width="8" height="12" />)
        const svg = container.querySelector("svg")
        const path = container.querySelector("path")
        expect(svg).toHaveAttribute("width", "8")
        expect(svg).toHaveAttribute("height", "12")
        expect(path).toHaveAttribute("fill", "#0F265C")
    })
})
