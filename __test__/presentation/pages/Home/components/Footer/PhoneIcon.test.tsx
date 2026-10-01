import {render} from "@testing-library/react"
import {describe, it, expect} from "vitest"
import PhoneIcon from "@/presentation/pages/Home/components/Footer/Icons/PhoneIcon"

describe("PhoneIcon", () => {
    it("should render an svg element", () => {
        const {container} = render(<PhoneIcon />)
        const svg = container.querySelector("svg")
        expect(svg).toBeInTheDocument()
        expect(svg).toHaveAttribute("viewBox", "0 0 18 18")
    })
})
