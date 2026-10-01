import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Miles from '@/presentation/pages/Home/components/Header/components/Miles/Miles'
import { Member, MemberType } from '@/domain/entity/Member/member'
import { formatMiles } from '@/presentation/helpers/quantities'

const mockPersonalMember: Member = {
    acceptLopd: true,
    acceptedTermsAndCondition: true,
    cellPhone: "1234567890",
    enrollmentEmail: "test@example.com",
    firstName: "John",
    secondName: "Doe",
    firstLastName: "Smith",
    secondLastName: "Johnson",
    gender: "M",
    birthDay: "1990-01-01",
    state: "State",
    city: "City",
    address: "123 Main St",
    identificationNumber: "123456789",
    identificationType: "CC",
    memberType: MemberType.PERSONAL,
    phone: "1234567890",
    country: "US",
    registrationDate: "2023-01-01",
    segment: "segment"
}

const mockCorporateMember: Member = {
    acceptLopd: true,
    acceptedTermsAndCondition: true,
    address: "456 Business Ave",
    administratorName: "Jane Doe",
    birthDay: "1985-01-01",
    cellPhone: "0987654321",
    city: "City",
    companyName: "Pichincha Corp",
    country: "EC",
    enrollmentEmail: "corp@example.com",
    enrollmentEmailAdministrator: "admin@example.com",
    firstLastNameAdministrator: "Doe",
    firstNameAdministrator: "Jane",
    identificationNumber: "1799999999001",
    identificationNumberAdministrator: "1234567890",
    identificationType: "RUC",
    memberType: MemberType.CORPORATE,
    registrationDate: "2023-01-01",
    secondNameAdministrator: "Marie",
    secondLastNameAdministrator: "Smith",
    segment: "corporate",
    state: "Pichincha",
}

describe('Miles', () => {
    it('renders the miles balance correctly with formatting', () => {
        render(<Miles balance={1500} member={mockPersonalMember} />)

        expect(screen.getByTestId("textUserWelcome")).toHaveTextContent(
            `Hola John Smith, tienes ${formatMiles(1500)} millas`,
        )
        expect(
            screen.getByText(
                (content, element) =>
                    element?.tagName.toLowerCase() === "strong" &&
                    content.includes(formatMiles(1500)) &&
                    content.includes("millas"),
            ),
        ).toHaveClass("font-semibold")
    })

    it('applies correct CSS classes', () => {
        const { container } = render(<Miles balance={1500} member={mockPersonalMember} />)
        
        const milesElement = container.querySelector('div')
        expect(milesElement).toHaveClass('text-base', 'items-center', 'text-blue-500', 'gap-4', 'hidden', 'lg:flex', 'text-center', 'font-normal', 'bg-white')
    })

    it('displays zero balance correctly', () => {
        const { container } = render(<Miles balance={0} member={mockPersonalMember} />)
        
        expect(container.textContent).toContain(`Hola John Smith, tienes ${formatMiles(0)} millas`)
    })

    it('displays large balance correctly with formatting', () => {
        const { container } = render(<Miles balance={999999} member={mockPersonalMember} />)
        
        expect(container.textContent).toContain(`Hola John Smith, tienes ${formatMiles(999999)} millas`)
    })

    it('renders the corporate member company name', () => {
        render(<Miles balance={3500} member={mockCorporateMember} />)

        expect(screen.getByTestId("textUserWelcome")).toHaveTextContent(
            `Hola Pichincha Corp, tienes ${formatMiles(3500)} millas`,
        )
    })
})
