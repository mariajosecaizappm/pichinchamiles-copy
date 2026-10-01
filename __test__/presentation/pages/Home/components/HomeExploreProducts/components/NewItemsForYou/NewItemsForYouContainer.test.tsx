import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { CampaignStatus, CampaignType, ProductsCampaignBanner } from "@/domain/entity/Campaign/campaign"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"
import { ProductType } from "@/domain/entity/Product/product"
import { AlgoliaSearchEngine, SearchEngineType } from "@/domain/entity/SearchEngine/structure/SearchEngine"
import GetExploreProductsContentUseCase from "@/domain/interactors/Home/UseYourMiles/Products/GetExploreProductsContentUseCase"
import container from "@/presentation/config/inversify.config"

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

vi.mock("@/presentation/pages/Home/components/HomeExploreProducts/components/NewItemsForYou/NewItemsForYou", () => ({
    default: ({ campaings }: { campaings: ProductsCampaignBanner[] }) => (
        <div data-testid="new-items-for-you">
            <div data-testid="campaigns-count">{campaings.length}</div>
            {campaings.map((campaign) => (
                <span key={campaign.campaign.id} data-testid={`campaign-${campaign.campaign.id}`}>
                    {campaign.campaign.mainTitle}
                </span>
            ))}
        </div>
    ),
}))

vi.mock("@/presentation/pages/Home/components/HomeExploreProducts/components/NewItemsForYou/NewItemsForYouSkeleton", () => ({
    default: () => <div data-testid="new-items-for-you-skeleton">Loading</div>,
}))

vi.mock("@/presentation/config/links", () => ({
    default: { offers: "offers" },
}))

import NeItemsForYouContainer from "@/presentation/pages/Home/components/HomeExploreProducts/components/NewItemsForYou/NewItemsForYouContainer"

const mockCampaigns: ProductsCampaignBanner[] = [
    {
        banner: {
            id: "banner-1",
            title: "Banner 1",
            subtitle: "",
            description: "",
            summary: "",
            link: "/campaign-1",
            linkText: "Ver más",
            textColor: "",
            isOutstanding: false,
            segmentCodes: [],
            positions: [MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_NEW_ITEMS_FOR_YOU],
            priority: 1,
            image: { desktopUrl: "/banner1.jpg", mobileUrl: "/banner1-mobile.jpg" },
            campaignId: ""
        },
        campaign: {
            id: "campaign-1",
            isOutstanding: false,
            positions: [MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_NEW_ITEMS_FOR_YOU],
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
            priorityProducts: []
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
        }]
    }
]

describe("NeItemsForYouContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render NewItemsForYou when getNewProducts succeeds", async () => {
        const getNewProducts = vi.fn().mockResolvedValue(mockCampaigns)
        vi.mocked(container.get).mockReturnValue({ getNewProducts } as unknown as GetExploreProductsContentUseCase)

        render(await NeItemsForYouContainer())

        expect(screen.getByTestId("new-items-for-you")).toBeInTheDocument()
        expect(screen.getByTestId("campaigns-count")).toHaveTextContent("1")
        expect(screen.getByText("Campaign 1")).toBeInTheDocument()
    })

    it("should render NewItemsForYouSkeleton when getNewProducts fails", async () => {
        const getNewProducts = vi.fn().mockRejectedValue(new Error("fail"))
        vi.mocked(container.get).mockReturnValue({ getNewProducts } as unknown as GetExploreProductsContentUseCase)

        render(await NeItemsForYouContainer())

        expect(screen.getByTestId("new-items-for-you-skeleton")).toBeInTheDocument()
    })

    it("should render NewItemsForYou with empty campaigns when getNewProducts returns empty data", async () => {
        const getNewProducts = vi.fn().mockResolvedValue([])
        vi.mocked(container.get).mockReturnValue({ getNewProducts } as unknown as GetExploreProductsContentUseCase)

        render(await NeItemsForYouContainer())

        expect(screen.getByTestId("new-items-for-you")).toBeInTheDocument()
        expect(screen.getByTestId("campaigns-count")).toHaveTextContent("0")
        expect(screen.queryByText("Campaign 1")).not.toBeInTheDocument()
    })

    it("should call getNewProducts", async () => {
        const getNewProducts = vi.fn().mockResolvedValue([])
        vi.mocked(container.get).mockReturnValue({ getNewProducts } as unknown as GetExploreProductsContentUseCase)

        await NeItemsForYouContainer()

        expect(getNewProducts).toHaveBeenCalledTimes(1)
    })
})
