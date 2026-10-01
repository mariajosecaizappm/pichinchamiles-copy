import { render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured/FeaturedItemCardSkeleton", () => ({
    default: () => <div data-testid="featured-card-skeleton" />,
}))

import OfferCampaignLandingSkeleton from "@/presentation/pages/Offers/Campaign/OfferCampaignLandingSkeleton"

describe("OfferCampaignLandingSkeleton", () => {
    it("should render banner and experience skeletons", () => {
        const { getAllByTestId } = render(<OfferCampaignLandingSkeleton />)

        expect(getAllByTestId("skeleton").length).toBeGreaterThan(0)
        expect(getAllByTestId("featured-card-skeleton")).toHaveLength(4)
    })

    it("should render mobile experience skeleton rows", () => {
        const { container } = render(<OfferCampaignLandingSkeleton />)

        expect(container.querySelector(".lg\\:hidden")).toBeInTheDocument()
    })
})
