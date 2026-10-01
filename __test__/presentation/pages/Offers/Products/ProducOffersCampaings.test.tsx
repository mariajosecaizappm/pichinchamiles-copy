import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"

const mockUseSession = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@/presentation/pages/Offers/Products/components/Campaigns/ProductOffersCampaigns", () => ({
    default: ({ offers }: { offers: unknown[] }) => (
        <div data-testid="offers-campaigns">{offers.length} offers</div>
    ),
}))

import ProductOffersCampaignsContainer from "@/presentation/pages/Offers/Products/components/Campaigns/ProductOffersCampaignsContainer"

describe("ProductOffersCampaignsContainer", () => {
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
                positions: [MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS],
            }),
            makeOffer({
                id: "2",
                positions: [MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS],
            }),
            makeOffer({ id: "3", positions: [MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS] }),
        ]

        render(<ProductOffersCampaignsContainer offers={offers} />)

        expect(screen.getByTestId("offers-campaigns")).toHaveTextContent("2 offers")
    })

    it("should render campaigns filtered by logged position when isLogged is true", () => {
        mockUseSession.mockReturnValue({ isLogged: true })
        const offers = [
            makeOffer({
                id: "logged-1",
                positions: [MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS],
            }),
            makeOffer({
                id: "not-logged-1",
                positions: [MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS],
            }),
        ]

        render(<ProductOffersCampaignsContainer offers={offers} />)

        expect(screen.getByTestId("offers-campaigns")).toHaveTextContent("1 offers")
    })

    it("should render 0 offers when no offers match the current position", () => {
        const offers = [
            makeOffer({ id: "1", positions: [MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS] }),
        ]

        render(<ProductOffersCampaignsContainer offers={offers} />)

        expect(screen.getByTestId("offers-campaigns")).toHaveTextContent("0 offers")
    })

    it("should render 0 offers when offers array is empty", () => {
        render(<ProductOffersCampaignsContainer offers={[]} />)

        expect(screen.getByTestId("offers-campaigns")).toHaveTextContent("0 offers")
    })

    it("should limit rendered offers to 4 items", () => {
        const offers = Array.from({ length: 6 }, (_, i) =>
            makeOffer({
                id: `${i + 1}`,
                positions: [MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS],
                priority: i + 1,
            })
        )

        render(<ProductOffersCampaignsContainer offers={offers} />)

        expect(screen.getByTestId("offers-campaigns")).toHaveTextContent("4 offers")
    })
})
