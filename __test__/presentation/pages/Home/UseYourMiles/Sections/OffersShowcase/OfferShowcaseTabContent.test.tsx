import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { CampaignStatus, CampaignType, ProductsCampaignBanner, ExperienceCampaignBanner, CampaignBanner } from "@/domain/entity/Campaign/campaign"
import { Product, ProductType } from "@/domain/entity/Product/product"
import { CampaignExperience } from "@/domain/entity/Campaign/campaign"

const mockUseIsDesktop = vi.fn()
const mockUseScrollMenuSlideTracker = vi.fn()

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: () => mockUseIsDesktop(),
}))

vi.mock("@/presentation/hooks/useScrollMenuSlideTracker", () => ({
    useScrollMenuSlideTracker: () => mockUseScrollMenuSlideTracker(),
}))

type SectionBannerProps = {
    title: string
    buttonText?: string
    linkButton?: string
    backgroundImage?: { desktopUrl?: string; mobileUrl?: string }
    className?: string
    buttonClassName?: string
    typeButton?: string
}

vi.mock("@/presentation/components/Banner/SectionBanner", () => ({
    SectionBanner: ({ title, buttonText, linkButton, backgroundImage, className, buttonClassName, typeButton }: SectionBannerProps) => (
        <div
            data-testid="section-banner"
            data-title={title}
            data-buttontext={buttonText}
            data-link={linkButton}
            data-classname={className}
            data-buttonclassname={buttonClassName}
            data-typebutton={typeButton}
        >
            <div data-testid="section-banner-image">{backgroundImage?.desktopUrl}</div>
        </div>
    ),
}))

type CardsSliderWrapperProps = {
    items: CampaignExperience[]
    renderItem: (item: CampaignExperience) => React.ReactNode
    showLeftArrow?: boolean
    showRightArrow?: boolean
    arrowClassName?: string
    onScroll: () => void
    className?: string
}

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/CardsSliderWrapper/CardsSliderWrapper", () => ({
    default: ({ items, renderItem, showLeftArrow, showRightArrow, arrowClassName, onScroll, className }: CardsSliderWrapperProps) => (
        <div
            data-testid="cards-slider"
            data-items={items.length}
            data-showleftarrow={String(showLeftArrow)}
            data-showrightarrow={String(showRightArrow)}
            data-arrowclassname={arrowClassName}
            data-classname={className}
        >
            {items.map((item, i) => <div key={i} data-testid="slider-item">{renderItem(item)}</div>)}
            <div data-testid="on-scroll-handler" onClick={onScroll}>Scroll</div>
        </div>
    ),
}))

type ExperienceItemCardProps = {
    title?: string
    address?: string
    points?: number
    asset?: { desktopUrl?: string; mobileUrl?: string }
    href?: string
}

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/ExperienceItemCard", () => ({
    default: ({ title, address, points, asset, href }: ExperienceItemCardProps) => (
        <div
            data-testid="experience-item-card"
            data-title={title}
            data-address={address}
            data-points={points}
            data-href={href}
            data-asset-desktop={asset?.desktopUrl}
            data-asset-mobile={asset?.mobileUrl}
        >
            {asset?.desktopUrl}
        </div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCard", () => ({
    default: ({ product }: { product: Product }) => (
        <div data-testid="product-card">{product.name}</div>
    ),
}))

vi.mock("@/presentation/components/Campaigns/CampaignSlider/CampaignSliderConfig", () => ({
    getCampaignHref: () => "/campaign-link",
    isExperienceOffer: (campaign: CampaignBanner) => campaign.campaign.campaignType === CampaignType.EXPERIENCES,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/TravelDeals/helpers", () => ({
    getCampaignExperienceCardImage: (imageUrl: string) => imageUrl,
}))

vi.mock("@heroui/react", () => ({
    cn: (...args: (string | boolean | undefined)[]) => args.filter(Boolean).join(" "),
}))

import OfferShowcaseTabContent from "@/presentation/pages/Home/UseYourMiles/Sections/OffersShowcase/OfferShowcaseTabContent"

const baseProduct: Product = {
    id: "p1",
    name: "Product 1",
    slug: "product-1",
    description: "",
    brand: { id: "b1", name: "Brand" },
    categories: [],
    minPrice: 100,
    recommended: false,
    segmentCodes: [],
    store: { id: "s1", name: "Store" },
    supplierId: "sup1",
    priority: 1,
    maxPrice: 200,
    minPointsPrice: 1000,
    maxPointsPrice: 2000,
    assets: [],
    features: [],
    mostWanted: false,
    productType: ProductType.PHYSICAL_PRODUCT,
    searchEngine: {} as never,
    unitPointsPriceWithoutDiscount: 1500,
}

const baseExperience: CampaignExperience = {
    name: "Spa",
    slug: "spa",
    address: "Calle 1",
    experience: "Relax",
    description: "",
    pointsAmount: 1000,
    url: "/spa",
    type: "national" as never,
    image: { desktopUrl: "https://example.com/spa.jpg", mobileUrl: "https://example.com/spa-m.jpg" },
    validTo: new Date(),
}

const buildProductCampaign = (overrides: Partial<ProductsCampaignBanner> = {}): ProductsCampaignBanner => ({
    banner: {
        id: "banner-1",
        title: "Product Banner",
        subtitle: "",
        description: "",
        summary: "",
        link: "/products",
        linkText: "Ver productos",
        textColor: "",
        isOutstanding: false,
        segmentCodes: [],
        positions: [],
        priority: 1,
        image: { desktopUrl: "https://example.com/pd.jpg", mobileUrl: "https://example.com/pm.jpg" },
        campaignId: "c-1",
    },
    campaign: {
        id: "c-1",
        mainTitle: "Products Campaign",
        slug: "products-campaign",
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
        productIds: ["p1"],
        priorityProducts: [],
    },
    products: [baseProduct],
    ...overrides,
})

const buildExperienceCampaign = (overrides: Partial<ExperienceCampaignBanner> = {}): ExperienceCampaignBanner => ({
    banner: {
        id: "banner-2",
        title: "Experience Banner",
        subtitle: "",
        description: "",
        summary: "",
        link: "/experiences",
        linkText: "Ver experiencias",
        textColor: "",
        isOutstanding: false,
        segmentCodes: [],
        positions: [],
        priority: 1,
        image: { desktopUrl: "https://example.com/ed.jpg", mobileUrl: "https://example.com/em.jpg" },
        campaignId: "c-2",
    },
    campaign: {
        id: "c-2",
        mainTitle: "Experiences Campaign",
        slug: "experiences-campaign",
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
    experiences: [baseExperience],
    ...overrides,
})

describe("OfferShowcaseTabContent", () => {
    beforeEach(() => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: false })
        mockUseScrollMenuSlideTracker.mockReturnValue({
            canScrollLeft: false,
            canScrollRight: false,
            handleUpdate: vi.fn(),
        })
    })

    it("should render the section banner for a product campaign", () => {
        render(<OfferShowcaseTabContent campaign={buildProductCampaign()} />)
        const banner = screen.getByTestId("section-banner")
        expect(banner).toHaveAttribute("data-title", "Product Banner")
        expect(banner).toHaveAttribute("data-buttontext", "Ver productos")
        expect(banner).toHaveAttribute("data-link", "/campaign-link")
    })

    it("should hide the section banner when showBanner is false", () => {
        render(<OfferShowcaseTabContent campaign={buildProductCampaign()} showBanner={false} />)
        expect(screen.queryByTestId("section-banner")).not.toBeInTheDocument()
    })

    it("should hide the section banner when campaign has no banner", () => {
        const campaign = buildProductCampaign()
        campaign.banner = undefined as never
        render(<OfferShowcaseTabContent campaign={campaign} />)
        expect(screen.queryByTestId("section-banner")).not.toBeInTheDocument()
    })

    it("should render CardsSliderWrapper for a product campaign", () => {
        render(<OfferShowcaseTabContent campaign={buildProductCampaign()} />)
        expect(screen.getByTestId("cards-slider")).toBeInTheDocument()
        expect(screen.getByTestId("cards-slider")).toHaveAttribute("data-items", "1")
    })

    it("should render CardsSliderWrapper for an experience campaign", () => {
        render(<OfferShowcaseTabContent campaign={buildExperienceCampaign()} />)
        expect(screen.getByTestId("cards-slider")).toBeInTheDocument()
        expect(screen.getAllByTestId("slider-item")).toHaveLength(1)
    })

    it("should pass experience data to ExperienceItemCard", () => {
        render(<OfferShowcaseTabContent campaign={buildExperienceCampaign()} />)
        const card = screen.getByTestId("experience-item-card")
        expect(card).toHaveAttribute("data-title", "Spa")
        expect(card).toHaveAttribute("data-address", "Calle 1")
    })

    it("should not show carousel arrows on mobile", () => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: false })
        render(<OfferShowcaseTabContent campaign={buildExperienceCampaign()} />)
        const slider = screen.getByTestId("cards-slider")
        expect(slider).toHaveAttribute("data-showleftarrow", "false")
        expect(slider).toHaveAttribute("data-showrightarrow", "false")
    })

    it("should show left arrow on desktop when there are items to the left", () => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: true })
        mockUseScrollMenuSlideTracker.mockReturnValue({ canScrollLeft: true, canScrollRight: false, handleUpdate: vi.fn() })
        render(<OfferShowcaseTabContent campaign={buildExperienceCampaign()} />)
        expect(screen.getByTestId("cards-slider")).toHaveAttribute("data-showleftarrow", "true")
    })

    it("should show right arrow on desktop when there are items to the right", () => {
        const campaign = buildExperienceCampaign()
        campaign.experiences = [baseExperience, baseExperience, baseExperience]
        mockUseIsDesktop.mockReturnValue({ isDesktop: true })
        mockUseScrollMenuSlideTracker.mockReturnValue({ canScrollLeft: false, canScrollRight: true, handleUpdate: vi.fn() })
        render(<OfferShowcaseTabContent campaign={campaign} />)
        expect(screen.getByTestId("cards-slider")).toHaveAttribute("data-showrightarrow", "true")
    })

    it("should not show right arrow when there are no items to the right", () => {
        const campaign = buildExperienceCampaign()
        campaign.experiences = [baseExperience]
        mockUseIsDesktop.mockReturnValue({ isDesktop: true })
        mockUseScrollMenuSlideTracker.mockReturnValue({ canScrollLeft: false, canScrollRight: false, handleUpdate: vi.fn() })
        render(<OfferShowcaseTabContent campaign={campaign} />)
        expect(screen.getByTestId("cards-slider")).toHaveAttribute("data-showrightarrow", "false")
    })

    it("should pass the scroll handler to CardsSliderWrapper", () => {
        const handleUpdate = vi.fn()
        mockUseScrollMenuSlideTracker.mockReturnValue({ canScrollLeft: false, canScrollRight: true, handleUpdate })
        render(<OfferShowcaseTabContent campaign={buildExperienceCampaign()} />)
        screen.getByTestId("on-scroll-handler").click()
        expect(handleUpdate).toHaveBeenCalled()
    })

    it("should pass showArrows to CardsSliderWrapper based on desktop state", () => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: true })
        mockUseScrollMenuSlideTracker.mockReturnValue({ canScrollLeft: true, canScrollRight: true, handleUpdate: vi.fn() })
        render(<OfferShowcaseTabContent campaign={buildProductCampaign()} />)
        const slider = screen.getByTestId("cards-slider")
        expect(slider).toHaveAttribute("data-showleftarrow", "true")
        expect(slider).toHaveAttribute("data-showrightarrow", "true")
    })

    it("should hide CardsSliderWrapper arrows on mobile", () => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: false })
        mockUseScrollMenuSlideTracker.mockReturnValue({ canScrollLeft: true, canScrollRight: true, handleUpdate: vi.fn() })
        render(<OfferShowcaseTabContent campaign={buildProductCampaign()} />)
        const slider = screen.getByTestId("cards-slider")
        expect(slider).toHaveAttribute("data-showleftarrow", "false")
        expect(slider).toHaveAttribute("data-showrightarrow", "false")
    })

    it("should pass className to CardsSliderWrapper", () => {
        render(<OfferShowcaseTabContent campaign={buildProductCampaign()} />)
        const slider = screen.getByTestId("cards-slider")
        expect(slider).toHaveAttribute("data-classname", "px-6 lg:overflow-x-auto md:px-0")
    })

    it("should hide left arrow on desktop when there are no items to the left", () => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: true })
        mockUseScrollMenuSlideTracker.mockReturnValue({ canScrollLeft: false, canScrollRight: true, handleUpdate: vi.fn() })
        render(<OfferShowcaseTabContent campaign={buildExperienceCampaign()} />)
        expect(screen.getByTestId("cards-slider")).toHaveAttribute("data-showleftarrow", "false")
    })

    it("should hide right arrow on desktop when there are no items to the right", () => {
        const campaign = buildExperienceCampaign()
        campaign.experiences = [baseExperience, baseExperience, baseExperience]
        mockUseIsDesktop.mockReturnValue({ isDesktop: true })
        mockUseScrollMenuSlideTracker.mockReturnValue({ canScrollLeft: true, canScrollRight: false, handleUpdate: vi.fn() })
        render(<OfferShowcaseTabContent campaign={campaign} />)
        expect(screen.getByTestId("cards-slider")).toHaveAttribute("data-showrightarrow", "false")
    })

    it("should pass mobile and desktop URLs to ExperienceItemCard", () => {
        render(<OfferShowcaseTabContent campaign={buildExperienceCampaign()} />)
        const card = screen.getByTestId("experience-item-card")
        expect(card).toHaveAttribute("data-asset-desktop", "https://example.com/spa.jpg")
        expect(card).toHaveAttribute("data-asset-mobile", "https://example.com/spa-m.jpg")
    })

    it("should pass points and href to ExperienceItemCard", () => {
        render(<OfferShowcaseTabContent campaign={buildExperienceCampaign()} />)
        const card = screen.getByTestId("experience-item-card")
        expect(card).toHaveAttribute("data-points", "1000")
        expect(card).toHaveAttribute("data-href", "/spa")
    })

    it("should render a ProductCard for each product", () => {
        render(<OfferShowcaseTabContent campaign={buildProductCampaign()} />)
        expect(screen.getByTestId("product-card")).toHaveTextContent("Product 1")
    })

    it("should pass className to CardsSliderWrapper", () => {
        render(<OfferShowcaseTabContent campaign={buildExperienceCampaign()} />)
        expect(screen.getByTestId("cards-slider")).toHaveAttribute("data-classname", "px-6 lg:overflow-x-auto md:px-0")
    })
})
