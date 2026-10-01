import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured/FeaturedItemCardSkeleton", () => ({
    default: () => <div data-testid="featured-item-card-skeleton" />,
}))

import FeaturedItemsSkeleton from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured/FeaturedItemsSkeleton"

describe("FeaturedItemsSkeleton", () => {
    it("should render title skeleton", () => {
        render(<FeaturedItemsSkeleton />)
        const skeletons = screen.getAllByTestId("skeleton")
        expect(skeletons.length).toBeGreaterThan(0)
    })

    it("should render 4 FeaturedItemCardSkeleton components", () => {
        render(<FeaturedItemsSkeleton />)
        const cardSkeletons = screen.getAllByTestId("featured-item-card-skeleton")
        expect(cardSkeletons).toHaveLength(4)
    })

    it("should have correct wrapper classes", () => {
        const { container } = render(<FeaturedItemsSkeleton />)
        expect(container.firstChild).toHaveClass("p-6", "w-full", "max-w-330", "mx-auto", "overflow-x-hidden")
    })

    it("should render flex container for cards", () => {
        const { container } = render(<FeaturedItemsSkeleton />)
        const flexContainer = container.querySelector(".flex.justify-start")
        expect(flexContainer).toBeInTheDocument()
    })
})
