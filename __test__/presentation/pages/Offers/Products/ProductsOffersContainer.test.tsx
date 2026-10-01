import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const mocks = vi.hoisted(() => ({
    getProductOffers: vi.fn(),
    containerGet: vi.fn(() => ({
        getProductOffers: mocks.getProductOffers,
    })),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: { get: mocks.containerGet },
}))

vi.mock("@/presentation/pages/Offers/Products/ProductOffers", () => ({
    default: ({ offers, banners }: { offers: unknown[]; banners: unknown[] }) => (
        <div data-testid="products-offers" data-offers-count={offers.length} data-banners-count={banners.length}>
            ProductOffers
        </div>
    ),
}))

vi.mock("@/presentation/pages/Offers/components/skeletons/OffersSkeleton", () => ({
    default: () => <div data-testid="offers-skeleton">OffersSkeleton</div>,
}))

import ProductsOffersContainer from "@/presentation/pages/Offers/Products/ProductsOffersContainer"

describe("ProductsOffersContainer", () => {
    beforeEach(() => {
        mocks.getProductOffers.mockReset()
        mocks.containerGet.mockClear()
    })

    it("should resolve the GetProductOffersUseCase from inversify container", async () => {
        mocks.getProductOffers.mockResolvedValue({ productOffers: [], banners: [] })

        render(await ProductsOffersContainer())

        expect(mocks.containerGet).toHaveBeenCalledWith(UseCaseTypes.GetProductOffersUseCase)
    })

    it("should render ProductOffers with data from the use case", async () => {
        mocks.getProductOffers.mockResolvedValue({
            productOffers: [{ id: "o-1" }, { id: "o-2" }],
            banners: [{ id: "b-1" }],
        })

        const node = await ProductsOffersContainer()
        render(node)

        await waitFor(() => {
            expect(screen.getByTestId("products-offers")).toHaveAttribute("data-offers-count", "2")
            expect(screen.getByTestId("products-offers")).toHaveAttribute("data-banners-count", "1")
        })
    })

    it("should render OffersSkeleton when the use case throws", async () => {
        mocks.getProductOffers.mockRejectedValue(new Error("boom"))

        const node = await ProductsOffersContainer()
        render(node)

        expect(screen.getByTestId("offers-skeleton")).toBeInTheDocument()
    })
})
