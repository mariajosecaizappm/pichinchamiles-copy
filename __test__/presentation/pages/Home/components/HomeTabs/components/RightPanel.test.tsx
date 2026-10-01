import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import {RightPanel} from "@/presentation/pages/Home/UseYourMiles/Layout/Tabs/components/RightPanel"

// Mock next/navigation
vi.mock("next/navigation", () => ({
    usePathname: vi.fn(),
}))

// Mock HomeTabsProductsContainer
vi.mock("@/presentation/pages/Home/UseYourMiles/Layout/Tabs/HomeTabsProducts", () => ({
    default: () => <div data-testid="home-tabs-products-container">HomeTabsProductsContainer</div>,
}))

// Mock ActivitiesCategories (now rendered for travelAndActivities routes)
vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/categories", () => ({
    default: () => <div data-testid="activities-categories">ActivitiesCategories</div>,
}))

import {usePathname} from "next/navigation"
import links from "@/presentation/config/links"

describe("RightPanel", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render HomeTabsProductsContainer when pathname starts with products link", () => {
        vi.mocked(usePathname).mockReturnValue(links.products)
        
        render(<RightPanel />)
        
        expect(screen.getByTestId("home-tabs-products-container")).toBeInTheDocument()
    })

    it("should render ActivitiesCategories when pathname starts with travelAndActivities link", () => {
        vi.mocked(usePathname).mockReturnValue(links.travelAndActivities)
        
        render(<RightPanel />)
        
        expect(screen.getByTestId("activities-categories")).toBeInTheDocument()
    })

    it("should render null when pathname does not match any conditions", () => {
        vi.mocked(usePathname).mockReturnValue("/some-other-path")
        
        const {container} = render(<RightPanel />)
        
        expect(container.firstChild).toBeNull()
    })

    it("should render HomeTabsProductsContainer for nested product routes", () => {
        vi.mocked(usePathname).mockReturnValue(`${links.products}/some-category`)
        
        render(<RightPanel />)
        
        expect(screen.getByTestId("home-tabs-products-container")).toBeInTheDocument()
    })

    it("should render ActivitiesCategories for nested travel routes", () => {
        vi.mocked(usePathname).mockReturnValue(`${links.travelAndActivities}/some-activity`)
        
        render(<RightPanel />)
        
        expect(screen.getByTestId("activities-categories")).toBeInTheDocument()
    })
})
