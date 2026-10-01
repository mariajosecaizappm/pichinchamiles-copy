import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import DesktopOfferFilters from "@/presentation/pages/Offers/Products/Offer/components/Filters/DesktopOfferFilters"

vi.mock(
    "@/presentation/pages/Offers/Products/Offer/components/Filters/Categories",
    () => ({
        default: ({ campaignCategoryIds }: { campaignCategoryIds: string[] }) => (
            <div
                data-testid="campaign-categories-filter"
                data-ids={campaignCategoryIds.join(",")}
            />
        ),
    })
)

vi.mock(
    "@/presentation/pages/Offers/Products/Offer/components/Filters/Brands",
    () => ({
        default: () => <div data-testid="campaign-brand-filter" />,
    })
)

describe("DesktopOfferFilters", () => {
    it("renders categories filter when campaignCategoryIds has items", () => {
        render(
            <DesktopOfferFilters campaignCategoryIds={["cat-1", "cat-2"]} />
        )
        expect(screen.getByTestId("campaign-categories-filter")).toHaveAttribute(
            "data-ids",
            "cat-1,cat-2"
        )
        expect(screen.getByTestId("campaign-brand-filter")).toBeInTheDocument()
    })

    it("does not render categories filter when campaignCategoryIds is empty", () => {
        render(<DesktopOfferFilters campaignCategoryIds={[]} />)
        expect(
            screen.queryByTestId("campaign-categories-filter")
        ).not.toBeInTheDocument()
        expect(screen.getByTestId("campaign-brand-filter")).toBeInTheDocument()
    })

    it("does not render categories filter when campaignCategoryIds is falsy", () => {
        render(
            <DesktopOfferFilters
                campaignCategoryIds={null as unknown as string[]}
            />
        )
        expect(
            screen.queryByTestId("campaign-categories-filter")
        ).not.toBeInTheDocument()
        expect(screen.getByTestId("campaign-brand-filter")).toBeInTheDocument()
    })
})