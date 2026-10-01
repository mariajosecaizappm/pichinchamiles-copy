import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { Banner } from "@/domain/entity/Banner/banner"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"

const mockUseSession = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@/presentation/pages/Offers/components/banner/OffersBanner", () => ({
    default: ({ banner }: { banner: Banner }) => (
        <div data-testid="offers-banner" data-banner-id={banner.id}>OffersBanner</div>
    ),
}))

import ProductOfferBanner from "@/presentation/pages/Offers/Products/components/ProductOfferBanner/ProductOfferBanner"

const buildBanner = (overrides: Partial<Banner> = {}): Banner => ({
    id: "b-1",
    title: "",
    subtitle: "",
    description: "",
    summary: "",
    link: "",
    textColor: "",
    isOutstanding: false,
    segmentCodes: [],
    positions: [],
    priority: 1,
    image: { desktopUrl: "", mobileUrl: "" },
    campaignId: "",
    ...overrides,
})

describe("ProductOfferBanner", () => {
    beforeEach(() => {
        mockUseSession.mockReturnValue({ isLogged: false })
    })

    it("should render null when no banner matches guest products position", () => {
        const banners = [buildBanner({ id: "b-other", positions: [MarketingPositions.OFFERS_GUEST_MAIN_BANNER_ACTIVITIES] })]

        const { container } = render(<ProductOfferBanner banners={banners} />)

        expect(container).toBeEmptyDOMElement()
    })

    it("should pick the OFFERS_GUEST_MAIN_BANNER_PRODUCTS banner when not logged", () => {
        const banners = [
            buildBanner({ id: "b-guest", positions: [MarketingPositions.OFFERS_GUEST_MAIN_BANNER_PRODUCTS] }),
            buildBanner({ id: "b-auth", positions: [MarketingPositions.OFFERS_AUTH_MAIN_BANNER_PRODUCTS] }),
        ]

        render(<ProductOfferBanner banners={banners} />)

        expect(screen.getByTestId("offers-banner")).toHaveAttribute("data-banner-id", "b-guest")
    })

    it("should pick the OFFERS_AUTH_MAIN_BANNER_PRODUCTS banner when logged", () => {
        mockUseSession.mockReturnValue({ isLogged: true })
        const banners = [
            buildBanner({ id: "b-guest", positions: [MarketingPositions.OFFERS_GUEST_MAIN_BANNER_PRODUCTS] }),
            buildBanner({ id: "b-auth", positions: [MarketingPositions.OFFERS_AUTH_MAIN_BANNER_PRODUCTS] }),
        ]

        render(<ProductOfferBanner banners={banners} />)

        expect(screen.getByTestId("offers-banner")).toHaveAttribute("data-banner-id", "b-auth")
    })
})
