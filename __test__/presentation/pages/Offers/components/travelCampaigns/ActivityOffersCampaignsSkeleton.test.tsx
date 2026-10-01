import { render } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured/FeaturedItemCardSkeleton", () => ({
    default: () => <div data-testid="card-skeleton" />,
}))

import ActivityOffersCampaignsSkeleton from "@/presentation/pages/Offers/Activities/Campaigns/ActivityOffersCampaignsSkeleton"

describe("ActivityOffersCampaignsSkeleton", () => {
    it("should render campaign skeletons", () => {
        const { getAllByTestId } = render(<ActivityOffersCampaignsSkeleton />)

        expect(getAllByTestId("skeleton").length).toBeGreaterThan(0)
        expect(getAllByTestId("card-skeleton").length).toBeGreaterThan(0)
    })
})
