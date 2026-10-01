import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import PersonalMemberInformation from "@/presentation/pages/Profile/components/MemberInformation/PersonalMemberInformation"
import { personalMember } from "../test-members"

vi.mock("@heroui/react", () => ({
    Divider: () => <hr data-testid="divider" />,
}))

describe("PersonalMemberInformation", () => {
    it("should render all personal information rows", () => {
        render(<PersonalMemberInformation member={personalMember} />)

        expect(screen.getByText("Documento de identificación")).toBeInTheDocument()
        expect(screen.getByText("Número de celular")).toBeInTheDocument()
        expect(screen.getByText("Teléfono de domicilio")).toBeInTheDocument()
        expect(screen.getByText("Fecha de nacimiento")).toBeInTheDocument()
        expect(screen.getByText("País, provincia y ciudad")).toBeInTheDocument()
        expect(screen.getByText("Dirección")).toBeInTheDocument()
    })

    it("should mask identification and phone numbers", () => {
        render(<PersonalMemberInformation member={personalMember} />)

        expect(screen.getByText("*******890")).toBeInTheDocument()
        expect(screen.getByText("*******321")).toBeInTheDocument()
        expect(screen.getByText("******222")).toBeInTheDocument()
    })

    it("should render birthDay and address values unmasked", () => {
        render(<PersonalMemberInformation member={personalMember} />)

        expect(screen.getByText("1990-05-15")).toBeInTheDocument()
        expect(screen.getByText("Av. Amazonas N34-123")).toBeInTheDocument()
    })

    it("should concatenate country, state and city", () => {
        render(<PersonalMemberInformation member={personalMember} />)

        expect(screen.getByText("Ecuador, Pichincha, Quito")).toBeInTheDocument()
    })

    it("should render a divider between every row", () => {
        const { container } = render(<PersonalMemberInformation member={personalMember} />)

        expect(container.querySelectorAll('[data-testid="divider"]')).toHaveLength(5)
    })
})
