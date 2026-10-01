import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import MobileCampaignFilters from "@/presentation/pages/Offers/Products/Offer/components/Filters/MobileCampaignFilters/MobileCampaignFilters"


vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/MobileFiltersWrapper",
    () => ({
        default: ({
            className,
            children,
        }: {
            className?: string
            children: React.ReactNode
        }) => (
            <div data-testid="mobile-filters-wrapper" data-class={className ?? ""}>
                {children}
            </div>
        ),
    })
)

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/OrderBy",
    () => ({
        default: () => <div data-testid="order-by-drawer" />,
    })
)

vi.mock(
    "@/presentation/pages/Offers/Products/Offer/components/Filters/Categories/CampaignCategoriesDrawer",
    () => ({
        default: ({ campaignCategoryIds }: { campaignCategoryIds: string[] }) => (
            <div
                data-testid="campaign-categories-drawer"
                data-ids={campaignCategoryIds.join(",")}
            />
        ),
    })
)

vi.mock(
    "@/presentation/pages/Offers/Products/Offer/components/Filters/Brands/CampaignBrandsDrawer",
    () => ({
        default: () => <div data-testid="campaign-brands-drawer" />,
    })
)

describe("MobileCampaignFilters", () => {
    it("renders order by, categories and brands when categories exist", () => {
        render(
            <MobileCampaignFilters
                campaignCategoryIds={["cat-1"]}
                className="mobile"
            />
        )
        expect(screen.getByTestId("mobile-filters-wrapper")).toHaveAttribute(
            "data-class",
            "mobile"
        )
        expect(screen.getByTestId("order-by-drawer")).toBeInTheDocument()
        expect(screen.getByTestId("campaign-categories-drawer")).toHaveAttribute(
            "data-ids",
            "cat-1"
        )
        expect(screen.getByTestId("campaign-brands-drawer")).toBeInTheDocument()
    })

    it("omits categories drawer when campaignCategoryIds is empty", () => {
        render(<MobileCampaignFilters campaignCategoryIds={[]} />)
        expect(screen.getByTestId("order-by-drawer")).toBeInTheDocument()
        expect(
            screen.queryByTestId("campaign-categories-drawer")
        ).not.toBeInTheDocument()
        expect(screen.getByTestId("campaign-brands-drawer")).toBeInTheDocument()
    })

    it("omits categories drawer when campaignCategoryIds is falsy", () => {
        render(
            <MobileCampaignFilters
                campaignCategoryIds={null as unknown as string[]}
            />
        )
        expect(
            screen.queryByTestId("campaign-categories-drawer")
        ).not.toBeInTheDocument()
        expect(screen.getByTestId("campaign-brands-drawer")).toBeInTheDocument()
    })
})