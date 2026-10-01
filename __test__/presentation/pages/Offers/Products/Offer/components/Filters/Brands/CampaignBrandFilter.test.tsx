import { render, screen, fireEvent } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import CampaignBrandFilter from "@/presentation/pages/Offers/Products/Offer/components/Filters/Brands/CampaignBrandFilter"

const mockUseProductsOfferContext = vi.fn()

vi.mock("@/presentation/pages/Offers/Products/Offer/context/useProductsOfferContext", () => ({
    default: () => mockUseProductsOfferContext(),
}))

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/Brands/BrandFilterBaseContainer",
    () => ({
        default: (props: Record<string, unknown>) => (
            <div
                data-testid="brand-filter-base"
                data-brand-ids={JSON.stringify(props.brandIds)}
                data-enabled={String(props.enabled)}
                onClick={() => (props.onAccordionOpenChange as (v: boolean) => void)(true)}
            />
        ),
    }),
)

describe("CampaignBrandFilter", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseProductsOfferContext.mockReturnValue({
            brandIds: [],
            setBrandIds: vi.fn(),
        })
    })

    it("returns null when there are no brand ids", () => {
        const { container } = render(<CampaignBrandFilter />)

        expect(container.firstChild).toBeNull()
    })

    it("renders BrandFilterBaseContainer with brand ids", () => {
        mockUseProductsOfferContext.mockReturnValue({
            brandIds: ["brand-1", "brand-2"],
            setBrandIds: vi.fn(),
        })

        render(<CampaignBrandFilter />)

        expect(screen.getByTestId("brand-filter-base")).toHaveAttribute(
            "data-brand-ids",
            JSON.stringify(["brand-1", "brand-2"]),
        )
        expect(screen.getByTestId("brand-filter-base")).toHaveAttribute("data-enabled", "false")
    })

    it("updates enabled state when the accordion open change callback fires", () => {
        mockUseProductsOfferContext.mockReturnValue({
            brandIds: ["brand-1"],
            setBrandIds: vi.fn(),
        })

        render(<CampaignBrandFilter />)

        fireEvent.click(screen.getByTestId("brand-filter-base"))

        expect(screen.getByTestId("brand-filter-base")).toHaveAttribute("data-enabled", "true")
    })
})
