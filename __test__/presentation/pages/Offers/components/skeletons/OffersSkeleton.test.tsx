import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/pages/Home/components/HomeBannerCarousel/HomeBannerCarouselSkeleton", () => ({
    default: ({ className }: { className?: string }) => (
        <div data-testid="home-banner-skeleton" className={className} />
    ),
}))

vi.mock("@/presentation/pages/Offers/components/skeletons/OffersNavbarSkeleton", () => ({
    default: () => <div data-testid="offers-navbar-skeleton" />,
}))

vi.mock("@/presentation/pages/Offers/Products/components/Promotions/PromotionCardsSkeleton", () => ({
    default: () => <div data-testid="promotion-cards-skeleton" />,
}))

import OffersSkeleton from "@/presentation/pages/Offers/components/skeletons/OffersSkeleton"

describe("OffersSkeleton", () => {
    it("should render all offer page skeleton sections", () => {
        render(<OffersSkeleton />)

        expect(screen.getByTestId("home-banner-skeleton")).toHaveClass("h-40", "sm:h-77.5")
        expect(screen.getByTestId("offers-navbar-skeleton")).toBeInTheDocument()
        expect(screen.getByTestId("promotion-cards-skeleton")).toBeInTheDocument()
    })
})
