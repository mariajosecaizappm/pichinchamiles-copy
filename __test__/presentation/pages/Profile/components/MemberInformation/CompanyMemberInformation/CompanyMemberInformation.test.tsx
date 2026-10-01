import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import CompanyMemberInformation from "@/presentation/pages/Profile/components/MemberInformation/CompanyMemberInformation"
import { corporateMember } from "../test-members"

vi.mock("@heroui/react", () => ({
    Divider: () => <hr data-testid="divider" />,
}))

describe("CompanyMemberInformation", () => {
    it("should render all corporate information rows", () => {
        render(<CompanyMemberInformation member={corporateMember} />)

        expect(screen.getByText("RUC")).toBeInTheDocument()
        expect(screen.getByText("Administrador de millas")).toBeInTheDocument()
        expect(screen.getByText("Documento de identidad del Administrador")).toBeInTheDocument()
        expect(screen.getByText("Número telefónico de contacto")).toBeInTheDocument()
        expect(screen.getByText("País, provincia y ciudad")).toBeInTheDocument()
    })

    it("should mask RUC with five trailing digits", () => {
        render(<CompanyMemberInformation member={corporateMember} />)

        expect(screen.getByText("********90123")).toBeInTheDocument()
    })

    it("should render the administrator name unmasked", () => {
        render(<CompanyMemberInformation member={corporateMember} />)

        expect(screen.getByText("Ana María López")).toBeInTheDocument()
    })

    it("should mask administrator identification and phone with three trailing digits", () => {
        render(<CompanyMemberInformation member={corporateMember} />)

        expect(screen.getByText("**********001")).toBeInTheDocument()
        expect(screen.getByText("*******999")).toBeInTheDocument()
    })

    it("should concatenate country, state and city with plus operator", () => {
        render(<CompanyMemberInformation member={corporateMember} />)

        expect(screen.getByText("Ecuador, Guayas, Guayaquil")).toBeInTheDocument()
    })

    it("should render a divider between every row", () => {
        const { container } = render(<CompanyMemberInformation member={corporateMember} />)

        expect(container.querySelectorAll('[data-testid="divider"]')).toHaveLength(4)
    })
})
