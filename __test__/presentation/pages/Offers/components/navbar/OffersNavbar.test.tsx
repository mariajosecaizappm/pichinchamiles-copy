import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import "@testing-library/jest-dom"

vi.mock("@/presentation/pages/Home/UseYourMiles/Layout/Tabs/components/TabLinks", () => ({
    default: ({ tabs }: { tabs: Array<{ id: string; label: string; href: string }> }) => (
        <div data-testid="tab-links">
            {tabs.map((tab) => (
                <a key={tab.id} href={tab.href} data-testid={`tab-${tab.id}`}>
                    {tab.label}
                </a>
            ))}
        </div>
    ),
}))

import OffersNavbar from "@/presentation/pages/Offers/components/navbar/OffersNavbar/OffersNavbar"

describe("OffersNavbar", () => {
    it("should render the Ofertas heading", () => {
        render(<OffersNavbar />)

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Ofertas")
    })

    it("should render TabLinks component", () => {
        render(<OffersNavbar />)

        expect(screen.getByTestId("tab-links")).toBeInTheDocument()
    })

    it("should render Productos tab with correct href", () => {
        render(<OffersNavbar />)

        const tab = screen.getByText("Productos").closest("a")
        expect(tab).toHaveAttribute("href", "/ofertas/productos")
    })

    it("should render Viajes y actividades tab with correct href", () => {
        render(<OffersNavbar />)

        const tab = screen.getByText("Viajes y actividades").closest("a")
        expect(tab).toHaveAttribute("href", "/ofertas/viajes-y-actividades")
    })

    it("should render both tabs", () => {
        render(<OffersNavbar />)

        expect(screen.getByTestId("tab-offers-products")).toBeInTheDocument()
        expect(screen.getByTestId("tab-offers-travels")).toBeInTheDocument()
    })
})
