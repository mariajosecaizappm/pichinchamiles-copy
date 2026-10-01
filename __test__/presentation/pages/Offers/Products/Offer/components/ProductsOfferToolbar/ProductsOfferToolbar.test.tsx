import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import ProductsOfferToolbar from "@/presentation/pages/Offers/Products/Offer/components/ProductsOfferToolbar/ProductsOfferToolbar"

vi.mock("@/presentation/pages/Products/components/ProductsToolbar/ProductsToolbar", () => ({
    default: ({
        filtersDrawer,
        mobileFilters,
    }: {
        filtersDrawer: React.ReactNode
        mobileFilters: React.ReactNode
    }) => (
        <div data-testid="products-toolbar">
            {filtersDrawer}
            {mobileFilters}
        </div>
    ),
}))

vi.mock("@/presentation/pages/Offers/Products/Offer/components/Filters/Drawer", () => ({
    default: ({ campaignCategoryIds }: { campaignCategoryIds: string[] }) => (
        <span
            data-testid="filters-drawer"
            data-categories={JSON.stringify(campaignCategoryIds)}
        />
    ),
}))

vi.mock(
    "@/presentation/pages/Offers/Products/Offer/components/Filters/MobileCampaignFilters/MobileCampaignFilters",
    () => ({
        default: ({ campaignCategoryIds }: { campaignCategoryIds: string[] }) => (
            <span
                data-testid="mobile-filters"
                data-categories={JSON.stringify(campaignCategoryIds)}
            />
        ),
    }),
)

describe("ProductsOfferToolbar", () => {
    it("passes campaignCategoryIds to the filters drawer and mobile filters", () => {
        render(<ProductsOfferToolbar campaignCategoryIds={["cat-1", "cat-2"]} />)

        expect(screen.getByTestId("filters-drawer")).toHaveAttribute(
            "data-categories",
            JSON.stringify(["cat-1", "cat-2"]),
        )
        expect(screen.getByTestId("mobile-filters")).toHaveAttribute(
            "data-categories",
            JSON.stringify(["cat-1", "cat-2"]),
        )
    })
})
