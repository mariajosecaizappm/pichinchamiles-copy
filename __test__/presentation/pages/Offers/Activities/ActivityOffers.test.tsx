import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import "@testing-library/jest-dom"

const mockUseSession = vi.fn(() => ({ isLogged: false }))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@/presentation/pages/Offers/Activities/components/ActivityOffersBanner", () => ({
    default: () => (
        <div data-testid="offers-banner-container" data-type="activities">ActivityOffersBanner</div>
    ),
}))

vi.mock("@/presentation/pages/Offers/components/navbar/OffersNavbar/OffersNavbar", () => ({
    default: () => <div data-testid="offers-navbar">OffersNavbar</div>,
}))

vi.mock("@/presentation/pages/Offers/Activities/components/ActivityOffersPromotionBanners", () => ({
    default: () => (
        <div data-testid="promotion-banners" data-type="activities">ActivityOffersPromotionBanners</div>
    ),
}))

vi.mock("@/presentation/pages/Offers/Activities/Campaigns", () => ({
    default: () => <div data-testid="activity-offers-campaigns-container">Campaigns</div>,
}))

import ActivityOffers from "@/presentation/pages/Offers/Activities/ActivityOffers"

describe("ActivityOffers", () => {
    it("should render OffersBannerContainer", () => {
        render(<ActivityOffers banners={[]} offers={[]} />)

        expect(screen.getByTestId("offers-banner-container")).toBeInTheDocument()
    })

    it("should pass type=activities to OffersBannerContainer", () => {
        render(<ActivityOffers banners={[]} offers={[]} />)

        expect(screen.getByTestId("offers-banner-container")).toHaveAttribute("data-type", "activities")
    })

    it("should render OffersNavbar", () => {
        render(<ActivityOffers banners={[]} offers={[]} />)

        expect(screen.getByTestId("offers-navbar")).toBeInTheDocument()
    })

    it("should render PromotionBanners with type=activities", () => {
        render(<ActivityOffers banners={[]} offers={[]} />)

        expect(screen.getByTestId("promotion-banners")).toBeInTheDocument()
        expect(screen.getByTestId("promotion-banners")).toHaveAttribute("data-type", "activities")
    })

    it("should render ActivityOffersCampaignsContainer", () => {
        render(<ActivityOffers banners={[]} offers={[]} />)

        expect(screen.getByTestId("activity-offers-campaigns-container")).toBeInTheDocument()
    })

    it("should render banner, navbar, promo banners and campaigns in order", () => {
        render(<ActivityOffers banners={[]} offers={[]} />)

        const banner = screen.getByTestId("offers-banner-container")
        const navbar = screen.getByTestId("offers-navbar")
        const promoBanners = screen.getByTestId("promotion-banners")
        const campaigns = screen.getByTestId("activity-offers-campaigns-container")

        expect(
            banner.compareDocumentPosition(navbar) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy()
        expect(
            navbar.compareDocumentPosition(promoBanners) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy()
        expect(
            promoBanners.compareDocumentPosition(campaigns) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy()
    })
})
