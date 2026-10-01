import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { CampaignType, CampaignStatus, ProductsCampaignBanner } from "@/domain/entity/Campaign/campaign"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"
import { ProductType } from "@/domain/entity/Product/product"
import { AlgoliaSearchEngine, SearchEngineType } from "@/domain/entity/SearchEngine/structure/SearchEngine"

vi.mock("react-responsive-carousel/lib/styles/carousel.min.css", () => ({}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

// Mock window.matchMedia for useIsDesktop hook
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    })),
})

vi.mock("@/presentation/components/Tabs/Tabs", () => ({
    default: ({ items }: { items: { id: string; label: string; content: React.ReactNode }[] }) => (
        <div data-testid="tabs">
            {items.map(item => (
                <div key={item.id} data-testid={`tab-${item.id}`}>
                    <span data-testid="label">{item.label}</span>
                    {item.content}
                </div>
            ))}
        </div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Sections/OffersShowcase/OfferShowcaseTabContent", () => ({
    default: ({ campaign, showBanner }: { campaign: ProductsCampaignBanner; showBanner?: boolean }) => (
        <div data-testid={`tab-content-${campaign.campaign.id}`}>
            <div data-testid="show-banner">{String(showBanner)}</div>
            <div data-testid={`products-count-${campaign.campaign.id}`}>{campaign.products?.length ?? 0}</div>
        </div>
    ),
}))

vi.mock("@/presentation/config/links", () => ({
    default: {
        offers: "offers"
    }
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({ isLogged: false }),
}))

import NeItemsForYou from "@/presentation/pages/Home/components/HomeExploreProducts/components/NewItemsForYou/NewItemsForYou"

const mockCampaigns: ProductsCampaignBanner[] = [
    {
        banner: {
            id: "banner-1",
            title: "Banner Title",
            subtitle: "",
            description: "",
            summary: "",
            link: "/ofertas-campaign-1",
            linkText: "Explorar ofertas",
            textColor: "",
            isOutstanding: false,
            segmentCodes: [],
            positions: [MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_NEW_ITEMS_FOR_YOU],
            priority: 1,
            image: { desktopUrl: "/banner-desktop.jpg", mobileUrl: "/banner-mobile.jpg" },
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
            productIds: ["product-1", "product-2"],
            priorityProducts: []
        },
        products: [
            {
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
                assets: [{ id: "asset-1", type: "image" as const, order: 1, desktopUrl: "/image1.jpg", mobileUrl: "/image1-mobile.jpg" }],
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
            },
            {
                id: "product-2",
                name: "Product 2",
                slug: "product-2",
                keywords: "",
                seoTitle: "",
                seoKeywords: "",
                seoDescription: "",
                description: "",
                summary: "",
                brand: { id: "brand-2", name: "Brand 2" },
                categories: [],
                minPrice: 0,
                recommended: false,
                segmentCodes: [],
                store: { id: "store-2", name: "Store 2" },
                supplierId: "",
                priority: 2,
                maxPrice: 0,
                minPointsPrice: 25000,
                maxPointsPrice: 30000,
                unitPointsPriceWithoutDiscount: 0,
                assets: [{ id: "asset-2", type: "image" as const, order: 1, desktopUrl: "/image2.jpg", mobileUrl: "/image2-mobile.jpg" }],
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
            }
        ]
    },
    {
        banner: {
            id: "banner-2",
            title: "Banner Title 2",
            subtitle: "",
            description: "",
            summary: "",
            link: "/ofertas-campaign-2",
            linkText: "Ver catálogo",
            textColor: "",
            isOutstanding: false,
            segmentCodes: [],
            positions: [MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_NEW_ITEMS_FOR_YOU],
            priority: 2,
            image: { desktopUrl: "/banner-desktop-2.jpg", mobileUrl: "/banner-mobile-2.jpg" },
            campaignId: ""
        },
        campaign: {
            id: "campaign-2",
            isOutstanding: false,
            positions: [MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_NEW_ITEMS_FOR_YOU],
            segmentCodes: [],
            slug: "campaign-2",
            mainTitle: "Campaign 2",
            hasLanding: true,
            image: { desktopUrl: "", mobileUrl: "" },
            numberElementsSlide: 4,
            order: 2,
            status: CampaignStatus.ACTIVE,
            priority: 2,
            campaignType: CampaignType.PRODUCTS,
            categories: [],
            productIds: ["product-3"],
            priorityProducts: []
        },
        products: [
            {
                id: "product-3",
                name: "Product 3",
                slug: "product-3",
                keywords: "",
                seoTitle: "",
                seoKeywords: "",
                seoDescription: "",
                description: "",
                summary: "",
                brand: { id: "brand-3", name: "Brand 3" },
                categories: [],
                minPrice: 0,
                recommended: false,
                segmentCodes: [],
                store: { id: "store-3", name: "Store 3" },
                supplierId: "",
                priority: 3,
                maxPrice: 0,
                minPointsPrice: 35000,
                maxPointsPrice: 40000,
                unitPointsPriceWithoutDiscount: 0,
                assets: [{ id: "asset-3", type: "image" as const, order: 1, desktopUrl: "/image3.jpg", mobileUrl: "/image3-mobile.jpg" }],
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
            }
        ]
    }
]

describe("NeItemsForYou", () => {
    it("should render OffersShowcase with title", () => {
        render(<NeItemsForYou campaings={mockCampaigns} />)

        expect(screen.getByText("Novedades para ti")).toBeInTheDocument()
    })

    it("should render tabs for each campaign", () => {
        render(<NeItemsForYou campaings={mockCampaigns} />)
        
        expect(screen.getByText("Campaign 1")).toBeInTheDocument()
        expect(screen.getByText("Campaign 2")).toBeInTheDocument()
    })

    it("should show correct product count for each tab", () => {
        render(<NeItemsForYou campaings={mockCampaigns} />)

        expect(screen.getByTestId("products-count-campaign-1")).toHaveTextContent("2")
        expect(screen.getByTestId("products-count-campaign-2")).toHaveTextContent("1")
    })

    it("should render nothing when no campaigns", () => {
        const { container } = render(<NeItemsForYou campaings={[]} />)

        expect(container.firstChild).toBeNull()
    })
})
