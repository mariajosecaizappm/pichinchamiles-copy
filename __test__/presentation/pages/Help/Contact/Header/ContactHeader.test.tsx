import {render, screen} from "@testing-library/react"
import {describe, it, expect} from "vitest"
import ContactHeader from "@/presentation/pages/Help/Contact/Header/ContactHeader"

describe("ContactHeader", () => {
    it("should render the main heading", () => {
        render(<ContactHeader />)
        expect(screen.getByRole("heading", {name: "¿Dudas sobre Pichincha Miles?"})).toBeInTheDocument()
    })

    it("should render the description text", () => {
        render(<ContactHeader />)
        expect(screen.getByText("Déjanos tus datos y responderemos a tu requerimiento lo más pronto posible.")).toBeInTheDocument()
    })
})
