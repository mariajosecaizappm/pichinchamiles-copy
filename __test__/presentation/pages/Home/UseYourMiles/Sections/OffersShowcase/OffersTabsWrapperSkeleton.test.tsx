import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import OffersTabsWrapperSkeleton from "@/presentation/pages/Home/UseYourMiles/Sections/OffersShowcase/OffersTabsWrapperSkeleton"

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => <div data-testid="skeleton" className={className} />,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/Layout/Tabs/components/TabLinksSkeleton", () => ({
    default: () => <div data-testid="tab-links-skeleton" />,
}))

describe("OffersTabsWrapperSkeleton", () => {
    it("should render the title skeleton", () => {
        const { container } = render(
            <OffersTabsWrapperSkeleton>
                <div data-testid="child">Child content</div>
            </OffersTabsWrapperSkeleton>
        )

        expect(container.querySelector('[data-testid="skeleton"]')).toBeInTheDocument()
    })

    it("should render TabLinksSkeleton", () => {
        render(
            <OffersTabsWrapperSkeleton>
                <div data-testid="child">Child content</div>
            </OffersTabsWrapperSkeleton>
        )

        expect(screen.getByTestId("tab-links-skeleton")).toBeInTheDocument()
    })

    it("should render the provided children", () => {
        render(
            <OffersTabsWrapperSkeleton>
                <div data-testid="child">Child content</div>
            </OffersTabsWrapperSkeleton>
        )

        expect(screen.getByTestId("child")).toHaveTextContent("Child content")
    })
})
