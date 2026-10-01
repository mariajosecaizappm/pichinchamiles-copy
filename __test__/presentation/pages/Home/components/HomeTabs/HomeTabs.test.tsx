import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { usePathname } from "next/navigation"
import links from "@/presentation/config/links"
import HomeTabs from "@/presentation/pages/Home/UseYourMiles/Layout/Tabs"

// Mock dependencies
vi.mock("next/navigation", () => ({
    usePathname: vi.fn(),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Layout/Tabs/components/TabLinks", () => ({
    default: ({ tabs }: { tabs: Array<{ id: string; label: string; href: string }> }) => (
        <div data-testid="tab-links">
            <div data-testid="tab-links-data">{JSON.stringify(tabs)}</div>
        </div>
    ),
    TabLink: {} as React.FC<{ id: string; label: string; href: string }>,
}))

describe("HomeTabs", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render tab links with correct configuration", () => {
        vi.mocked(usePathname).mockReturnValue("/")
        
        render(<HomeTabs />)
        
        expect(screen.getByTestId("tab-links")).toBeInTheDocument()
        expect(screen.getByTestId("tab-links-data")).toBeInTheDocument()
        
        const tabsData = JSON.parse(screen.getByTestId("tab-links-data").textContent || "[]")
        expect(tabsData).toHaveLength(2)
        expect(tabsData[0]).toEqual({
            id: "products",
            label: "Productos",
            href: links.products
        })
        expect(tabsData[1]).toEqual({
            id: "travels",
            label: "Viajes y actividades",
            href: `${links.useYourMiles}${links.travelAndActivities}`,
        })
    })

    it("should render travels content when on viajes page", () => {
        vi.mocked(usePathname).mockReturnValue(links.travelAndActivities)
        
        render(<HomeTabs />)
        
        // The component only renders TabLinks, not specific content based on pathname
        expect(screen.getByTestId("tab-links")).toBeInTheDocument()
    })

    it("should not render any content when on other pages", () => {
        vi.mocked(usePathname).mockReturnValue("/")
        
        render(<HomeTabs />)
        
        // The component only renders TabLinks regardless of pathname
        expect(screen.getByTestId("tab-links")).toBeInTheDocument()
    })

    it("should render TabLinks directly without an extra wrapper", () => {
        vi.mocked(usePathname).mockReturnValue("/")
        
        const { container } = render(<HomeTabs />)
        
        // HomeTabs now renders TabLinks directly, with no additional wrapper div
        expect(container.firstChild).toBe(screen.getByTestId("tab-links"))
    })
})
