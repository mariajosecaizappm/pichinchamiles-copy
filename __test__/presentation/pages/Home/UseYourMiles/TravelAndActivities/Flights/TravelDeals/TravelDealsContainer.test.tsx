import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { ExperienceCampaignBanner } from "@/domain/entity/Campaign/campaign"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"

const mockGetOffers = vi.fn()
const mockContainerGet = vi.fn()

vi.mock("@/presentation/config/inversify.config", () => ({
    default: { get: (...args: unknown[]) => mockContainerGet(...args) },
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/TravelDeals/TravelDeals", () => ({
    default: ({ offers }: { offers: ExperienceCampaignBanner[] }) => (
        <div data-testid="travel-deals">{offers.length} offers</div>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/TravelDeals/TravelDealsSkeleton", () => ({
    default: () => <div data-testid="travel-deals-skeleton">Skeleton</div>,
}))

import TravelDealsContainer from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/TravelDeals/TravelDealsContainer"

describe("TravelDealsContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockContainerGet.mockReturnValue({ getOffers: mockGetOffers })
    })

    it("should render TravelDeals when offers are returned", async () => {
        mockGetOffers.mockResolvedValue([{ id: "1" }, { id: "2" }])

        const ui = await TravelDealsContainer()
        render(ui)

        expect(screen.getByTestId("travel-deals")).toBeInTheDocument()
        expect(screen.getByText("2 offers")).toBeInTheDocument()
    })

    it("should render TravelDeals with an empty array when no offers come back", async () => {
        mockGetOffers.mockResolvedValue([])

        const ui = await TravelDealsContainer()
        render(ui)

        expect(screen.getByTestId("travel-deals")).toBeInTheDocument()
        expect(screen.getByText("0 offers")).toBeInTheDocument()
    })

    it("should render the skeleton when the use case throws", async () => {
        mockGetOffers.mockRejectedValue(new Error("network error"))

        const ui = await TravelDealsContainer()
        render(ui)

        expect(screen.getByTestId("travel-deals-skeleton")).toBeInTheDocument()
    })

    it("should pass the offers through to TravelDeals unfiltered", async () => {
        const offers = [{ id: "1" }, { id: "2" }, { id: "3" }]
        mockGetOffers.mockResolvedValue(offers)

        const ui = await TravelDealsContainer()
        render(ui)

        expect(screen.getByText("3 offers")).toBeInTheDocument()
    })

    it("should resolve the use case from the container with the correct type", async () => {
        mockGetOffers.mockResolvedValue([])

        await TravelDealsContainer()

        expect(mockContainerGet).toHaveBeenCalledWith(UseCaseTypes.GetTravelsContentUseCase)
    })
})