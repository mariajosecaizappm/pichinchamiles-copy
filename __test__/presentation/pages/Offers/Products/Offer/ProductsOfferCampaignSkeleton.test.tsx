import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@/presentation/pages/Offers/Products/Offer/components/Banner/ProductOfferBannerSkeleton", () => ({
    default: () => <div data-testid="product-offer-banner-skeleton" />,
}))

vi.mock("@/presentation/pages/Products/components/skeletons/ProductsContentSkeleton", () => ({
    default: () => <div data-testid="products-content-skeleton" />,
}))

import ProductsOfferCampaignSkeleton from "@/presentation/pages/Offers/Products/Offer/ProductsOfferCampaignSkeleton"

describe("ProductsOfferCampaignSkeleton", () => {
    it("should render the banner skeleton inside the campaign layout", () => {
        const { container } = render(<ProductsOfferCampaignSkeleton />)

        expect(screen.getByTestId("product-offer-banner-skeleton")).toBeInTheDocument()
        expect(screen.getByTestId("products-content-skeleton")).toBeInTheDocument()
        expect(container.querySelector(".body-container")).toBeInTheDocument()
    })
})
