import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"

vi.mock("@/presentation/pages/Home/components/Icons", () => ({
    CreditCardIcon: () => <svg data-testid="credit-card-icon" />,
    GiftIcon: () => <svg data-testid="gift-icon" />,
    TransactionIcon: () => <svg data-testid="transaction-icon" />,
}))

import HowPMEWorks from "@/presentation/pages/Home/components/HowPMEWorks"

describe("HowPMEWorks", () => {
    it("should render the section title", () => {
        render(<HowPMEWorks />)
        expect(screen.getByText("¿Cómo funciona Pichincha Miles?")).toBeInTheDocument()
    })

    it("should render the section subtitle", () => {
        render(<HowPMEWorks />)
        expect(screen.getByText("Acumular y canjear es muy simple")).toBeInTheDocument()
    })

    it("should render all 3 items", () => {
        render(<HowPMEWorks />)
        expect(screen.getByText("Usa tu tarjeta de crédito")).toBeInTheDocument()
        expect(screen.getByText("Elige tu recompensa")).toBeInTheDocument()
        expect(screen.getByText("Canjea como prefieras")).toBeInTheDocument()
    })

    it("should render item descriptions", () => {
        render(<HowPMEWorks />)
        expect(screen.getByText(/Cada compra suma millas automáticamente/)).toBeInTheDocument()
        expect(screen.getByText(/Canjea tus millas por productos/)).toBeInTheDocument()
        expect(screen.getByText(/Solo con millas o combina millas/)).toBeInTheDocument()
    })

    it("should render icons for each item", () => {
        render(<HowPMEWorks />)
        expect(screen.getByTestId("credit-card-icon")).toBeInTheDocument()
        expect(screen.getByTestId("gift-icon")).toBeInTheDocument()
        expect(screen.getByTestId("transaction-icon")).toBeInTheDocument()
    })

    it("should use semantic section element with proper ARIA attributes", () => {
        render(<HowPMEWorks />)
        const section = screen.getByRole("region")
        expect(section).toBeInTheDocument()
        expect(section).toHaveAttribute("aria-labelledby", "how-pm-works-title")
    })

    it("should render section with correct container classes", () => {
        render(<HowPMEWorks />)
        const section = screen.getByRole("region")
        expect(section).toHaveClass(
            "p-6",
            "md:px-16",
            "md:py-10",
            "flex",
            "flex-col",
            "gap-6",
            "md:gap-10",
            "text-center",
            "bg-darkGrayishBlue-50"
        )
    })

    it("should have proper heading structure", () => {
        render(<HowPMEWorks />)
        const heading = screen.getByRole("heading", { name: "¿Cómo funciona Pichincha Miles?" })
        expect(heading).toBeInTheDocument()
        expect(heading).toHaveAttribute("id", "how-pm-works-title")
    })

    it("should render items as list items", () => {
        render(<HowPMEWorks />)
        const list = screen.getByRole("list")
        expect(list).toBeInTheDocument()
        
        const listItems = screen.getAllByRole("listitem")
        expect(listItems).toHaveLength(3)
    })

    it("should have accessible icons with aria-hidden", () => {
        render(<HowPMEWorks />)
        const icons = screen.getAllByText("", { selector: "[aria-hidden='true']" })
        icons.forEach(icon => {
            expect(icon).toHaveAttribute("aria-hidden", "true")
        })
    })

    it("should be accessible by screen readers", () => {
        render(<HowPMEWorks />)
        
        // Check that all important elements are accessible
        expect(screen.getByRole("region")).toBeInTheDocument()
        expect(screen.getByRole("heading", { name: "¿Cómo funciona Pichincha Miles?" })).toBeInTheDocument()
        expect(screen.getByRole("list")).toBeInTheDocument()
    })
})
