import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { Banner } from "@/domain/entity/Banner/banner"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"

const mockUseSession = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@/presentation/pages/Offers/Products/components/Promotions/PromotionCards", () => ({
    default: ({ banners }: { banners: Banner[] }) => (
        <div data-testid="promotion-cards" data-count={banners.length} data-ids={banners.map(b => b.id).join(",")}>
            PromotionBanners
        </div>
    ),
}))

import ActivityOffersPromotionBanners from "@/presentation/pages/Offers/Activities/components/ActivityOffersPromotionBanners/ActivityOffersPromotionBanners"

const buildBanner = (overrides: Partial<Banner> = {}): Banner => ({
    id: "b",
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

describe("ActivityOffersPromotionBanners", () => {
    beforeEach(() => {
        mockUseSession.mockReturnValue({ isLogged: false })
    })

    it("should pass 0 banners when none match guest promotion activities position", () => {
        const banners = [buildBanner({ id: "b-1", positions: [MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_PRODUCTS] })]

        render(<ActivityOffersPromotionBanners banners={banners} />)

        expect(screen.getByTestId("promotion-cards")).toHaveAttribute("data-count", "0")
    })

    it("should pass OFFERS_GUEST_BANNER_PROMOTIONAL_ACTIVITIES banners when not logged", () => {
        const banners = [
            buildBanner({ id: "b-g1", positions: [MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_ACTIVITIES] }),
            buildBanner({ id: "b-g2", positions: [MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_ACTIVITIES] }),
            buildBanner({ id: "b-a", positions: [MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_ACTIVITIES] }),
        ]

        render(<ActivityOffersPromotionBanners banners={banners} />)

        expect(screen.getByTestId("promotion-cards")).toHaveAttribute("data-count", "2")
        expect(screen.getByTestId("promotion-cards")).toHaveAttribute("data-ids", "b-g1,b-g2")
    })

    it("should pass OFFERS_AUTH_BANNER_PROMOTIONAL_ACTIVITIES banners when logged", () => {
        mockUseSession.mockReturnValue({ isLogged: true })
        const banners = [
            buildBanner({ id: "b-a1", positions: [MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_ACTIVITIES] }),
            buildBanner({ id: "b-a2", positions: [MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_ACTIVITIES] }),
            buildBanner({ id: "b-g", positions: [MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_ACTIVITIES] }),
        ]

        render(<ActivityOffersPromotionBanners banners={banners} />)

        expect(screen.getByTestId("promotion-cards")).toHaveAttribute("data-count", "2")
        expect(screen.getByTestId("promotion-cards")).toHaveAttribute("data-ids", "b-a1,b-a2")
    })
})
