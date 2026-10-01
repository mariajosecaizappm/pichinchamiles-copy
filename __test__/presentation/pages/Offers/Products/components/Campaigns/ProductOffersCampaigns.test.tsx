import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { ProductsCampaignBanner, CampaignType, CampaignStatus } from "@/domain/entity/Campaign/campaign"

vi.mock("@/presentation/components/Campaigns/CampaignSlider", () => ({
    default: ({ offer }: { offer: { campaign: { id: string } } }) => (
        <div data-testid={`campaign-slider-${offer.campaign.id}`} />
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCard", () => ({
    default: () => <div data-testid="product-card" />,
}))

import ProductOffersCampaigns from "@/presentation/pages/Offers/Products/components/Campaigns/ProductOffersCampaigns"

const buildOffer = (id: string): ProductsCampaignBanner => ({
    banner: {
        id: `b-${id}`,
        title: "Banner",
        subtitle: "",
        description: "",
        summary: "",
        link: "",
        linkText: "",
        textColor: "",
        isOutstanding: false,
        segmentCodes: [],
        positions: [],
        priority: 1,
        image: { desktopUrl: "", mobileUrl: "" },
        campaignId: id,
    },
    campaign: {
        id,
        mainTitle: `Campaign ${id}`,
        slug: id,
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
})

describe("ProductOffersCampaigns", () => {
    it("should render one CampaignSlider per offer", () => {
        render(
            <ProductOffersCampaigns
                offers={[buildOffer("p1"), buildOffer("p2")]}
            />,
        )

        expect(screen.getByTestId("campaign-slider-p1")).toBeInTheDocument()
        expect(screen.getByTestId("campaign-slider-p2")).toBeInTheDocument()
    })

    it("should render no sliders when offers is empty", () => {
        render(<ProductOffersCampaigns offers={[]} />)

        expect(screen.queryByTestId(/^campaign-slider-/)).not.toBeInTheDocument()
    })

    it("should apply lg:bg-neutral-100 to even-indexed wrappers", () => {
        render(
            <ProductOffersCampaigns
                offers={[buildOffer("p1"), buildOffer("p2"), buildOffer("p3")]}
            />,
        )

        const sliders = screen.getAllByTestId(/^campaign-slider-/)

        sliders.forEach((slider, index) => {
            let node: HTMLElement | null = slider
            let outerClass = ""
            while (node) {
                if (node.className?.includes("lg:bg-neutral-100")) {
                    outerClass = node.className
                    break
                }
                node = node.parentElement
            }
            if (index % 2 === 0) {
                expect(outerClass).toContain("lg:bg-neutral-100")
            } else {
                expect(outerClass).toBe("")
            }
        })
    })
})
