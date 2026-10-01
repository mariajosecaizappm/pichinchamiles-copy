import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const mocks = vi.hoisted(() => ({
    getActivityOffers: vi.fn(),
    containerGet: vi.fn(() => ({
        getActivityOffers: mocks.getActivityOffers,
    })),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: { get: mocks.containerGet },
}))

vi.mock("@/presentation/pages/Offers/Activities/ActivityOffers", () => ({
    default: ({ offers, banners }: { offers: unknown[]; banners: unknown[] }) => (
        <div
            data-testid="activity-offers-page"
            data-offers-count={offers.length}
            data-banners-count={banners.length}
        >
            ActivityOffers
        </div>
    ),
}))

vi.mock("@/presentation/pages/Offers/components/skeletons/OffersSkeleton", () => ({
    default: () => <div data-testid="offers-skeleton">OffersSkeleton</div>,
}))

import ActivityOffersContainer from "@/presentation/pages/Offers/Activities/ActivityOffersContainer"

describe("ActivityOffersContainer", () => {
    beforeEach(() => {
        mocks.getActivityOffers.mockReset()
        mocks.containerGet.mockClear()
    })

    it("should resolve GetActivityOffersUseCase from inversify container", async () => {
        mocks.getActivityOffers.mockResolvedValue({ offers: [], banners: [] })

        render(await ActivityOffersContainer())

        expect(mocks.containerGet).toHaveBeenCalledWith(UseCaseTypes.GetActivityOffersUseCase)
    })

    it("should render ActivityOffers with the use case result", async () => {
        mocks.getActivityOffers.mockResolvedValue({
            offers: [{ id: "o-1" }, { id: "o-2" }, { id: "o-3" }],
            banners: [{ id: "b-1" }, { id: "b-2" }],
        })

        const node = await ActivityOffersContainer()
        render(node)

        await waitFor(() => {
            expect(screen.getByTestId("activity-offers-page")).toHaveAttribute("data-offers-count", "3")
            expect(screen.getByTestId("activity-offers-page")).toHaveAttribute("data-banners-count", "2")
        })
    })

    it("should render OffersSkeleton when the use case throws", async () => {
        mocks.getActivityOffers.mockRejectedValue(new Error("Repository unavailable"))

        const node = await ActivityOffersContainer()
        render(node)

        expect(screen.getByTestId("offers-skeleton")).toBeInTheDocument()
    })
})
