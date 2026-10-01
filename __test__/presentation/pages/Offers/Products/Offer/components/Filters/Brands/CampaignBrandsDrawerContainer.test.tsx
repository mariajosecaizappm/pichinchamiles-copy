import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import CampaignBrandsDrawerContainer from "@/presentation/pages/Offers/Products/Offer/components/Filters/Brands/CampaignBrandsDrawer"

const { mockUseProductsOfferContext } = vi.hoisted(() => ({
    mockUseProductsOfferContext: vi.fn(),
}))

vi.mock(
    "@/presentation/pages/Offers/Products/Offer/context/useProductsOfferContext",
    () => ({
        default: () => mockUseProductsOfferContext(),
    })
)

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/BrandsDrawerBaseContainer",
    () => ({
        default: ({ brandIds }: { brandIds: string[] }) => (
            <div
                data-testid="brands-drawer-base"
                data-brand-ids={brandIds?.join(",") ?? ""}
            />
        ),
    })
)

describe("CampaignBrandsDrawerContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("passes brandIds from context to BrandsDrawerBaseContainer", () => {
        mockUseProductsOfferContext.mockReturnValue({
            brandIds: ["b1", "b2"],
        })
        render(<CampaignBrandsDrawerContainer />)
        expect(screen.getByTestId("brands-drawer-base")).toHaveAttribute(
            "data-brand-ids",
            "b1,b2"
        )
    })

    it("passes empty brandIds", () => {
        mockUseProductsOfferContext.mockReturnValue({ brandIds: [] })
        render(<CampaignBrandsDrawerContainer />)
        expect(screen.getByTestId("brands-drawer-base")).toHaveAttribute(
            "data-brand-ids",
            ""
        )
    })
})