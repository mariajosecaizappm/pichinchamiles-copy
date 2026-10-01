import {render, screen} from "@testing-library/react"
import {describe, it, expect} from "vitest"
import MilesMobile from "@/presentation/pages/Home/components/Header/components/Miles/MilesMobile"
import { formatMiles } from "@/presentation/helpers/quantities"

describe("MilesMobile", () => {
    it("should render miles balance correctly with formatting", () => {
        const balance = 1500
        
        render(<MilesMobile balance={balance} />)
        
        expect(screen.getByText("Tienes")).toBeInTheDocument()
        expect(screen.getByText(`${formatMiles(balance)} millas`)).toBeInTheDocument()
    })

    it("should have correct mobile styling classes", () => {
        const balance = 2500
        
        render(<MilesMobile balance={balance} />)
        
        const milesElement = screen.getByText(/Tienes/i).closest('div')
        expect(milesElement).toHaveClass("text-base", "text-center", "lg:hidden", "font-medium", "text-blue-500", "bg-white")
    })

    it("should display balance in strong tag", () => {
        const balance = 3000
        
        render(<MilesMobile balance={balance} />)
        
        const strongElement = screen.getByText(`${formatMiles(balance)} millas`)
        expect(strongElement.tagName).toBe("STRONG")
        expect(strongElement).toHaveClass("font-semibold")
    })
})
