import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import {
    CampaignBanner,
    CampaignType,
    CampaignStatus,
    ExperienceCampaignBanner,
} from "@/domain/entity/Campaign/campaign"

vi.mock("@/presentation/components/Campaigns/CampaignSlider", () => ({
    default: ({ offer }: { offer: { campaign: { id: string; mainTitle: string } } }) => (
        <div data-testid="campaign-slider" data-id={offer.campaign.id}>
            {offer.campaign.mainTitle}
        </div>
    ),
}))

import OffersCampaigns from "@/presentation/pages/Offers/components/campaigns/OffersCampaignsWrapper"
import CampaignSlider from "@/presentation/components/Campaigns/CampaignSlider"

const buildOffer = (id: string, title: string, slug: string): ExperienceCampaignBanner => ({
    banner: {
        id: `b-${id}`,
        title,
        subtitle: "",
        description: "",
        summary: "",
        link: "/link",
        linkText: "Ver",
        textColor: "",
        isOutstanding: false,
        segmentCodes: [],
        positions: [],
        priority: 1,
        image: { desktopUrl: "/d.jpg", mobileUrl: "/m.jpg" },
        campaignId: id,
    },
    campaign: {
        id,
        mainTitle: title,
        slug,
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
})

const renderOffer = (offer: CampaignBanner) => (
    <CampaignSlider offer={offer} renderItem={() => <div />} renderMobileItem={() => <div />} />
)

describe("OffersCampaigns", () => {
    it("should render no CampaignSliders when offers array is empty", () => {
        render(<OffersCampaigns offers={[]} renderOffer={renderOffer} />)

        expect(screen.queryByTestId("campaign-slider")).not.toBeInTheDocument()
    })

    it("should render one CampaignSlider per offer", () => {
        const offers: CampaignBanner[] = [
            buildOffer("c1", "Campaign 1", "campaign-1"),
            buildOffer("c2", "Campaign 2", "campaign-2"),
        ]
        render(<OffersCampaigns offers={offers} renderOffer={renderOffer} />)

        expect(screen.getAllByTestId("campaign-slider")).toHaveLength(2)
    })

    it("should pass correct offer data to each CampaignSlider", () => {
        const offers: CampaignBanner[] = [
            buildOffer("c1", "Campaign 1", "campaign-1"),
            buildOffer("c2", "Campaign 2", "campaign-2"),
        ]
        render(<OffersCampaigns offers={offers} renderOffer={renderOffer} />)

        expect(screen.getByText("Campaign 1")).toBeInTheDocument()
        expect(screen.getByText("Campaign 2")).toBeInTheDocument()
    })

    it("should apply lg:bg-neutral-100 to even-indexed offer wrappers", () => {
        const offers: CampaignBanner[] = [
            buildOffer("c1", "A", "a"),
            buildOffer("c2", "B", "b"),
            buildOffer("c3", "C", "c"),
        ]
        render(<OffersCampaigns offers={offers} renderOffer={renderOffer} />)

        const sliders = screen.getAllByTestId("campaign-slider")

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

    it("should render a single offer correctly", () => {
        render(<OffersCampaigns offers={[buildOffer("c1", "Only Campaign", "only")]} renderOffer={renderOffer} />)

        expect(screen.getByTestId("campaign-slider")).toHaveAttribute("data-id", "c1")
        expect(screen.getByText("Only Campaign")).toBeInTheDocument()
    })
})
