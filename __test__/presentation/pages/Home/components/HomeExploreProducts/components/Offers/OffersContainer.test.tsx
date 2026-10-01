import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { CampaignStatus, CampaignType, ProductsCampaignBanner } from "@/domain/entity/Campaign/campaign"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"
import { ProductType } from "@/domain/entity/Product/product"
import { AlgoliaSearchEngine, SearchEngineType } from "@/domain/entity/SearchEngine/structure/SearchEngine"

vi.mock("@/presentation/config/inversify.config", () => ({
    default: { get: vi.fn() },
}))

vi.mock("react-responsive-carousel/lib/styles/carousel.min.css", () => ({}))

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

vi.mock("@/presentation/pages/Home/components/HomeExploreProducts/components/Offers/Offers", () => ({
    default: ({ campaings }: { campaings: ProductsCampaignBanner[] }) => {
        if (!campaings || campaings.length === 0) {
            return null
        }
        return (
            <div data-testid="offers">
                <div data-testid="offers-campaigns-count">{campaings.length}</div>
                {campaings.map((campaign) => (
                    <span key={campaign.campaign.id} data-testid={`offers-campaign-${campaign.campaign.id}`}>
                        {campaign.campaign.mainTitle}
                    </span>
                ))}
            </div>
        )
    },
}))

vi.mock("@/presentation/pages/Home/components/HomeExploreProducts/components/Offers/OffersSkeleton", () => ({
    default: () => <div data-testid="offers-skeleton">Loading</div>,
}))

vi.mock("@/presentation/config/links", () => ({
    default: { offers: "offers" },
}))

import OffersContainer from "@/presentation/pages/Home/components/HomeExploreProducts/components/Offers/OffersContainer"
import container from "@/presentation/config/inversify.config"
import GetExploreProductsContentUseCase from "@/domain/interactors/Home/UseYourMiles/Products/GetExploreProductsContentUseCase"

const mockCampaigns: ProductsCampaignBanner[] = [
    {
        banner: {
            id: "banner-1",
            title: "Banner Title",
            subtitle: "",
            description: "",
            summary: "",
            link: "",
            linkText: "",
            textColor: "",
            isOutstanding: false,
            segmentCodes: [],
            positions: [MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS],
            priority: 1,
            image: { desktopUrl: "/banner-desktop.jpg", mobileUrl: "/banner-mobile.jpg" },
            campaignId: "",
        },
        campaign: {
            id: "campaign-1",
            isOutstanding: false,
            positions: [MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS],
            segmentCodes: [],
            slug: "campaign-1",
            mainTitle: "Campaign 1",
            hasLanding: true,
            image: { desktopUrl: "", mobileUrl: "" },
            numberElementsSlide: 4,
            order: 1,
            status: CampaignStatus.ACTIVE,
            priority: 1,
            campaignType: CampaignType.PRODUCTS,
            categories: [],
            productIds: ["product-1"],
            priorityProducts: [],
        },
        products: [{
            id: "product-1",
            name: "Product 1",
            slug: "product-1",
            keywords: "",
            seoTitle: "",
            seoKeywords: "",
            seoDescription: "",
            description: "",
            summary: "",
            brand: { id: "brand-1", name: "Brand 1" },
            categories: [],
            minPrice: 0,
            recommended: false,
            segmentCodes: [],
            store: { id: "store-1", name: "Store 1" },
            supplierId: "",
            priority: 1,
            maxPrice: 0,
            minPointsPrice: 15000,
            maxPointsPrice: 20000,
            unitPointsPriceWithoutDiscount: 0,
            assets: [{ id: "asset-1", type: "image" as const, desktopUrl: "/product1.jpg", mobileUrl: "/product1-mobile.jpg", order: 1 }],
            features: [],
            tags: [],
            mostWanted: false,
            productType: ProductType.PHYSICAL_PRODUCT,
            searchEngine: {
                engine: SearchEngineType.ALGOLIA,
                position: 1,
                index: "test-index",
                queryID: "test-query-id",
                objectID: "test-object-id"
            } as AlgoliaSearchEngine
        }],
    },
]

describe("OffersContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render Offers when getOffers succeeds", async () => {
        const getOffers = vi.fn().mockResolvedValue(mockCampaigns)
        vi.mocked(container.get).mockReturnValue({ getOffers } as unknown as GetExploreProductsContentUseCase)

        render(await OffersContainer())

        expect(screen.getByTestId("offers")).toBeInTheDocument()
        expect(screen.getByTestId("offers-campaigns-count")).toHaveTextContent("1")
        expect(screen.getByText("Campaign 1")).toBeInTheDocument()
    })

    it("should render OffersSkeleton when getOffers fails", async () => {
        const getOffers = vi.fn().mockRejectedValue(new Error("fail"))
        vi.mocked(container.get).mockReturnValue({ getOffers } as unknown as GetExploreProductsContentUseCase)

        render(await OffersContainer())

        expect(screen.getByTestId("offers-skeleton")).toBeInTheDocument()
    })

    it("should render nothing when offers array is empty", async () => {
        const getOffers = vi.fn().mockResolvedValue([])
        vi.mocked(container.get).mockReturnValue({ getOffers } as unknown as GetExploreProductsContentUseCase)

        const { container: renderedContainer } = render(await OffersContainer())

        expect(renderedContainer.firstChild).toBeNull()
    })

    it("should call getOffers with page size", async () => {
        const getOffers = vi.fn().mockResolvedValue([])
        vi.mocked(container.get).mockReturnValue({ getOffers } as unknown as GetExploreProductsContentUseCase)

        await OffersContainer()

        expect(getOffers).toHaveBeenCalledWith(5)
    })
})
