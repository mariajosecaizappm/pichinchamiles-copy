import {render} from "@testing-library/react"
import {describe, it, expect} from "vitest"
import MenuIcon from "@/presentation/pages/Home/components/Header/components/Icons/MenuIcon"

describe("MenuIcon", () => {
    it("should render an svg element", () => {
        const {container} = render(<MenuIcon />)
        const svg = container.querySelector("svg")
        expect(svg).toBeInTheDocument()
    })

    it("should have the correct viewBox", () => {
        const {container} = render(<MenuIcon />)
        const svg = container.querySelector("svg")
        expect(svg).toHaveAttribute("viewBox", "0 0 18 12")
    })

    it("should contain a path element with fill currentColor", () => {
        const {container} = render(<MenuIcon />)
        const path = container.querySelector("path")
        expect(path).toBeInTheDocument()
        expect(path).toHaveAttribute("fill", "currentColor")
    })
})
