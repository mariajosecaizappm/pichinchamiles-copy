import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"

vi.mock("@heroui/react", () => ({
    Skeleton: ({className}: {className: string}) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

vi.mock("@/presentation/pages/Home/components/HomeFeaturedRewards/componenets/HomeFeaturedRewardCardSkeleton", () => ({
    default: () => <div data-testid="card-skeleton">CardSkeleton</div>,
}))

import HomeFeaturedRewardsSkeleton from "@/presentation/pages/Home/components/HomeFeaturedRewards/componenets/HomeFeaturedRewardsSkeleton"

describe("HomeFeaturedRewardsSkeleton", () => {
    it("should render skeleton placeholders", () => {
        render(<HomeFeaturedRewardsSkeleton />)
        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0)
    })

    it("should render card skeletons for mobile and desktop", () => {
        render(<HomeFeaturedRewardsSkeleton />)
        expect(screen.getAllByTestId("card-skeleton").length).toBe(9)
    })
})
