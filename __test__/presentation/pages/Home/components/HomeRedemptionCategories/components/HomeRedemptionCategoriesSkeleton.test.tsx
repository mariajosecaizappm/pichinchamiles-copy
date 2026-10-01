import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"

vi.mock("@heroui/react", () => ({
    Skeleton: ({className}: {className: string}) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

vi.mock("@/presentation/pages/Home/components/HomeRedemptionCategories/components/HomeRedemptionItemCardSkeleton", () => ({
    default: () => <div data-testid="card-skeleton">CardSkeleton</div>,
}))

import HomeRedemptionCategoriesSkeleton from "@/presentation/pages/Home/components/HomeRedemptionCategories/components/HomeRedemptionCategoriesSkeleton"

describe("HomeRedemptionCategoriesSkeleton", () => {
    it("should render skeleton placeholders", () => {
        render(<HomeRedemptionCategoriesSkeleton />)
        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0)
    })

    it("should render card skeletons for mobile and desktop", () => {
        render(<HomeRedemptionCategoriesSkeleton />)
        expect(screen.getAllByTestId("card-skeleton").length).toBe(9)
    })
})
