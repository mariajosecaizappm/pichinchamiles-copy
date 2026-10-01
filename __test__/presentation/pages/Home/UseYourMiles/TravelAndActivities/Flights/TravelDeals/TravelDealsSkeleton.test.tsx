import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className} />
    ),
    cn: (...classes: (string | undefined | false | null)[]) => classes.filter(Boolean).join(" "),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured/FeaturedItemCardSkeleton", () => ({
    default: () => <div data-testid="featured-item-card-skeleton" />,
}))


import TravelDealsSkeleton from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/TravelDeals/TravelDealsSkeleton"

describe("TravelDealsSkeleton", () => {
    it("should render skeleton elements", () => {
        render(<TravelDealsSkeleton />)
        const skeletons = screen.getAllByTestId("skeleton")
        expect(skeletons.length).toBeGreaterThan(0)
    })

    it("should render 6 FeaturedItemCardSkeleton components", () => {
        render(<TravelDealsSkeleton />)
        const cardSkeletons = screen.getAllByTestId("featured-item-card-skeleton")
        expect(cardSkeletons).toHaveLength(6)
    })

    it("should have bg-grayscale-50 background", () => {
        const { container } = render(<TravelDealsSkeleton />)
        expect(container.firstChild).toHaveClass("bg-grayscale-50")
    })

    it("should render tab skeleton placeholders", () => {
        const { container } = render(<TravelDealsSkeleton />)
        const tabPlaceholders = container.querySelectorAll(".w-34.h-12")
        expect(tabPlaceholders).toHaveLength(4)
    })
})
