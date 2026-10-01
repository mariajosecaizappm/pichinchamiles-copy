import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"

vi.mock("@heroui/react", () => ({
    Skeleton: ({className}: {className: string}) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

import HomeRedemptionCardSkeleton from "@/presentation/pages/Home/components/HomeRedemptionCategories/components/HomeRedemptionItemCardSkeleton"

describe("HomeRedemptionCardSkeleton", () => {
    it("should render skeleton placeholders", () => {
        render(<HomeRedemptionCardSkeleton />)
        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0)
    })

    it("should render the card container with border", () => {
        const {container} = render(<HomeRedemptionCardSkeleton />)
        const card = container.firstElementChild
        expect(card?.className).toContain("border")
        expect(card?.className).toContain("rounded")
    })
})
