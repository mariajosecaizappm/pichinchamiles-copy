import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { Banner } from "@/domain/entity/Banner/banner"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"
import GetExploreProductsContentUseCase from "@/domain/interactors/Home/UseYourMiles/Products/GetExploreProductsContentUseCase"
import container from "@/presentation/config/inversify.config"

vi.mock("@/presentation/config/inversify.config", () => ({
    default: { get: vi.fn() },
}))

window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
}))

vi.mock("@/presentation/pages/Home/components/HomeExploreProducts/components/BodyBanners/BodyBanners", () => ({
    default: ({ banners }: { banners: Banner[] }) => (
        <div data-testid="body-banners">
            {banners.map(banner => (
                <div key={banner.id}>{banner.title}</div>
            ))}
        </div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/BodyBanners/BodyBannersSkeleton", () => ({
    default: () => <div data-testid="body-banners-skeleton">Loading</div>,
}))

import BodyBannersContainer from "@/presentation/pages/Home/components/HomeExploreProducts/components/BodyBanners/BodyBannersContainer"

const mockBanners: Banner[] = [
    {
        id: "banner-1",
        title: "Test Banner",
        subtitle: "Subtitle",
        description: "Description",
        summary: "Summary",
        link: "/link",
        linkText: "Click",
        textColor: "#FFF",
        isOutstanding: true,
        segmentCodes: [],
        positions: [MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_BODY],
        priority: 1,
        image: { desktopUrl: "https://example.com/d.jpg", mobileUrl: "https://example.com/m.jpg" },
        campaignId: "",
    },
]

describe("BodyBannersContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render BodyBanners when getBodyBanners succeeds", async () => {
        const getBodyBanners = vi.fn().mockResolvedValue({ data: mockBanners })
        vi.mocked(container.get).mockReturnValue({ getBodyBanners } as unknown as GetExploreProductsContentUseCase)

        render(await BodyBannersContainer())

        expect(screen.getByTestId("body-banners")).toBeInTheDocument()
        expect(screen.getByText("Test Banner")).toBeInTheDocument()
    })

    it("should render skeleton when getBodyBanners fails", async () => {
        const getBodyBanners = vi.fn().mockRejectedValue(new Error("fail"))
        vi.mocked(container.get).mockReturnValue({ getBodyBanners } as unknown as GetExploreProductsContentUseCase)

        render(await BodyBannersContainer())

        expect(screen.getByTestId("body-banners-skeleton")).toBeInTheDocument()
    })

    it("should render BodyBanners when getBodyBanners returns empty data", async () => {
        const getBodyBanners = vi.fn().mockResolvedValue({ data: [] })
        vi.mocked(container.get).mockReturnValue({ getBodyBanners } as unknown as GetExploreProductsContentUseCase)

        render(await BodyBannersContainer())

        expect(screen.getByTestId("body-banners")).toBeInTheDocument()
        expect(screen.queryByText("Test Banner")).not.toBeInTheDocument()
    })

    it("should call getBodyBanners", async () => {
        const getBodyBanners = vi.fn().mockResolvedValue({ data: [] })
        vi.mocked(container.get).mockReturnValue({ getBodyBanners } as unknown as GetExploreProductsContentUseCase)

        await BodyBannersContainer()

        expect(getBodyBanners).toHaveBeenCalledTimes(1)
    })
})
