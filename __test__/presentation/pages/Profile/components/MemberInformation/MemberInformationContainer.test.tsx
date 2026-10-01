import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import MemberInformationContainer from "@/presentation/pages/Profile/components/MemberInformation"
import { personalMember } from "./test-members"

const mockUseSession = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

describe("MemberInformationContainer", () => {
    it("should return null when the member is null", () => {
        mockUseSession.mockReturnValue({ member: null })
        const { container } = render(<MemberInformationContainer />)

        expect(container.firstChild).toBeNull()
    })

    it("should render MemberInformation when a member is available", () => {
        mockUseSession.mockReturnValue({ member: personalMember })
        render(<MemberInformationContainer />)

        expect(screen.getByText("Juan Pérez")).toBeInTheDocument()
        expect(screen.getByText("Documento de identificación")).toBeInTheDocument()
    })
})
