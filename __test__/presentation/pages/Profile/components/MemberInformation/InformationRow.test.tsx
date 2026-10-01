import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import InformationRow from "@/presentation/pages/Profile/components/MemberInformation/InformationRow"

describe("InformationRow", () => {
    it("should render the label and value", () => {
        render(<InformationRow label="Nombre" value="Juan Pérez" />)

        expect(screen.getByText("Nombre")).toBeInTheDocument()
        expect(screen.getByText("Juan Pérez")).toBeInTheDocument()
    })

    it("should keep label and value in separate spans", () => {
        const { container } = render(<InformationRow label="Correo" value="test@example.com" />)
        const labelSpan = container.querySelector("span.text-neutral-950")
        const valueSpan = container.querySelector("span.font-semibold")

        expect(labelSpan).toHaveTextContent("Correo")
        expect(valueSpan).toHaveTextContent("test@example.com")
    })
})
