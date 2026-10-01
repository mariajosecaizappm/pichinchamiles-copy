import {render} from "@testing-library/react"
import {describe, it, expect} from "vitest"
import Divider from "@/presentation/pages/Home/components/Footer/Divider"

describe("Divider", () => {
    it("should render a divider line", () => {
        const {container} = render(<Divider />)
        const line = container.querySelector(".h-px")
        expect(line).toBeInTheDocument()
        expect(line).toHaveClass("bg-darkGrayishBlue-300")
    })
})
