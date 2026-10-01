import { fireEvent, render, screen, within } from "@testing-library/react"
import { beforeEach, describe, it, expect, vi } from "vitest"
import {
    ExperienceCampaignBanner,
    ProductsCampaignBanner,
    CampaignType,
    CampaignStatus,
    CampaignExperienceType,
    CampaignExperience,
} from "@/domain/entity/Campaign/campaign"
import { Product } from "@/domain/entity/Product/product"
import { getCampaignExperienceCardImage } from "@/presentation/pages/Offers/Activities/helpers"
import ExperienceItemCard from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/ExperienceItemCard"
import ProductCard from "@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCard"

const mocks = vi.hoisted(() => ({
    isDesktop: true,
    canScrollLeft: false,
    canScrollRight: false,
    handleUpdate: vi.fn(),
}))

vi.mock("next/link", () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
        <a href={href}>{children}</a>
    ),
}))

vi.mock("@/presentation/pages/Home/components/Button", () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <button data-testid="button">{children}</button>
    ),
}))

vi.mock("@/presentation/components/Banner/SectionBanner", () => ({
    SectionBanner: ({
        title,
        buttonText,
        linkButton,
        backgroundImage,
        className,
        buttonClassName,
        typeButton,
    }: {
        title: string
        buttonText?: string
        linkButton: string
        backgroundImage: { desktopUrl: string; mobileUrl: string }
        className?: string
        buttonClassName?: string
        typeButton?: string
    }) => (
        <div
            data-testid="section-banner"
            data-background={backgroundImage.desktopUrl}
            data-class={className}
            data-button-class={buttonClassName}
            data-type-button={typeButton}
        >
            <span>{title}</span>
            <a href={linkButton}>{buttonText}</a>
        </div>
    ),
}))

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: () => ({ isDesktop: mocks.isDesktop }),
}))

vi.mock("@/presentation/hooks/useScrollMenuSlideTracker", () => ({
    useScrollMenuSlideTracker: () => ({
        canScrollLeft: mocks.canScrollLeft,
        canScrollRight: mocks.canScrollRight,
        handleUpdate: mocks.handleUpdate,
    }),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/CardsSliderWrapper/CardsSliderWrapper", () => ({
    default: ({
        items,
        renderItem,
        showLeftArrow,
        showRightArrow,
        onScroll,
    }: {
        items: unknown[]
        renderItem: (item: unknown) => React.ReactNode
        showLeftArrow?: boolean
        showRightArrow?: boolean
        onScroll?: () => void
    }) => (
        <div
            data-testid="experience-carousel"
            data-left={String(showLeftArrow)}
            data-right={String(showRightArrow)}
        >
            {items.map((item) => (
                <div key={(item as { slug: string }).slug}>{renderItem(item)}</div>
            ))}
            <button type="button" onClick={() => onScroll?.()}>scroll</button>
        </div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCard", () => ({
    default: ({ product }: { product: { name: string } }) => (
        <div data-testid="product-card" data-name={product.name} />
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/ExperienceItemCard", () => ({
    default: ({
        title,
        asset,
    }: {
        title: string
        asset: { desktopUrl: string; mobileUrl: string }
    }) => (
        <div
            data-testid="experience-item"
            data-title={title}
            data-desktop={asset.desktopUrl}
            data-mobile={asset.mobileUrl}
        />
    ),
}))

import CampaignSlider from "@/presentation/components/Campaigns/CampaignSlider/CampaignSlider"

const buildAsset = (item: CampaignExperience) => ({
    desktopUrl: getCampaignExperienceCardImage(item.image.desktopUrl),
    mobileUrl: getCampaignExperienceCardImage(item.image.mobileUrl),
})

const renderExperienceItem = (item: CampaignExperience) => (
    <ExperienceItemCard
        href={item.url}
        asset={buildAsset(item)}
        title={item.name}
        points={Number(item.pointsAmount)}
    />
)

const renderExperienceMobileItem = (item: CampaignExperience, index: number) => (
    <ExperienceItemCard
        key={`${item.name}-${index}`}
        orientation="horizontal"
        href={item.url}
        asset={buildAsset(item)}
        title={item.name}
        points={Number(item.pointsAmount)}
    />
)

const renderProductItem = (item: Product) => <ProductCard product={item} />

const renderProductMobileItem = (item: Product, index: number) => (
    <ProductCard key={`${item.id}-${index}`} product={item} variant="products-page" />
)

const buildExperience = (overrides: Partial<ExperienceCampaignBanner["experiences"][number]> = {}) => ({
    name: "Paris",
    slug: "/paris",
    address: "",
    experience: "20%",
    description: "",
    validTo: new Date(),
    url: "",
    type: CampaignExperienceType.INTERNATIONAL,
    image: { desktopUrl: "https://bucket.s3.us-east-2.amazonaws.com/paris.jpg", mobileUrl: "https://bucket.s3.us-east-1.amazonaws.com/paris-m.jpg" },
    pointsAmount: 20000,
    ...overrides,
})

const mockOffer: ExperienceCampaignBanner = {
    banner: {
        id: "b1",
        title: "Banner Title",
        subtitle: "",
        description: "",
        summary: "",
        link: "/banner",
        linkText: "Ver campaña",
        textColor: "",
        isOutstanding: false,
        segmentCodes: [],
        positions: [],
        priority: 1,
        image: { desktopUrl: "/banner-desktop.jpg", mobileUrl: "/banner-mobile.jpg" },
        campaignId: "c1",
    },
    campaign: {
        id: "c1",
        mainTitle: "Tu próxima aventura",
        slug: "tu-proxima-aventura",
        shortDescription: "Descubre destinos increíbles",
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
    experiences: [buildExperience()],
}

describe("ActivityOffersCampaignSection", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.isDesktop = true
        mocks.canScrollLeft = false
        mocks.canScrollRight = false
    })

    it("should render banner and experience carousel", () => {
        render(<CampaignSlider<CampaignExperience> offer={mockOffer} renderItem={renderExperienceItem} renderMobileItem={renderExperienceMobileItem} />)

        expect(screen.getByTestId("section-banner")).toHaveTextContent("Banner Title")
        expect(screen.getByRole("link", { name: "Ver campaña" })).toHaveAttribute("href", "/ofertas/viajes-y-actividades/tu-proxima-aventura")
        expect(screen.getByTestId("experience-carousel")).toHaveTextContent("scroll")
    })

    it("should not render the campaign title heading nor a 'Ver todo' link", () => {
        render(<CampaignSlider<CampaignExperience> offer={mockOffer} renderItem={renderExperienceItem} renderMobileItem={renderExperienceMobileItem} />)

        expect(screen.queryByText("Descubre destinos increíbles")).not.toBeInTheDocument()
        expect(screen.queryByRole("link", { name: /ver todo/i })).not.toBeInTheDocument()
    })

    it("should not render carousel when there are no experiences", () => {
        render(<CampaignSlider<CampaignExperience> offer={{ ...mockOffer, experiences: [] }} renderItem={renderExperienceItem} renderMobileItem={renderExperienceMobileItem} />)

        expect(screen.queryByTestId("experience-item")).not.toBeInTheDocument()
    })

    it("should transform experience images", () => {
        render(
            <CampaignSlider<CampaignExperience>
                offer={{
                    ...mockOffer,
                    experiences: [buildExperience({ description: "15000" })],
                }}
                renderItem={renderExperienceItem}
                renderMobileItem={renderExperienceMobileItem}
            />,
        )

        const carousel = screen.getByTestId("experience-carousel")
        const item = within(carousel).getByTestId("experience-item")
        expect(item).toHaveAttribute("data-desktop", "https://bucket/paris.jpg")
        expect(item).toHaveAttribute("data-mobile", "https://bucket/paris-m.jpg")
    })

    it("should render experience when description is not numeric", () => {
        render(
            <CampaignSlider<CampaignExperience>
                offer={{
                    ...mockOffer,
                    experiences: [buildExperience({ description: "not-a-number" })],
                }}
                renderItem={renderExperienceItem}
                renderMobileItem={renderExperienceMobileItem}
            />,
        )

        const carousel = screen.getByTestId("experience-carousel")
        expect(within(carousel).getByTestId("experience-item")).toBeInTheDocument()
    })

    it("should not render a 'Ver más' link when there are two or fewer experiences", () => {
        render(
            <CampaignSlider<CampaignExperience>
                offer={{
                    ...mockOffer,
                    experiences: [
                        buildExperience({ name: "Paris", slug: "/paris" }),
                        buildExperience({ name: "Rome", slug: "/rome" }),
                    ],
                }}
                renderItem={renderExperienceItem}
                renderMobileItem={renderExperienceMobileItem}
            />,
        )

        expect(screen.queryByRole("link", { name: /ver más/i })).not.toBeInTheDocument()
    })

    it("should render a 'Ver más' link to the banner link when there are more than two experiences", () => {
        render(
            <CampaignSlider<CampaignExperience>
                offer={{
                    ...mockOffer,
                    experiences: [
                        buildExperience({ name: "Paris", slug: "/paris" }),
                        buildExperience({ name: "Rome", slug: "/rome" }),
                        buildExperience({ name: "London", slug: "/london" }),
                    ],
                }}
                renderItem={renderExperienceItem}
                renderMobileItem={renderExperienceMobileItem}
            />,
        )

        expect(screen.getByRole("link", { name: /ver más/i })).toHaveAttribute("href", "/ofertas/viajes-y-actividades/tu-proxima-aventura")
    })

    it("should show left arrow on desktop when current slide is greater than zero", () => {
        mocks.canScrollLeft = true

        render(<CampaignSlider<CampaignExperience> offer={mockOffer} renderItem={renderExperienceItem} renderMobileItem={renderExperienceMobileItem} />)

        expect(screen.getByTestId("experience-carousel")).toHaveAttribute("data-left", "true")
    })

    it("should hide carousel arrows on mobile", () => {
        mocks.isDesktop = false
        mocks.canScrollLeft = true
        mocks.canScrollRight = true

        render(<CampaignSlider<CampaignExperience> offer={mockOffer} renderItem={renderExperienceItem} renderMobileItem={renderExperienceMobileItem} />)

        const carousel = screen.getByTestId("experience-carousel")
        expect(carousel).toHaveAttribute("data-left", "false")
        expect(carousel).toHaveAttribute("data-right", "false")
    })

    it("should show right arrow when desktop, not last slide and more than two experiences", () => {
        mocks.canScrollRight = true

        render(
            <CampaignSlider<CampaignExperience>
                offer={{
                    ...mockOffer,
                    experiences: [
                        buildExperience({ name: "Paris", slug: "/paris" }),
                        buildExperience({ name: "Rome", slug: "/rome" }),
                        buildExperience({ name: "London", slug: "/london" }),
                    ],
                }}
                renderItem={renderExperienceItem}
                renderMobileItem={renderExperienceMobileItem}
            />,
        )

        expect(screen.getByTestId("experience-carousel")).toHaveAttribute("data-right", "true")
    })

    it("should call handleUpdate when carousel scrolls", () => {
        render(<CampaignSlider<CampaignExperience> offer={mockOffer} renderItem={renderExperienceItem} renderMobileItem={renderExperienceMobileItem} />)

        fireEvent.click(screen.getByText("scroll"))

        expect(mocks.handleUpdate).toHaveBeenCalledTimes(1)
    })
})

const buildProduct = (overrides: Partial<Product> = {}): Product => ({
    id: "p1",
    name: "Product A",
    slug: "/product-a",
    description: "A product",
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
    unitPointsPriceWithoutDiscount: 1500,
    assets: [],
    features: [],
    mostWanted: false,
    productType: "physicalproduct" as Product["productType"],
    searchEngine: {} as Product["searchEngine"],
    ...overrides,
})

const mockProductOffer: ProductsCampaignBanner = {
    banner: {
        id: "b1",
        title: "Products Banner",
        subtitle: "",
        description: "",
        summary: "",
        link: "/products-banner",
        linkText: "Ver productos",
        textColor: "",
        isOutstanding: false,
        segmentCodes: [],
        positions: [],
        priority: 1,
        image: { desktopUrl: "/prod-desktop.jpg", mobileUrl: "/prod-mobile.jpg" },
        campaignId: "cp1",
    },
    campaign: {
        id: "cp1",
        mainTitle: "Top Products",
        slug: "top-products",
        shortDescription: "",
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
    products: [buildProduct()],
}

describe("CampaignSlider – products branch", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.isDesktop = true
        mocks.canScrollLeft = false
        mocks.canScrollRight = false
    })

    it("should render banner and product carousel", () => {
        render(<CampaignSlider<Product> offer={mockProductOffer} renderItem={renderProductItem} renderMobileItem={renderProductMobileItem} />)

        expect(screen.getByTestId("section-banner")).toHaveTextContent("Products Banner")
        expect(screen.getByRole("link", { name: "Ver productos" })).toHaveAttribute("href", "/ofertas/productos/top-products")
        expect(screen.getAllByTestId("product-card").length).toBeGreaterThan(0)
    })

    it("should not render carousel when products are empty", () => {
        render(<CampaignSlider<Product> offer={{ ...mockProductOffer, products: [] }} renderItem={renderProductItem} renderMobileItem={renderProductMobileItem} />)

        expect(screen.queryByTestId("product-card")).not.toBeInTheDocument()
    })


    it("should render product cards in both desktop carousel and mobile section", () => {
        const products = [
            buildProduct({ id: "p1", name: "Product A", slug: "/product-a" }),
            buildProduct({ id: "p2", name: "Product B", slug: "/product-b" }),
        ]

        render(<CampaignSlider<Product> offer={{ ...mockProductOffer, products }} renderItem={renderProductItem} renderMobileItem={renderProductMobileItem} />)

        const carousel = screen.getByTestId("experience-carousel")
        const carouselCards = within(carousel).getAllByTestId("product-card")
        expect(carouselCards).toHaveLength(2)
    })

    it("should not render 'Ver más' link when there are two or fewer products", () => {
        const products = [
            buildProduct({ id: "p1", slug: "/product-a" }),
            buildProduct({ id: "p2", slug: "/product-b" }),
        ]

        render(<CampaignSlider<Product> offer={{ ...mockProductOffer, products }} renderItem={renderProductItem} renderMobileItem={renderProductMobileItem} />)

        expect(screen.queryByRole("link", { name: /ver más/i })).not.toBeInTheDocument()
    })

    it("should render 'Ver más' link to banner link when there are more than two products", () => {
        const products = [
            buildProduct({ id: "p1", slug: "/product-a" }),
            buildProduct({ id: "p2", slug: "/product-b" }),
            buildProduct({ id: "p3", slug: "/product-c" }),
        ]

        render(<CampaignSlider<Product> offer={{ ...mockProductOffer, products }} renderItem={renderProductItem} renderMobileItem={renderProductMobileItem} />)

        expect(screen.getByRole("link", { name: /ver más/i })).toHaveAttribute("href", "/ofertas/productos/top-products")
    })

    it("should show right arrow on desktop when not last slide and more than two products", () => {
        mocks.canScrollRight = true

        const products = [
            buildProduct({ id: "p1", slug: "/product-a" }),
            buildProduct({ id: "p2", slug: "/product-b" }),
            buildProduct({ id: "p3", slug: "/product-c" }),
        ]

        render(<CampaignSlider<Product> offer={{ ...mockProductOffer, products }} renderItem={renderProductItem} renderMobileItem={renderProductMobileItem} />)

        expect(screen.getByTestId("experience-carousel")).toHaveAttribute("data-right", "true")
    })

    it("should call handleUpdate when product carousel scrolls", () => {
        render(<CampaignSlider<Product> offer={mockProductOffer} renderItem={renderProductItem} renderMobileItem={renderProductMobileItem} />)

        fireEvent.click(screen.getByText("scroll"))

        expect(mocks.handleUpdate).toHaveBeenCalledTimes(1)
    })
})
