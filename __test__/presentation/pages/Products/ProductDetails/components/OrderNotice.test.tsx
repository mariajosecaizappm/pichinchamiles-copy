import {describe, it, expect} from "vitest"
import {render, screen} from "@testing-library/react"
import OrderNotice from "@/presentation/pages/Products/ProductDetails/components/OrderNotice/OrderNotice"

describe("OrderNotice", () => {
    it("should render order notice section", () => {
        render(<OrderNotice />)
        expect(screen.getByText(/Para tu pedido ten en cuenta:/i)).toBeInTheDocument()
    })

    it("should render delivery notice", () => {
        render(<OrderNotice />)
        expect(screen.getByText(/Entrega en un máximo/i)).toBeInTheDocument()
    })

    it("should render guarantee info", () => {
        render(<OrderNotice />)
        expect(screen.getByText(/garantía/i)).toBeInTheDocument()
    })
})
