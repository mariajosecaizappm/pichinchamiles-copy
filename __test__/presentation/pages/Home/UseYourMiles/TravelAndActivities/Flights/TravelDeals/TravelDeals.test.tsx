import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { ExperienceCampaignBanner, CampaignType, CampaignStatus } from "@/domain/entity/Campaign/campaign"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"

const mockUseSession = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Sections/OffersShowcase/OffersShowcase", () => ({
    default: ({ title, campaigns }: { title: string; campaigns: ExperienceCampaignBanner[] }) => (
        <div data-testid="offers-showcase">
            <h2>{title}</h2>
            <div data-testid="tabs">
                {campaigns.map(c => (
                    <div key={c.campaign.id} data-testid={`tab-${c.campaign.id}`}>
                        <span>{c.campaign.mainTitle}</span>
                    </div>
                ))}
            </div>
        </div>
    ),
}))

import TravelDeals from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/TravelDeals/TravelDeals"

const createOffer = (overrides: Partial<ExperienceCampaignBanner> = {}): ExperienceCampaignBanner => ({
    banner: {
        id: "b1",
        title: "Banner",
        subtitle: "",
        description: "",
        summary: "",
        link: "/link",
        textColor: "",
        isOutstanding: false,
        segmentCodes: [],
        positions: [MarketingPositions.HOME_UV_GUEST_OFFERS],
        priority: 1,
        image: { desktopUrl: "", mobileUrl: "" },
        campaignId: "c1",
    },
    campaign: {
        id: "c1",
        mainTitle: "Campaign 1",
        slug: "campaign-1",
        isOutstanding: false,
        positions: [],
        segmentCodes: [],
        hasLanding: false,
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

const mockOffer = createOffer()

describe("TravelDeals", () => {
    beforeEach(() => {
        mockUseSession.mockReturnValue({ isLogged: false })
    })

    it("should render the title 'Ofertas de viajes'", () => {
        render(<TravelDeals offers={[mockOffer]} />)
        expect(screen.getByText("Ofertas de viajes")).toBeInTheDocument()
    })

    it("should render OffersShowcase", () => {
        render(<TravelDeals offers={[mockOffer]} />)
        expect(screen.getByTestId("offers-showcase")).toBeInTheDocument()
    })

    it("should render tabs component", () => {
        render(<TravelDeals offers={[mockOffer]} />)
        expect(screen.getByTestId("tabs")).toBeInTheDocument()
    })

    it("should render tab for each offer", () => {
        const offers = [
            mockOffer,
            createOffer({
                campaign: { ...mockOffer.campaign, id: "c2", mainTitle: "Campaign 2" },
            }),
        ]
        render(<TravelDeals offers={offers} />)
        expect(screen.getByTestId("tab-c1")).toBeInTheDocument()
        expect(screen.getByTestId("tab-c2")).toBeInTheDocument()
    })

    it("should render campaign title as tab label", () => {
        render(<TravelDeals offers={[mockOffer]} />)
        expect(screen.getByText("Campaign 1")).toBeInTheDocument()
    })

    it("should have bg-grayscale-50 background", () => {
        const { container } = render(<TravelDeals offers={[mockOffer]} />)
        expect(container.firstChild).toHaveClass("bg-grayscale-50")
    })

    it("should pass offers to OffersShowcase", () => {
        render(<TravelDeals offers={[mockOffer]} />)
        expect(screen.getByText("Campaign 1")).toBeInTheDocument()
    })

    it("should filter out offers that don't match the guest position", () => {
        const offers = [createOffer({
            banner: { ...mockOffer.banner, positions: [MarketingPositions.HOME_UV_AUTH_OFFERS] },
        })]
        render(<TravelDeals offers={offers} />)
        expect(screen.queryByTestId("tab-c1")).not.toBeInTheDocument()
    })

    it("should use the auth position when the user is logged in", () => {
        mockUseSession.mockReturnValue({ isLogged: true })
        const offers = [createOffer({
            banner: { ...mockOffer.banner, positions: [MarketingPositions.HOME_UV_AUTH_OFFERS] },
        })]
        render(<TravelDeals offers={offers} />)
        expect(screen.getByTestId("tab-c1")).toBeInTheDocument()
    })
})