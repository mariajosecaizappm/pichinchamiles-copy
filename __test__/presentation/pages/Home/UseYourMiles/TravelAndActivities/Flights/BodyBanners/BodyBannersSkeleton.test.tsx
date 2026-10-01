import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

import BodyBannersSkeleton from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/BodyBanners/BodyBannersSkeleton"

describe("BodyBannersSkeleton", () => {
    it("should render multiple skeleton elements", () => {
        render(<BodyBannersSkeleton />)
        const skeletons = screen.getAllByTestId("skeleton")
        expect(skeletons.length).toBeGreaterThan(0)
    })

    it("should render a grid container", () => {
        const { container } = render(<BodyBannersSkeleton />)
        const grid = container.querySelector(".grid.grid-cols-2")
        expect(grid).toBeInTheDocument()
    })

    it("should render three banner sections", () => {
        const { container } = render(<BodyBannersSkeleton />)
        const colSpan2 = container.querySelectorAll(".col-span-2")
        const colSpan1 = container.querySelectorAll(".col-span-1")
        expect(colSpan2).toHaveLength(1)
        expect(colSpan1).toHaveLength(2)
    })

    it("should have correct wrapper classes", () => {
        const { container } = render(<BodyBannersSkeleton />)
        expect(container.firstChild).toHaveClass("p-6", "w-full", "max-w-330", "mx-auto")
    })
})
