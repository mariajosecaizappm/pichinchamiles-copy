import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

type HomeBannerCarouselSkeletonProps = {
    className?: string
}

vi.mock("@/presentation/pages/Home/components/HomeBannerCarousel/HomeBannerCarouselSkeleton", () => ({
    default: ({ className }: HomeBannerCarouselSkeletonProps) => (
        <div data-testid="home-banner-carousel-skeleton" data-classname={className} />
    ),
}))

vi.mock("@/presentation/pages/Home/components/HomeExploreProducts/components/NewItemsForYou/NewItemsForYouSkeleton", () => ({
    default: () => <div data-testid="new-items-for-you-skeleton" />,
}))

vi.mock("@/presentation/pages/Home/components/HomeExploreProducts/components/Offers/OffersSkeleton", () => ({
    default: () => <div data-testid="offers-skeleton" />,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/BodyBanners/BodyBannersSkeleton", () => ({
    default: () => <div data-testid="body-banners-skeleton" />,
}))

import HomeProductsSkeleton from "@/presentation/pages/Home/UseYourMiles/Products/HomeProductsSkeleton"

describe("HomeProductsSkeleton", () => {
    it("should render the home banner carousel skeleton with the correct className", () => {
        render(<HomeProductsSkeleton />)
        const skeleton = screen.getByTestId("home-banner-carousel-skeleton")
        expect(skeleton).toBeInTheDocument()
        expect(skeleton).toHaveAttribute("data-classname", "h-112.5 md:h-77.5")
    })

    it("should render the new items for you skeleton", () => {
        render(<HomeProductsSkeleton />)
        expect(screen.getByTestId("new-items-for-you-skeleton")).toBeInTheDocument()
    })

    it("should render the offers skeleton", () => {
        render(<HomeProductsSkeleton />)
        expect(screen.getByTestId("offers-skeleton")).toBeInTheDocument()
    })

    it("should render the body banners skeleton", () => {
        render(<HomeProductsSkeleton />)
        expect(screen.getByTestId("body-banners-skeleton")).toBeInTheDocument()
    })

    it("should render all skeleton sections in order", () => {
        const { container } = render(<HomeProductsSkeleton />)
        expect(container.children).toHaveLength(4)
        expect(container.children[0]).toContainElement(screen.getByTestId("home-banner-carousel-skeleton"))
        expect(container.children[1]).toContainElement(screen.getByTestId("new-items-for-you-skeleton"))
        expect(container.children[2]).toContainElement(screen.getByTestId("offers-skeleton"))
        expect(container.children[3]).toContainElement(screen.getByTestId("body-banners-skeleton"))
    })
})
