import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import ProfileTabs from "@/presentation/pages/Profile/components/ProfileTabs/ProfileTabs"
import links from "@/presentation/config/links"

vi.mock("next/navigation", () => ({
    usePathname: vi.fn(() => "/mi-perfil"),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Layout/Tabs/components/TabLinks", () => ({
    default: ({
        tabs,
        className,
        classNames,
    }: {
        tabs: Array<{ id: string; label: string; href: string }>
        className?: string
        classNames?: { active?: string; inactive?: string }
    }) => (
        <div
            data-testid="tab-links"
            data-classname={className}
            data-active-classname={classNames?.active}
            data-inactive-classname={classNames?.inactive}
        >
            {tabs.map((tab) => (
                <a key={tab.id} href={tab.href} data-tab-id={tab.id}>
                    {tab.label}
                </a>
            ))}
        </div>
    ),
}))

describe("ProfileTabs", () => {
    it("should render without errors", () => {
        const { container } = render(<ProfileTabs />)
        expect(container).toBeInTheDocument()
    })

    it("should render TabLinks component", () => {
        render(<ProfileTabs />)
        expect(screen.getByTestId("tab-links")).toBeInTheDocument()
    })

    it("should render all 4 tabs with correct labels", () => {
        render(<ProfileTabs />)
        
        expect(screen.getByText("Historial de transacciones")).toBeInTheDocument()
        expect(screen.getByText("Información personal")).toBeInTheDocument()
        expect(screen.getByText("Direcciones")).toBeInTheDocument()
        expect(screen.getByText("Seguridad")).toBeInTheDocument()
    })

    it("should pass correct tab configuration to TabLinks component", () => {
        render(<ProfileTabs />)
        
        const transaccionesTab = screen.getByText("Historial de transacciones")
        const profileTab = screen.getByText("Información personal")
        const addressesTab = screen.getByText("Direcciones")
        const securityTab = screen.getByText("Seguridad")
        
        expect(transaccionesTab).toBeInTheDocument()
        expect(profileTab).toBeInTheDocument()
        expect(addressesTab).toBeInTheDocument()
        expect(securityTab).toBeInTheDocument()
    })

    it("should have correct tab IDs", () => {
        render(<ProfileTabs />)
        
        const transaccionesLink = screen.getByText("Historial de transacciones").closest("a")
        const profileLink = screen.getByText("Información personal").closest("a")
        const addressesLink = screen.getByText("Direcciones").closest("a")
        const securityLink = screen.getByText("Seguridad").closest("a")
        
        expect(transaccionesLink).toHaveAttribute("data-tab-id", "transacciones")
        expect(profileLink).toHaveAttribute("data-tab-id", "profile")
        expect(addressesLink).toHaveAttribute("data-tab-id", "addresses")
        expect(securityLink).toHaveAttribute("data-tab-id", "security")
    })

    it("should have correct hrefs matching links config", () => {
        render(<ProfileTabs />)
        
        const transaccionesLink = screen.getByText("Historial de transacciones").closest("a")
        const profileLink = screen.getByText("Información personal").closest("a")
        const addressesLink = screen.getByText("Direcciones").closest("a")
        const securityLink = screen.getByText("Seguridad").closest("a")
        
        expect(transaccionesLink).toHaveAttribute("href", links.myTransactions)
        expect(profileLink).toHaveAttribute("href", links.myInformation)
        expect(addressesLink).toHaveAttribute("href", links.myAddresses)
        expect(securityLink).toHaveAttribute("href", links.mySecurity)
    })

    it("should pass className prop to TabLinks including body-container", () => {
        render(<ProfileTabs />)
        
        const tabLinks = screen.getByTestId("tab-links")
        const className = tabLinks.getAttribute("data-classname")
        
        expect(className).toContain("body-container")
        expect(className).toContain("w-full")
        expect(className).toContain("whitespace-nowrap")
        expect(className).toContain("overflow-x-auto")
    })

    it("should pass profile-specific classNames to TabLinks", () => {
        render(<ProfileTabs />)

        const tabLinks = screen.getByTestId("tab-links")

        expect(tabLinks).toHaveAttribute(
            "data-active-classname",
            "typo-main-caption-semi-bold text-blue-500 md:typo-main-body-semi-bold"
        )
        expect(tabLinks).toHaveAttribute(
            "data-inactive-classname",
            "typo-main-caption-book hover:text-grayscale-700 md:typo-main-body-book"
        )
    })

    it("should render container with correct structure", () => {
        const { container } = render(<ProfileTabs />)
        
        const wrapper = container.querySelector("div.pt-3")
        expect(wrapper).toBeInTheDocument()
        expect(wrapper).toHaveClass("md:mb-4")
    })
})
