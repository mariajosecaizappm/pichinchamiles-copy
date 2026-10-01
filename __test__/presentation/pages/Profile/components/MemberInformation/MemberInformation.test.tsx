import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import MemberInformation from "@/presentation/pages/Profile/components/MemberInformation/MemberInformation"
import { personalMember, corporateMember } from "./test-members"

vi.mock("@heroui/react", () => ({
    Divider: () => <hr data-testid="divider" />,
}))

vi.mock("@/presentation/components/Alert", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div role="alert">{children}</div>,
}))

describe("MemberInformation", () => {
    it("should render the personal member name as the title", () => {
        render(<MemberInformation member={personalMember} />)

        expect(screen.getByText("Juan Pérez")).toBeInTheDocument()
    })

    it("should render the company name as the title for corporate members", () => {
        render(<MemberInformation member={corporateMember} />)

        expect(screen.getByText("Acme Ecuador S.a.")).toBeInTheDocument()
    })

    it("should render PersonalMemberInformation for personal members", () => {
        render(<MemberInformation member={personalMember} />)

        expect(screen.getByText("Documento de identificación")).toBeInTheDocument()
        expect(screen.queryByText("RUC")).not.toBeInTheDocument()
    })

    it("should render CompanyMemberInformation for corporate members", () => {
        render(<MemberInformation member={corporateMember} />)

        expect(screen.getByText("RUC")).toBeInTheDocument()
        expect(screen.queryByText("Documento de identificación")).not.toBeInTheDocument()
    })

    it("should render the support alert", () => {
        render(<MemberInformation member={personalMember} />)

        expect(screen.getByRole("alert")).toHaveTextContent(
            /Si deseas actualizar tu información personal, comunícate al 1800 - BPMILE \(276-453\)/
        )
    })
})
