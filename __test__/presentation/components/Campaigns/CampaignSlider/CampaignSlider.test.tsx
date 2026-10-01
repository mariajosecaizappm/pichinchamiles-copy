import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { CampaignType, CampaignStatus, ExperienceCampaignBanner } from "@/domain/entity/Campaign/campaign"

vi.mock("@/presentation/components/Campaigns/CampaignSlider/ItemsCarousel", () => ({
    default: () => <div data-testid="campaign-slider-items" />,
}))

vi.mock("@/presentation/components/Banner/SectionBanner", () => ({
    SectionBanner: ({
        title,
        subtitle,
        buttonText,
        linkButton,
    }: {
        title: string
        subtitle?: string
        buttonText?: string
        linkButton: string
    }) => (
        <div data-testid="section-banner">
            <span>{title}</span>
            {subtitle && <span>{subtitle}</span>}
            <a href={linkButton}>{buttonText}</a>
        </div>
    ),
}))

import CampaignSlider from "@/presentation/components/Campaigns/CampaignSlider/CampaignSlider"
import { ProductsCampaignBanner } from "@/domain/entity/Campaign/campaign"

const mockProductOffer: ProductsCampaignBanner = {
    banner: {
        id: "b2",
        title: "Products Banner",
        subtitle: "Products Subtitle",
        description: "",
        summary: "",
        link: "/products-banner",
        linkText: "Ver productos",
        textColor: "",
        isOutstanding: false,
        segmentCodes: [],
        positions: [],
        priority: 1,
        image: { desktopUrl: "/desktop.jpg", mobileUrl: "/mobile.jpg" },
        campaignId: "p1",
    },
    campaign: {
        id: "p1",
        mainTitle: "Products Campaign",
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
        productIds: [],
        priorityProducts: [],
    },
    products: [],
}

const mockOffer: ExperienceCampaignBanner = {
    banner: {
        id: "b1",
        title: "Banner Title",
        subtitle: "Banner Subtitle",
        description: "",
        summary: "",
        link: "/banner-link",
        linkText: "Ver campaña",
        textColor: "",
        isOutstanding: false,
        segmentCodes: [],
        positions: [],
        priority: 1,
        image: { desktopUrl: "/desktop.jpg", mobileUrl: "/mobile.jpg" },
        campaignId: "c1",
    },
    campaign: {
        id: "c1",
        mainTitle: "Campaign",
        slug: "campaign",
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
        campaignType: CampaignType.EXPERIENCES,
        experiences: [],
    },
    experiences: [],
}

describe("CampaignSlider", () => {
    it("should render SectionBanner with banner props", () => {
        render(<CampaignSlider offer={mockOffer} renderItem={() => <div />} renderMobileItem={() => <div />} />)

        expect(screen.getByTestId("section-banner")).toHaveTextContent("Banner Title")
        expect(screen.getByTestId("section-banner")).toHaveTextContent("Banner Subtitle")
        expect(screen.getByRole("link", { name: "Ver campaña" })).toHaveAttribute("href", "/ofertas/viajes-y-actividades/campaign")
    })

    it("should render CampaignSliderItems", () => {
        render(<CampaignSlider offer={mockOffer} renderItem={() => <div />} renderMobileItem={() => <div />} />)

        expect(screen.getByTestId("campaign-slider-items")).toBeInTheDocument()
    })

    it("should render SectionBanner with products banner props", () => {
        render(<CampaignSlider offer={mockProductOffer} renderItem={() => <div />} renderMobileItem={() => <div />} />)

        expect(screen.getByTestId("section-banner")).toHaveTextContent("Products Banner")
        expect(screen.getByTestId("section-banner")).toHaveTextContent("Products Subtitle")
        expect(screen.getByRole("link", { name: "Ver productos" })).toHaveAttribute("href", "/ofertas/productos/top-products")
    })

    it("should render ItemsCarousel for products offer", () => {
        render(<CampaignSlider offer={mockProductOffer} renderItem={() => <div />} renderMobileItem={() => <div />} />)

        expect(screen.getByTestId("campaign-slider-items")).toBeInTheDocument()
    })

    it("should not render subtitle when banner subtitle is empty", () => {
        const offerWithoutSubtitle = {
            ...mockOffer,
            banner: { ...mockOffer.banner, subtitle: "" },
        }

        render(<CampaignSlider offer={offerWithoutSubtitle} renderItem={() => <div />} renderMobileItem={() => <div />} />)

        expect(screen.getByTestId("section-banner")).toHaveTextContent("Banner Title")
        expect(screen.getByTestId("section-banner")).not.toHaveTextContent("Banner Subtitle")
    })
})
