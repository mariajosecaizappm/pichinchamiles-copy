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

import ProductOfferPromotionBanners from "@/presentation/pages/Offers/Products/components/ProductOfferPromotionBanners/ProductOfferPromotionBanners"

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

describe("ProductOfferPromotionBanners", () => {
    beforeEach(() => {
        mockUseSession.mockReturnValue({ isLogged: false })
    })

    it("should pass 0 banners when none match guest promotion position", () => {
        const banners = [buildBanner({ id: "b-1", positions: [MarketingPositions.OFFERS_GUEST_MAIN_BANNER_PRODUCTS] })]

        render(<ProductOfferPromotionBanners banners={banners} />)

        expect(screen.getByTestId("promotion-cards")).toHaveAttribute("data-count", "0")
    })

    it("should pass the OFFERS_GUEST_BANNER_PROMOTIONAL_PRODUCTS banners when not logged", () => {
        const banners = [
            buildBanner({ id: "b-guest-1", positions: [MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_PRODUCTS] }),
            buildBanner({ id: "b-guest-2", positions: [MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_PRODUCTS] }),
            buildBanner({ id: "b-auth", positions: [MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_PRODUCTS] }),
        ]

        render(<ProductOfferPromotionBanners banners={banners} />)

        expect(screen.getByTestId("promotion-cards")).toHaveAttribute("data-count", "2")
        expect(screen.getByTestId("promotion-cards")).toHaveAttribute("data-ids", "b-guest-1,b-guest-2")
    })

    it("should pass the OFFERS_AUTH_BANNER_PROMOTIONAL_PRODUCTS banners when logged", () => {
        mockUseSession.mockReturnValue({ isLogged: true })
        const banners = [
            buildBanner({ id: "b-auth-1", positions: [MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_PRODUCTS] }),
            buildBanner({ id: "b-guest", positions: [MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_PRODUCTS] }),
        ]

        render(<ProductOfferPromotionBanners banners={banners} />)

        expect(screen.getByTestId("promotion-cards")).toHaveAttribute("data-count", "1")
        expect(screen.getByTestId("promotion-cards")).toHaveAttribute("data-ids", "b-auth-1")
    })
})
