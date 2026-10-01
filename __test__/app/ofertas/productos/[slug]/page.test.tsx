import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/presentation/pages/Offers/Products/Offer", () => ({
    default: ({ slug }: { slug: string }) => (
        <div data-testid="products-offer-campaign" data-slug={slug} />
    ),
}))

vi.mock("@/presentation/pages/Offers/Products/Offer/ProductsOfferCampaignSkeleton", () => ({
    default: () => <div data-testid="products-offer-campaign-skeleton" />,
}))

import OfferProductPage from "@/app/ofertas/productos/[slug]/page"

describe("OfferProductPage", () => {
    it("should render ProductsOfferCampaign with the resolved slug", async () => {
        const component = await OfferProductPage({
            params: Promise.resolve({ slug: "top-products" }),
            searchParams: undefined,
        })
        render(component)

        const campaign = screen.getByTestId("products-offer-campaign")
        expect(campaign).toBeInTheDocument()
        expect(campaign).toHaveAttribute("data-slug", "top-products")
    })

    it("should pass searchParams through to ProductsOfferCampaign", async () => {
        const component = await OfferProductPage({
            params: Promise.resolve({ slug: "my-campaign" }),
            searchParams: undefined,
        })
        render(component)

        expect(screen.getByTestId("products-offer-campaign")).toBeInTheDocument()
    })

    it("should render ProductsOfferCampaignSkeleton when params throws", async () => {
        const component = await OfferProductPage({
            params: Promise.reject(new Error("params error")),
            searchParams: undefined,
        })
        render(component)

        expect(screen.getByTestId("products-offer-campaign-skeleton")).toBeInTheDocument()
    })

})
