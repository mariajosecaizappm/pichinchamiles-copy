import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className} />
    ),
}))

import ProductOfferBannerSkeleton from "@/presentation/pages/Offers/Products/Offer/components/Banner/ProductOfferBannerSkeleton"

describe("ProductOfferBannerSkeleton", () => {
    it("should render a skeleton element", () => {
        render(<ProductOfferBannerSkeleton />)

        expect(screen.getByTestId("skeleton")).toBeInTheDocument()
    })

    it("should apply banner sizing classes", () => {
        render(<ProductOfferBannerSkeleton />)

        const skeleton = screen.getByTestId("skeleton")
        expect(skeleton).toHaveClass("w-full", "h-40", "md:h-50", "rounded-lg")
    })
})
