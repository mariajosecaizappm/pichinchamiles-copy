import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Banner } from "@/domain/entity/Banner/banner"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"

vi.mock("react-responsive-carousel/lib/styles/carousel.min.css", () => ({}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
}))


vi.mock("@/presentation/pages/Home/UseYourMiles/Products/Banners/MarketingBanners", () => ({
    default: ({ banners }: { banners: Banner[] }) => (
        <div data-testid="marketing-banners">
            {banners.map(banner => (
                <div key={banner.id} data-testid={`banner-${banner.id}`}>
                    {banner.title}
                </div>
            ))}
        </div>
    ),
}))

import BodyBanners from "@/presentation/pages/Home/components/HomeExploreProducts/components/BodyBanners/BodyBanners"

const mockBanners: Banner[] = [
    {
        id: "banner-1",
        title: "Test Banner 1",
        subtitle: "Subtitle 1",
        description: "Description 1",
        summary: "Summary 1",
        link: "/link1",
        linkText: "Click 1",
        textColor: "#FFF",
        isOutstanding: true,
        segmentCodes: [],
        positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_SLIDER],
        priority: 1,
        image: { desktopUrl: "https://example.com/d1.jpg", mobileUrl: "https://example.com/m1.jpg" },
        campaignId: ""
    },
    {
        id: "banner-2",
        title: "Test Banner 2",
        subtitle: "Subtitle 2",
        description: "Description 2",
        summary: "Summary 2",
        link: "/link2",
        linkText: "Click 2",
        textColor: "#000",
        isOutstanding: false,
        segmentCodes: [],
        positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_SLIDER],
        priority: 2,
        image: { desktopUrl: "https://example.com/d2.jpg", mobileUrl: "https://example.com/m2.jpg" },
        campaignId: ""
    },
]

describe("BodyBanners", () => {
    it("should render marketing banners component", () => {
        render(<BodyBanners banners={mockBanners} />)
        
        expect(screen.getByText("Test Banner 1")).toBeInTheDocument()
    })

    it("should render all banners", () => {
        render(<BodyBanners banners={mockBanners} />)
        
        expect(screen.getByText("Test Banner 1")).toBeInTheDocument()
        expect(screen.getByText("Test Banner 2")).toBeInTheDocument()
        expect(screen.getByText("Test Banner 1")).toBeInTheDocument()
        expect(screen.getByText("Test Banner 2")).toBeInTheDocument()
    })

    it("should render with correct container classes", () => {
        const { container } = render(<BodyBanners banners={mockBanners} />)
        
        const wrapper = container.firstChild as HTMLElement
        expect(wrapper).
            toHaveClass("py-6", "px-6", "lg:px-11.75", "w-full")
    })

    it("should render empty state when no banners", () => {
        render(<BodyBanners banners={[]} />)
        
        expect(screen.queryByText("Test Banner 1")).not.toBeInTheDocument()
    })
})
