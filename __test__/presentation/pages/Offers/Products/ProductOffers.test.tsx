import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import "@testing-library/jest-dom"

const mockUseSession = vi.fn(() => ({ isLogged: false }))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@/presentation/pages/Offers/Products/components/ProductOfferBanner", () => ({
    default: () => (
        <div data-testid="offers-banner-container" data-type="products">ProductOfferBanner</div>
    ),
}))

vi.mock("@/presentation/pages/Offers/components/navbar/OffersNavbar/OffersNavbar", () => ({
    default: () => <div data-testid="offers-navbar">OffersNavbar</div>,
}))

vi.mock("@/presentation/pages/Offers/Products/components/ProductOfferPromotionBanners", () => ({
    default: () => (
        <div data-testid="promotion-banners" data-type="products">ProductOfferPromotionBanners</div>
    ),
}))

vi.mock("@/presentation/pages/Offers/Products/components/Campaigns", () => ({
    default: () => <div data-testid="product-offers-campaigns">Campaigns</div>,
}))

import ProductOffers from "@/presentation/pages/Offers/Products/ProductOffers"

describe("ProductOffers", () => {
    it("should render OffersBannerContainer", () => {
        render(<ProductOffers offers={[]} banners={[]} />)

        expect(screen.getByTestId("offers-banner-container")).toBeInTheDocument()
    })

    it("should pass type=products to OffersBannerContainer", () => {
        render(<ProductOffers offers={[]} banners={[]} />)

        expect(screen.getByTestId("offers-banner-container")).toHaveAttribute("data-type", "products")
    })

    it("should pass type=products to PromotionBanners", () => {
        render(<ProductOffers offers={[]} banners={[]} />)

        expect(screen.getByTestId("promotion-banners")).toHaveAttribute("data-type", "products")
    })

    it("should render OffersNavbar", () => {
        render(<ProductOffers offers={[]} banners={[]} />)

        expect(screen.getByTestId("offers-navbar")).toBeInTheDocument()
    })

    it("should render banner before navbar", () => {
        render(<ProductOffers offers={[]} banners={[]} />)

        const banner = screen.getByTestId("offers-banner-container")
        const navbar = screen.getByTestId("offers-navbar")

        expect(
            banner.compareDocumentPosition(navbar) & Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy()
    })
})
