import { render, screen, fireEvent } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import DesktopOfferFiltersContainer from "@/presentation/pages/Offers/Products/Offer/components/Filters/DesktopOfferFiltersContainer"

const mockHandleClearFilters = vi.fn()
const mockUseFilterNavigation = vi.fn()

vi.mock("@/presentation/pages/Products/hooks/useFilterNavigation", () => ({
    default: (...args: unknown[]) => mockUseFilterNavigation(...args),
}))

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/DesktopFiltersWrapper",
    () => ({
        default: ({
            children,
            onClearFilters,
            isLoading,
            className,
        }: {
            children: React.ReactNode
            onClearFilters: () => void
            isLoading?: boolean
            className?: string
        }) => (
            <div
                data-testid="desktop-filters-wrapper"
                data-loading={String(isLoading)}
                data-class={className ?? ""}
            >
                <button data-testid="clear" onClick={onClearFilters}>
                    clear
                </button>
                {children}
            </div>
        ),
    }),
)

vi.mock(
    "@/presentation/pages/Offers/Products/Offer/components/Filters/DesktopOfferFilters",
    () => ({
        default: ({ campaignCategoryIds }: { campaignCategoryIds: string[] }) => (
            <div
                data-testid="desktop-offer-filters"
                data-categories={JSON.stringify(campaignCategoryIds)}
            />
        ),
    }),
)

describe("DesktopOfferFiltersContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseFilterNavigation.mockReturnValue({
            handleClearFilters: mockHandleClearFilters,
            isPending: true,
        })
    })

    it("calls useFilterNavigation with replace and transition", () => {
        render(<DesktopOfferFiltersContainer campaignCategoryIds={["cat-1"]} />)

        expect(mockUseFilterNavigation).toHaveBeenCalledWith({
            method: "replace",
            wrapTransition: true,
        })
    })

    it("passes the clear handler and loading state to DesktopFiltersWrapper", () => {
        render(<DesktopOfferFiltersContainer campaignCategoryIds={["cat-1"]} />)

        expect(screen.getByTestId("desktop-filters-wrapper")).toHaveAttribute(
            "data-loading",
            "true",
        )

        fireEvent.click(screen.getByTestId("clear"))

        expect(mockHandleClearFilters).toHaveBeenCalled()
    })

    it("renders DesktopOfferFilters with campaignCategoryIds", () => {
        render(<DesktopOfferFiltersContainer campaignCategoryIds={["cat-1", "cat-2"]} />)

        expect(screen.getByTestId("desktop-offer-filters")).toHaveAttribute(
            "data-categories",
            JSON.stringify(["cat-1", "cat-2"]),
        )
    })
})
