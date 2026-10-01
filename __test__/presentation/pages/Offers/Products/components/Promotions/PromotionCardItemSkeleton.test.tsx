import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

import PromotionCardItemSkeleton from "@/presentation/pages/Offers/Products/components/Promotions/PromotionCardItemSkeleton"

describe("PromotionCardItemSkeleton", () => {
    it("should render skeleton placeholders", () => {
        render(<PromotionCardItemSkeleton />)

        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0)
    })
})
