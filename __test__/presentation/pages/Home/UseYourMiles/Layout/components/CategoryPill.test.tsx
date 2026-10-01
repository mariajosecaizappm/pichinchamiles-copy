import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("next/link", () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}))

import CategoryPill from "@/presentation/pages/Home/UseYourMiles/Layout/components/CategoryPill"

describe("CategoryPill", () => {
    const defaultProps = {
        label: "Vuelos",
        href: "/vuelos",
        icon: <span data-testid="icon">✈</span>,
    }

    it("should render the label", () => {
        render(<CategoryPill {...defaultProps} />)
        expect(screen.getByText("Vuelos")).toBeInTheDocument()
    })

    it("should render the icon", () => {
        render(<CategoryPill {...defaultProps} />)
        expect(screen.getByTestId("icon")).toBeInTheDocument()
    })

    it("should wrap content in a link with the correct href", () => {
        render(<CategoryPill {...defaultProps} />)
        const link = screen.getByRole("link")
        expect(link).toHaveAttribute("href", "/vuelos")
    })

    it("should render a link element", () => {
        render(<CategoryPill {...defaultProps} />)
        expect(screen.getByRole("link")).toBeInTheDocument()
    })

    it("should mark the button as active when active is true", () => {
        render(<CategoryPill {...defaultProps} active={true} />)
        const button = screen.getByRole("button")
        expect(button).toHaveAttribute("data-active", "true")
    })

    it("should mark the button as not active when active is false", () => {
        render(<CategoryPill {...defaultProps} active={false} />)
        const button = screen.getByRole("button")
        expect(button).toHaveAttribute("data-active", "false")
    })

    it("should default active to false", () => {
        render(<CategoryPill {...defaultProps} />)
        const button = screen.getByRole("button")
        expect(button).toHaveAttribute("data-active", "false")
    })
})
