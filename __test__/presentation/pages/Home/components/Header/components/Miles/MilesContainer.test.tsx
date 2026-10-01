import { render } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import MilesContainer from "@/presentation/pages/Home/components/Header/components/Miles/MilesContainer"
import { Member, MemberType } from "@/domain/entity/Member/member"

// Mock the useSession hook
vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        balance: 1000,
        member: {
            firstName: "John",
            firstLastName: "Doe",
            memberType: MemberType.PERSONAL,
            acceptLopd: true,
            acceptedTermsAndCondition: true,
            cellPhone: "123456789",
            enrollmentEmail: "john@example.com",
            secondName: "",
            secondLastName: "",
            gender: "M",
            birthDay: "1990-01-01",
            state: "State",
            city: "City",
            address: "Address",
            identificationNumber: "123456789",
            identificationType: "CC",
            phone: "123456789",
            country: "Country",
            registrationDate: "2023-01-01",
            segment: "segment1"
        } as Member,
        isLogged: true
    })
}))

// Mock the Miles and MilesMobile components
vi.mock("@/presentation/pages/Home/components/Header/components/Miles/Miles", () => ({
    default: ({ balance }: { balance: number }) => (
        <div data-testid="miles-component">
            Miles: {balance}
        </div>
    )
}))

vi.mock("@/presentation/pages/Home/components/Header/components/Miles/MilesMobile", () => ({
    default: ({ balance }: { balance: number }) => (
        <div data-testid="miles-mobile-component">
            Mobile Miles: {balance}
        </div>
    )
}))

describe("MilesContainer", () => {
    it("should render Miles component when not mobile and user is logged in", () => {
        const { container } = render(<MilesContainer isMobile={false} />)
        const milesComponent = container.querySelector("[data-testid='miles-component']")
        expect(milesComponent).toBeInTheDocument()
        expect(milesComponent).toHaveTextContent("Miles: 1000")
    })

    it("should render MilesMobile component when mobile and user is logged in", () => {
        const { container } = render(<MilesContainer isMobile={true} />)
        const milesMobileComponent = container.querySelector("[data-testid='miles-mobile-component']")
        expect(milesMobileComponent).toBeInTheDocument()
        expect(milesMobileComponent).toHaveTextContent("Mobile Miles: 1000")
    })

    it("should default to non-mobile when isMobile is not provided", () => {
        const { container } = render(<MilesContainer />)
        const milesComponent = container.querySelector("[data-testid='miles-component']")
        expect(milesComponent).toBeInTheDocument()
    })
})
