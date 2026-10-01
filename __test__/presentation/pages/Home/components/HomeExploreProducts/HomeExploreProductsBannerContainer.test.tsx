import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { Banner } from "@/domain/entity/Banner/banner"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"
import GetExploreProductsContentUseCase from "@/domain/interactors/Home/UseYourMiles/Products/GetExploreProductsContentUseCase"
import container from "@/presentation/config/inversify.config"

const mockUseSession = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: { get: vi.fn() },
}))

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/HeroCarousel/HeroBannersCarouselSkeleton", () => ({
    default: () => <div data-testid="skeleton">Skeleton</div>,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/HeroCarousel/HeroBannerItem", () => ({
    default: () => <div data-testid="hero-banner-item">Hero Banner Item</div>,
}))

vi.mock("@/presentation/pages/Home/components/HomeBannerCarousel/components/BannerCarousel", () => ({
    default: ({ banners }: { banners: Banner[] }) => (
        <div data-testid="hero-carousel">{banners[0]?.title ?? "empty"}</div>
    ),
}))

import HomeExploreProductsBannerContainer from "@/presentation/pages/Home/UseYourMiles/Products/HeroCarousel/HeroProductsCarouselContainer"

const mockBanners: Banner[] = [
    {
        id: "banner-1",
        campaignId: "campaign-1",
        title: "Test Banner",
        subtitle: "Subtitle",
        description: "Desc",
        summary: "Summary",
        link: "/link",
        linkText: "Click",
        textColor: "#FFF",
        isOutstanding: true,
        segmentCodes: [],
        positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_SLIDER],
        priority: 1,
        image: { desktopUrl: "https://example.com/d.jpg", mobileUrl: "https://example.com/m.jpg" },
    },
]

describe("HomeExploreProductsBannerContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseSession.mockReturnValue({ isLogged: false })
    })

    it("should render banners when getBanners succeeds", async () => {
        const getBanners = vi.fn().mockResolvedValue({ data: mockBanners })
        vi.mocked(container.get).mockReturnValue({ getBanners } as unknown as GetExploreProductsContentUseCase)

        render(await HomeExploreProductsBannerContainer())

        expect(screen.getByTestId("hero-carousel")).toHaveTextContent("Test Banner")
    })

    it("should render skeleton when getBanners fails", async () => {
        const getBanners = vi.fn().mockRejectedValue(new Error("fail"))
        vi.mocked(container.get).mockReturnValue({ getBanners } as unknown as GetExploreProductsContentUseCase)

        render(await HomeExploreProductsBannerContainer())

        expect(screen.getByTestId("skeleton")).toBeInTheDocument()
    })

    it("should call getBanners", async () => {
        const getBanners = vi.fn().mockResolvedValue({ data: [] })
        vi.mocked(container.get).mockReturnValue({ getBanners } as unknown as GetExploreProductsContentUseCase)

        await HomeExploreProductsBannerContainer()

        expect(getBanners).toHaveBeenCalledTimes(1)
    })
})
