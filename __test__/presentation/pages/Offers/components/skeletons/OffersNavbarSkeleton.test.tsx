import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

import OffersNavbarSkeleton from "@/presentation/pages/Offers/components/skeletons/OffersNavbarSkeleton"

describe("OffersNavbarSkeleton", () => {
    it("should render navbar skeleton placeholders", () => {
        render(<OffersNavbarSkeleton />)

        expect(screen.getAllByTestId("skeleton")).toHaveLength(3)
    })
})
