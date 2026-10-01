import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, afterEach } from "vitest"
import { CampaignStatus, CampaignType, CampaignBanner, ProductsCampaignBanner, ExperienceCampaignBanner } from "@/domain/entity/Campaign/campaign"
import { ProductType } from "@/domain/entity/Product/product"
import { AlgoliaSearchEngine, SearchEngineType } from "@/domain/entity/SearchEngine/structure/SearchEngine"

const mocks = vi.hoisted(() => {
    const tabContentProps: { campaign: CampaignBanner; showBanner?: boolean }[] = []
    const tabsItems: { id: string; label: string; content: React.ReactNode }[][] = []
    return { tabContentProps, tabsItems }
})

type TabItem = { id: string; label: string; content: React.ReactNode }

type TabsProps = {
    items: TabItem[]
    onTabChange?: (tabId: string) => void
    classNames?: Record<string, string>
}

vi.mock("@/presentation/components/Tabs/Tabs", () => ({
    default: ({ items, onTabChange, classNames }: TabsProps) => {
        mocks.tabsItems.push(items)
        return (
            <div data-testid="tabs" data-classnames={JSON.stringify(classNames)}>
                {items.map((item) => (
                    <div key={item.id} data-testid={`tab-${item.id}`}>
                        <button data-testid={`tab-button-${item.id}`} onClick={() => onTabChange?.(item.id)}>{item.label}</button>
                        <div data-testid={`tab-content-${item.id}`}>{item.content}</div>
                    </div>
                ))}
            </div>
        )
    },
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Sections/OffersShowcase/OfferShowcaseTabContent", () => ({
    default: ({ campaign, showBanner }: { campaign: CampaignBanner; showBanner?: boolean }) => {
        mocks.tabContentProps.push({ campaign, showBanner })
        return (
            <div data-testid="offer-tab-content" data-campaign-id={campaign.campaign.id} data-show-banner={String(showBanner)}>
                {campaign.campaign.mainTitle}
            </div>
        )
    },
}))

type ButtonProps = {
    as?: React.ComponentType<{ href?: string; className?: string; children: React.ReactNode; [key: string]: unknown }>
    href?: string
    children: React.ReactNode
    variant?: string
    className?: string
    [key: string]: unknown
}

vi.mock("@/presentation/pages/Home/components/Button", () => ({
    default: ({ as: AsComponent, href, children, variant, className, ...props }: ButtonProps) => {
        if (AsComponent) {
            return (
                <AsComponent href={href ?? ""} data-testid="button" data-variant={variant} className={className} {...props}>
                    {children}
                </AsComponent>
            )
        }
        return (
            <button data-testid="button" data-variant={variant} className={className} {...props}>
                {children}
            </button>
        )
    },
}))

type LinkProps = {
    href: string
    children: React.ReactNode
    className?: string
}

vi.mock("next/link", () => ({
    default: ({ href, children, className }: LinkProps) => (
        <a data-testid="link" href={href} className={className}>{children}</a>
    ),
}))

vi.mock("@/presentation/components/Campaigns/CampaignSlider/CampaignSliderConfig", () => ({
    getCampaignHref: (campaign: CampaignBanner) =>
        campaign.campaign.slug ? `/ofertas/${campaign.campaign.campaignType === CampaignType.EXPERIENCES ? "viajes-y-actividades" : "productos"}/${campaign.campaign.slug}` : "",
}))

import OffersShowcase from "@/presentation/pages/Home/UseYourMiles/Sections/OffersShowcase/OffersShowcase"

const baseProduct = {
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
        objectID: "test-object-id",
    } as AlgoliaSearchEngine,
}

const buildProductCampaign = (id: string, overrides: Partial<ProductsCampaignBanner> = {}): ProductsCampaignBanner => ({
    banner: {
        id: `banner-${id}`,
        title: `Banner ${id}`,
        subtitle: "",
        description: "",
        summary: "",
        link: `/link-${id}`,
        linkText: "Ver más",
        textColor: "",
        isOutstanding: false,
        segmentCodes: [],
        positions: [],
        priority: 1,
        image: { desktopUrl: `/desktop-${id}.jpg`, mobileUrl: `/mobile-${id}.jpg` },
        campaignId: `c-${id}`,
    },
    campaign: {
        id: `c-${id}`,
        mainTitle: `Campaign ${id}`,
        slug: `campaign-${id}`,
        isOutstanding: false,
        positions: [],
        segmentCodes: [],
        hasLanding: true,
        image: { desktopUrl: "", mobileUrl: "" },
        numberElementsSlide: 1,
        order: 1,
        status: CampaignStatus.ACTIVE,
        priority: 1,
        campaignType: CampaignType.PRODUCTS,
        categories: [],
        productIds: [],
        priorityProducts: [],
    },
    products: [baseProduct],
    ...overrides,
})

const buildExperienceCampaign = (id: string, overrides: Partial<ExperienceCampaignBanner> = {}): ExperienceCampaignBanner => ({
    banner: {
        id: `banner-${id}`,
        title: `Banner ${id}`,
        subtitle: "",
        description: "",
        summary: "",
        link: `/link-${id}`,
        linkText: "Ver más",
        textColor: "",
        isOutstanding: false,
        segmentCodes: [],
        positions: [],
        priority: 1,
        image: { desktopUrl: `/desktop-${id}.jpg`, mobileUrl: `/mobile-${id}.jpg` },
        campaignId: `c-${id}`,
    },
    campaign: {
        id: `c-${id}`,
        mainTitle: `Campaign ${id}`,
        slug: `campaign-${id}`,
        isOutstanding: false,
        positions: [],
        segmentCodes: [],
        hasLanding: true,
        image: { desktopUrl: "", mobileUrl: "" },
        numberElementsSlide: 1,
        order: 1,
        status: CampaignStatus.ACTIVE,
        priority: 1,
        campaignType: CampaignType.EXPERIENCES,
        experiences: [],
    },
    experiences: [],
    ...overrides,
})

const campaigns: CampaignBanner[] = [
    buildProductCampaign("1"),
    buildProductCampaign("2"),
]

describe("OffersShowcase", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.tabContentProps.length = 0
        mocks.tabsItems.length = 0
    })

    it("should render the title", () => {
        render(<OffersShowcase title="Ofertas" campaigns={campaigns} />)
        expect(screen.getByText("Ofertas")).toBeInTheDocument()
    })

    it("should render a tab for each campaign", () => {
        render(<OffersShowcase title="Ofertas" campaigns={campaigns} />)
        expect(screen.getByTestId("tab-c-1")).toBeInTheDocument()
        expect(screen.getByTestId("tab-c-2")).toBeInTheDocument()
        expect(screen.getByTestId("tab-button-c-1")).toHaveTextContent("Campaign 1")
        expect(screen.getByTestId("tab-button-c-2")).toHaveTextContent("Campaign 2")
    })

    it("should render OfferShowcaseTabContent for each campaign", () => {
        render(<OffersShowcase title="Ofertas" campaigns={campaigns} />)
        expect(screen.getAllByTestId("offer-tab-content")).toHaveLength(2)
        expect(screen.getByTestId("tab-content-c-1")).toHaveTextContent("Campaign 1")
        expect(screen.getByTestId("tab-content-c-2")).toHaveTextContent("Campaign 2")
    })

    it("should pass showBanner prop to OfferShowcaseTabContent", () => {
        render(<OffersShowcase title="Ofertas" campaigns={campaigns} showBanner={false} />)
        expect(mocks.tabContentProps).toHaveLength(2)
        expect(mocks.tabContentProps[0].showBanner).toBe(false)
        expect(mocks.tabContentProps[1].showBanner).toBe(false)
    })

    it("should render the Ver todo button when active campaign has a href", () => {
        render(<OffersShowcase title="Ofertas" campaigns={campaigns} />)
        expect(screen.getByText("Ver todo")).toBeInTheDocument()
        const link = screen.getByTestId("link")
        expect(link).toHaveAttribute("href", "/ofertas/productos/campaign-1")
    })

    it("should use the correct href for experience campaigns", () => {
        render(<OffersShowcase title="Ofertas" campaigns={[buildExperienceCampaign("1")]} />)
        expect(screen.getByTestId("link")).toHaveAttribute("href", "/ofertas/viajes-y-actividades/campaign-1")
    })

    it("should not render the Ver todo button when no active campaign href is available", () => {
        const campaignWithEmptySlug = buildProductCampaign("1", { campaign: { ...buildProductCampaign("1").campaign, slug: "" } })
        render(<OffersShowcase title="Ofertas" campaigns={[campaignWithEmptySlug]} />)
        expect(screen.queryByText("Ver todo")).not.toBeInTheDocument()
    })

    it("should update active tab and href when a different tab is selected", () => {
        render(<OffersShowcase title="Ofertas" campaigns={campaigns} />)
        fireEvent.click(screen.getByTestId("tab-button-c-2"))
        expect(screen.getByTestId("link")).toHaveAttribute("href", "/ofertas/productos/campaign-2")
    })

    it("should initialize the first campaign as the active tab", () => {
        render(<OffersShowcase title="Ofertas" campaigns={campaigns} />)
        expect(screen.getByTestId("tab-c-1")).toBeInTheDocument()
        expect(mocks.tabsItems[0][0].id).toBe("c-1")
    })

    it("should pass the correct classNames to Tabs", () => {
        render(<OffersShowcase title="Ofertas" campaigns={campaigns} />)
        const tabs = screen.getByTestId("tabs")
        const classNames = JSON.parse(tabs.getAttribute("data-classnames") ?? "{}")
        expect(classNames).toMatchObject({
            tabList: "gap-0 mx-6",
            tab: "px-4 py-2 lg:min-w-[144px] h-12",
            tabContent: "text-sm font-semibold",
            panel: "p-0",
        })
    })

    it("should return null when campaigns is an empty array", () => {
        const { container } = render(<OffersShowcase title="Ofertas" campaigns={[]} />)
        expect(container.firstChild).toBeNull()
    })

    it("should return null when campaigns is undefined", () => {
        const { container } = render(<OffersShowcase title="Ofertas" campaigns={undefined as never} />)
        expect(container.firstChild).toBeNull()
    })

    it("should default showBanner to true when not provided", () => {
        render(<OffersShowcase title="Ofertas" campaigns={campaigns} />)
        expect(mocks.tabContentProps).toHaveLength(2)
        expect(mocks.tabContentProps[0].showBanner).toBe(true)
        expect(mocks.tabContentProps[1].showBanner).toBe(true)
    })

    it("should hide the Ver todo button when switching to a campaign without a slug", () => {
        const campaignWithSlug = buildProductCampaign("1")
        const campaignWithoutSlug = buildProductCampaign("2", { campaign: { ...buildProductCampaign("2").campaign, slug: "" } })
        render(<OffersShowcase title="Ofertas" campaigns={[campaignWithSlug, campaignWithoutSlug]} />)
        expect(screen.getByText("Ver todo")).toBeInTheDocument()
        fireEvent.click(screen.getByTestId("tab-button-c-2"))
        expect(screen.queryByText("Ver todo")).not.toBeInTheDocument()
    })
})
