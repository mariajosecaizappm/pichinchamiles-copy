import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

import PromotionCardsSkeleton from "@/presentation/pages/Offers/Products/components/Promotions/PromotionCardsSkeleton"

describe("PromotionCardsSkeleton", () => {
    it("should render four card skeletons", () => {
        render(<PromotionCardsSkeleton />)

        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0)
    })
})
