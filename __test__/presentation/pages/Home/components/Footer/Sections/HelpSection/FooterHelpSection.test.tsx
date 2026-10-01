import {render, screen, fireEvent} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import React from "react"

const mockHandleContactClick = vi.fn()

vi.mock("@/presentation/hooks/useContactLinkGuard", () => ({
    default: () => mockHandleContactClick,
}))

vi.mock("@/presentation/config/links", () => ({
    default: {
        contact: "/ayuda/contacto",
        faq: "/ayuda/faq",
    },
}))

vi.mock("@/presentation/components/AppLink", () => ({
    default: ({children, href, onClick}: {children: React.ReactNode; href: string; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void}) => (
        <a href={href} onClick={onClick}>{children}</a>
    ),
}))

vi.mock("@/presentation/pages/Home/components/Footer/Icons/PhoneIcon", () => ({
    default: () => <svg data-testid="phone-icon" />,
}))

vi.mock("@heroui/react", () => ({
    Divider: () => <hr data-testid="divider" />,
}))

import FooterHelpSection from "@/presentation/pages/Home/components/Footer/Sections/HelpSection/FooterHelpSection"

describe("FooterHelpSection", () => {
    it("should render the help section heading", () => {
        render(<FooterHelpSection />)
        expect(screen.getByRole("heading", {name: "Ayuda"})).toBeInTheDocument()
    })

    it("should render contact and faq links", () => {
        render(<FooterHelpSection />)
        expect(screen.getByRole("link", {name: "Contacto"})).toHaveAttribute("href", "/ayuda/contacto")
        expect(screen.getByRole("link", {name: "Preguntas frecuentes"})).toHaveAttribute("href", "/ayuda/faq")
    })

    it("should call the contact guard when clicking the contact link", () => {
        render(<FooterHelpSection />)
        const contactLink = screen.getByRole("link", {name: "Contacto"})
        fireEvent.click(contactLink)
        expect(mockHandleContactClick).toHaveBeenCalledTimes(1)
    })

    it("should render the phone button with the correct number", () => {
        render(<FooterHelpSection />)
        const button = screen.getByRole("button", {name: "Llamar al teléfono de atención al cliente: 1800 - BPMILE (276453)"})
        expect(button).toBeInTheDocument()
        expect(screen.getByTestId("phone-icon")).toBeInTheDocument()
    })

    it("should render a divider", () => {
        render(<FooterHelpSection />)
        expect(screen.getByTestId("divider")).toBeInTheDocument()
    })
})
