import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"

const mockUseSession = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@/presentation/pages/Offers/Activities/Campaigns/ActivityOffersCampaigns", () => ({
    default: ({ offers }: { offers: unknown[] }) => (
        <div data-testid="activity-offers-campaigns">{offers.length} offers</div>
    ),
}))

import ActivityOffersCampaignsContainer from "@/presentation/pages/Offers/Activities/Campaigns/ActivityOffersCampaignsContainer"

describe("ActivityOffersCampaignsContainer", () => {
    beforeEach(() => {
        mockUseSession.mockReturnValue({ isLogged: false })
    })

    const makeOffer = (opts: {
        id: string
        positions?: MarketingPositions[]
        priority?: number
    }) => ({
        id: opts.id,
        banner: {
            id: opts.id,
            title: "",
            subtitle: "",
            description: "",
            summary: "",
            link: "",
            priority: opts.priority ?? 1,
            textColor: "",
            isOutstanding: false,
            segmentCodes: [],
            positions: opts.positions ?? [],
            linkText: "",
            image: { desktopUrl: "", mobileUrl: "" },
            campaignId: "",
        },
    } as never)

    it("should render campaigns when offers are provided", () => {
        const offers = [
            makeOffer({
                id: "1",
                positions: [MarketingPositions.HOME_UV_GUEST_OFFERS],
            }),
            makeOffer({
                id: "2",
                positions: [MarketingPositions.HOME_UV_GUEST_OFFERS],
            }),
            makeOffer({ id: "3", positions: [MarketingPositions.HOME_UV_AUTH_OFFERS] }),
        ]

        render(<ActivityOffersCampaignsContainer offers={offers} />)

        expect(screen.getByTestId("activity-offers-campaigns")).toHaveTextContent("2 offers")
    })

    it("should render campaigns filtered by logged position when isLogged is true", () => {
        mockUseSession.mockReturnValue({ isLogged: true })
        const offers = [
            makeOffer({
                id: "auth-1",
                positions: [MarketingPositions.HOME_UV_AUTH_OFFERS],
            }),
            makeOffer({
                id: "guest-1",
                positions: [MarketingPositions.HOME_UV_GUEST_OFFERS],
            }),
        ]

        render(<ActivityOffersCampaignsContainer offers={offers} />)

        expect(screen.getByTestId("activity-offers-campaigns")).toHaveTextContent("1 offers")
    })

    it("should render 0 offers when offers array is empty", () => {
        render(<ActivityOffersCampaignsContainer offers={[]} />)

        expect(screen.getByTestId("activity-offers-campaigns")).toHaveTextContent("0 offers")
    })

    it("should render 0 offers when no offers match the current position", () => {
        const offers = [
            makeOffer({ id: "1", positions: [MarketingPositions.HOME_UV_AUTH_OFFERS] }),
        ]

        render(<ActivityOffersCampaignsContainer offers={offers} />)

        expect(screen.getByTestId("activity-offers-campaigns")).toHaveTextContent("0 offers")
    })
})
