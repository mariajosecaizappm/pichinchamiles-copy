import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"

vi.mock("@/presentation/components/Banner/SectionBanner", () => ({
    SectionBanner: ({ title, buttonText, linkButton, backgroundImage, className }: {
        title: string
        buttonText: string | undefined
        linkButton: string
        backgroundImage: { desktopUrl: string; mobileUrl: string }
        className: string
    }) => (
        <div data-testid="section-banner" className={className}>
            <h1 data-testid="title">{title}</h1>
            <button data-testid="button">{linkButton && buttonText ? buttonText : "Ver más"}</button>
            <a data-testid="link" href={linkButton}></a>
            <div data-testid="background">{backgroundImage.desktopUrl}</div>
        </div>
    ),
}))

import MarketingBanners from "@/presentation/pages/Home/UseYourMiles/Products/Banners/MarketingBanners"

const mockBanners = [
    {
        id: "banner-1",
        title: "First Banner",
        subtitle: "Subtitle 1",
        description: "Description 1",
        summary: "Summary 1",
        link: "/link-1",
        linkText: "Click 1",
        textColor: "#FFF",
        isOutstanding: true,
        segmentCodes: [],
        positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_SLIDER],
        priority: 1,
        image: { desktopUrl: "banner1-desktop.jpg", mobileUrl: "banner1-mobile.jpg" },
        campaignId: ""
    },
    {
        id: "banner-2",
        title: "Second Banner",
        subtitle: "Subtitle 2",
        description: "Description 2",
        summary: "Summary 2",
        link: "/link-2",
        linkText: "Click 2",
        textColor: "#000",
        isOutstanding: false,
        segmentCodes: [],
        positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_SLIDER],
        priority: 2,
        image: { desktopUrl: "banner2-desktop.jpg", mobileUrl: "banner2-mobile.jpg" },
        campaignId: ""
    },
    {
        id: "banner-3",
        title: "Third Banner",
        subtitle: "Subtitle 3",
        description: "Description 3",
        summary: "Summary 3",
        link: "/link-3",
        linkText: undefined,
        textColor: "#333",
        isOutstanding: false,
        segmentCodes: [],
        positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_SLIDER],
        priority: 3,
        image: { desktopUrl: "banner3-desktop.jpg", mobileUrl: "banner3-mobile.jpg" },
        campaignId: ""
    }
]

describe("MarketingBanners", () => {
    it("should render grid with correct classes", () => {
        const { container } = render(<MarketingBanners banners={mockBanners} />)
        
        expect(container.firstChild).toHaveClass("grid", "lg:grid-cols-2", "gap-2.5")
    })

    it("should render all banners", () => {
        render(<MarketingBanners banners={mockBanners} />)
        
        const banners = screen.getAllByTestId("section-banner")
        expect(banners).toHaveLength(3)
        expect(screen.getByText("First Banner")).toBeInTheDocument()
        expect(screen.getByText("Second Banner")).toBeInTheDocument()
        expect(screen.getByText("Third Banner")).toBeInTheDocument()
    })

    it("should apply col-span-2 to first banner", () => {
        render(<MarketingBanners banners={mockBanners} />)
        
        const banners = screen.getAllByTestId("section-banner")
        const firstBannerContainer = banners[0].parentElement
        expect(firstBannerContainer).toHaveClass("lg:col-span-2")
    })

    it("should not apply col-span-2 to subsequent banners", () => {
        render(<MarketingBanners banners={mockBanners} />)
        
        const banners = screen.getAllByTestId("section-banner")
        const secondBannerContainer = banners[1].parentElement
        const thirdBannerContainer = banners[2].parentElement
        expect(secondBannerContainer).not.toHaveClass("lg:col-span-2")
        expect(thirdBannerContainer).not.toHaveClass("lg:col-span-2")
    })

    it("should apply correct height classes", () => {
        render(<MarketingBanners banners={mockBanners} />)
        
        const banners = screen.getAllByTestId("section-banner")
        expect(banners[0]).toHaveClass("w-full", "h-100", "md:h-70")
        expect(banners[0]).not.toHaveClass("lg:h-49")
        expect(banners[1]).toHaveClass("w-full", "h-100", "md:h-70", "lg:h-49")
        expect(banners[2]).toHaveClass("w-full", "h-100", "md:h-70", "lg:h-49")
    })

    it("should pass correct props to SectionBanner", () => {
        render(<MarketingBanners banners={mockBanners} />)
        
        screen.getAllByTestId("section-banner")[0]
        expect(screen.getByText("First Banner")).toBeInTheDocument()
        expect(screen.getByText("Click 1")).toBeInTheDocument()
        const links = screen.getAllByTestId("link")
        expect(links[0]).toHaveAttribute("href", "/link-1")
        const backgrounds = screen.getAllByTestId("background")
        expect(backgrounds[0]).toHaveTextContent("banner1-desktop.jpg")
    })

    it("should use default button text when linkText is empty", () => {
        render(<MarketingBanners banners={mockBanners} />)
        
        expect(screen.getAllByText("Ver más")).toHaveLength(1)
    })

    it("should render nothing when no banners are provided", () => {
        const {container} = render(<MarketingBanners banners={[]} />)
        expect(container.innerHTML).toBe("")
    })
})
