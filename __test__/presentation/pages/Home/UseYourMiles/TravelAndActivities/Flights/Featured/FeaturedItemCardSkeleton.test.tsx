import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

import FeaturedItemCardSkeleton from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured/FeaturedItemCardSkeleton"

describe("FeaturedItemCardSkeleton", () => {
    it("should render multiple skeleton elements", () => {
        render(<FeaturedItemCardSkeleton />)
        const skeletons = screen.getAllByTestId("skeleton")
        expect(skeletons.length).toBeGreaterThan(0)
    })

    it("should have card container with correct classes", () => {
        const { container } = render(<FeaturedItemCardSkeleton />)
        expect(container.firstChild).toHaveClass("h-77.5", "min-w-62.5", "rounded-lg", "overflow-hidden", "border")
    })

    it("should render image skeleton", () => {
        const { container } = render(<FeaturedItemCardSkeleton />)
        const imageSkeleton = container.querySelector(".w-full.h-38\\.75")
        expect(imageSkeleton).toBeInTheDocument()
    })

    it("should render content area with padding", () => {
        const { container } = render(<FeaturedItemCardSkeleton />)
        const contentArea = container.querySelector(".py-4.px-5")
        expect(contentArea).toBeInTheDocument()
    })
})
