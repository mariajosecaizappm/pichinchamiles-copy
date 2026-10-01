import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import {MarketingPositions} from "@/domain/entity/Marketing/marketing"
import type {Banner} from "@/domain/entity/Banner/banner"

vi.mock("@/presentation/pages/Home/components/HomeRedemptionCategories/components/HomeRedemptionCategoryItemCard", () => ({
    default: ({redemptionCategory}: {redemptionCategory: Banner}) => (
        <div data-testid="item-card">{redemptionCategory.title}</div>
    ),
}))

vi.mock("@/presentation/pages/Home/components/HomeRedemptionCategories/components/MobileCarouselHomeRedeptionCategories", () => ({
    default: () => <div data-testid="mobile-carousel">MobileCarousel</div>,
}))

import HomeRedemptionsCategories from "@/presentation/pages/Home/components/HomeRedemptionCategories/HomeRedemptionCategories"

const mockCategories: Banner[] = [
    {
        id: "cat-1",
        campaignId: "campaign-1",
        title: "Productos",
        subtitle: "Sub",
        description: "Desc",
        summary: "Summary",
        link: "/productos",
        linkText: "Ver productos",
        textColor: "#000",
        isOutstanding: false,
        segmentCodes: [],
        positions: [MarketingPositions.HOME_NOT_LOGGED_REDEMPTION_CATEGORIES],
        priority: 1,
        image: {desktopUrl: "https://example.com/d.jpg", mobileUrl: "https://example.com/m.jpg"},
    },
    {
        id: "cat-2",
        campaignId: "campaign-2",
        title: "Vuelos",
        subtitle: "Sub",
        description: "Desc",
        summary: "Summary",
        link: "/vuelos",
        linkText: "Buscar vuelos",
        textColor: "#000",
        isOutstanding: false,
        segmentCodes: [],
        positions: [MarketingPositions.HOME_NOT_LOGGED_REDEMPTION_CATEGORIES],
        priority: 2,
        image: {desktopUrl: "https://example.com/d2.jpg", mobileUrl: "https://example.com/m2.jpg"},
    },
]

describe("HomeRedemptionsCategories", () => {
    it("should render the section title", () => {
        render(<HomeRedemptionsCategories redemptionCategories={mockCategories} />)
        expect(screen.getByText("Tu eliges en qué disfrutar tus millas.")).toBeInTheDocument()
    })

    it("should render the section subtitle", () => {
        render(<HomeRedemptionsCategories redemptionCategories={mockCategories} />)
        expect(screen.getByText("Explora y elige la opción ideal para ti.")).toBeInTheDocument()
    })

    it("should render item cards for each category", () => {
        render(<HomeRedemptionsCategories redemptionCategories={mockCategories} />)
        expect(screen.getAllByTestId("item-card")).toHaveLength(2)
    })

    it("should render the mobile carousel", () => {
        render(<HomeRedemptionsCategories redemptionCategories={mockCategories} />)
        expect(screen.getByTestId("mobile-carousel")).toBeInTheDocument()
    })

    it("should use semantic section element with proper ARIA attributes", () => {
        render(<HomeRedemptionsCategories redemptionCategories={mockCategories} />)
        const section = screen.getByRole("region")
        expect(section).toBeInTheDocument()
        expect(section).toHaveAttribute("aria-labelledby", "redemption-categories-title")
    })

    it("should have proper heading structure", () => {
        render(<HomeRedemptionsCategories redemptionCategories={mockCategories} />)
        const heading = screen.getByRole("heading", { name: "Tu eliges en qué disfrutar tus millas." })
        expect(heading).toBeInTheDocument()
        expect(heading).toHaveAttribute("id", "redemption-categories-title")
    })

    it("should render categories as list items", () => {
        render(<HomeRedemptionsCategories redemptionCategories={mockCategories} />)
        const list = screen.getByRole("list")
        expect(list).toBeInTheDocument()
        
        const listItems = screen.getAllByRole("listitem")
        expect(listItems).toHaveLength(2)
    })

    it("should be accessible by screen readers", () => {
        render(<HomeRedemptionsCategories redemptionCategories={mockCategories} />)
        
        // Check that all important elements are accessible
        expect(screen.getByRole("region")).toBeInTheDocument()
        expect(screen.getByRole("heading", { name: "Tu eliges en qué disfrutar tus millas." })).toBeInTheDocument()
        expect(screen.getByRole("list")).toBeInTheDocument()
    })
})
