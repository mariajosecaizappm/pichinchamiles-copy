import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"

vi.mock("@heroui/react", () => ({
    Skeleton: ({className}: {className: string}) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

import HomeFeaturedRewardCardSkeleton from "@/presentation/pages/Home/components/HomeFeaturedRewards/componenets/HomeFeaturedRewardCardSkeleton"

describe("HomeFeaturedRewardCardSkeleton", () => {
    it("should render skeleton placeholders", () => {
        render(<HomeFeaturedRewardCardSkeleton />)
        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0)
    })

    it("should render the card container with border", () => {
        const {container} = render(<HomeFeaturedRewardCardSkeleton />)
        const card = container.firstElementChild
        expect(card?.className).toContain("border")
        expect(card?.className).toContain("rounded")
    })
})
