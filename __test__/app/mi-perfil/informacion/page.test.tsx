import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import Page from "@/app/mi-perfil/informacion/page"
import { MemberType } from "@/domain/entity/Member/member"

const mockUseSession = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@heroui/react", () => ({
    Divider: () => <hr data-testid="divider" />,
}))

vi.mock("@/presentation/components/Alert", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div role="alert">{children}</div>,
}))

const personalMember = {
    memberType: MemberType.PERSONAL,
    firstName: "Juan",
    secondName: "Carlos",
    firstLastName: "Pérez",
    secondLastName: "García",
    identificationNumber: "1234567890",
    identificationType: "cedula",
    cellPhone: "0987654321",
    phone: "022222222",
    birthDay: "1990-05-15",
    country: "Ecuador",
    state: "Pichincha",
    city: "Quito",
    address: "Av. Amazonas N34-123",
    enrollmentEmail: "juan.perez@example.com",
    gender: "M",
    registrationDate: "2020-01-01",
    segment: "classic",
    acceptLopd: true,
    acceptedTermsAndCondition: true,
}

describe("Information Page (src/app/mi-perfil/informacion/page.tsx)", () => {
    it("should render the member information when a member exists", () => {
        mockUseSession.mockReturnValue({ member: personalMember })

        render(<Page />)

        expect(screen.getByText("Juan Pérez")).toBeInTheDocument()
        expect(screen.getByText("Documento de identificación")).toBeInTheDocument()
    })

    it("should render nothing when the member is null", () => {
        mockUseSession.mockReturnValue({ member: null })

        const { container } = render(<Page />)

        expect(container.firstChild).toBeNull()
    })
})