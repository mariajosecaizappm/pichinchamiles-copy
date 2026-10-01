import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { Category } from "@/domain/entity/Category/structure/category"

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/FilterDrawer",
    () => ({
        default: ({
            children,
            triggerLabel,
            onApplyFilters,
            onClearFilters,
            onClose,
            isOpen,
            onOpenChange,
            filterKeys,
        }: {
            children: React.ReactNode
            triggerLabel: string
            onApplyFilters: () => void
            onClearFilters: () => void
            onClose: () => void
            isOpen: boolean
            onOpenChange: (open: boolean) => void
            filterKeys: string
        }) => (
            <div data-testid="filter-drawer" data-open={String(isOpen)} data-filter-keys={filterKeys}>
                <span data-testid="trigger-label">{triggerLabel}</span>
                <button data-testid="apply" onClick={onApplyFilters}>apply</button>
                <button data-testid="clear" onClick={onClearFilters}>clear</button>
                <button data-testid="close" onClick={onClose}>close</button>
                <button data-testid="toggle-open" onClick={() => onOpenChange(!isOpen)}>toggle</button>
                {children}
            </div>
        ),
    }),
)

vi.mock(
    "@/presentation/pages/Offers/Products/Offer/components/Filters/Categories/CampaignCategoriesDrawer/CampaignCategoriesOptions",
    () => ({
        default: ({ isLoading, categories }: { isLoading: boolean; categories: Category[] }) => (
            <div
                data-testid="campaign-categories-options"
                data-loading={String(isLoading)}
                data-count={categories.length}
            />
        ),
    }),
)

import CampaignCategoriesDrawer from "@/presentation/pages/Offers/Products/Offer/components/Filters/Categories/CampaignCategoriesDrawer/CampaignCategoriesDrawer"

const mockCategories: Category[] = [
    { id: "cat-1", name: "Category 1", slug: "/cat-1", parent: null },
    { id: "cat-2", name: "Category 2", slug: "/cat-2", parent: null },
]

const defaultProps = {
    isOpen: false,
    onOpenChange: vi.fn(),
    categories: mockCategories,
    onApplyFilters: vi.fn(),
    onClearFilters: vi.fn(),
    onClose: vi.fn(),
    selectedCategory: null,
    onSelectCategory: vi.fn(),
}

describe("CampaignCategoriesDrawer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render FilterDrawer with trigger label 'Categorías'", () => {
        render(<CampaignCategoriesDrawer {...defaultProps} />)

        expect(screen.getByTestId("trigger-label")).toHaveTextContent("Categorías")
    })

    it("should pass isOpen to FilterDrawer", () => {
        render(<CampaignCategoriesDrawer {...defaultProps} isOpen={true} />)

        expect(screen.getByTestId("filter-drawer")).toHaveAttribute("data-open", "true")
    })

    it("should call onApplyFilters when apply is clicked", () => {
        const onApplyFilters = vi.fn()
        render(<CampaignCategoriesDrawer {...defaultProps} onApplyFilters={onApplyFilters} />)

        fireEvent.click(screen.getByTestId("apply"))

        expect(onApplyFilters).toHaveBeenCalledTimes(1)
    })

    it("should call onClearFilters when clear is clicked", () => {
        const onClearFilters = vi.fn()
        render(<CampaignCategoriesDrawer {...defaultProps} onClearFilters={onClearFilters} />)

        fireEvent.click(screen.getByTestId("clear"))

        expect(onClearFilters).toHaveBeenCalledTimes(1)
    })

    it("should call onClose when close is clicked", () => {
        const onClose = vi.fn()
        render(<CampaignCategoriesDrawer {...defaultProps} onClose={onClose} />)

        fireEvent.click(screen.getByTestId("close"))

        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it("should render CampaignCategoriesOptions with categories", () => {
        render(<CampaignCategoriesDrawer {...defaultProps} />)

        expect(screen.getByTestId("campaign-categories-options")).toHaveAttribute("data-count", "2")
    })

    it("should default isLoading to false", () => {
        render(<CampaignCategoriesDrawer {...defaultProps} />)

        expect(screen.getByTestId("campaign-categories-options")).toHaveAttribute("data-loading", "false")
    })

    it("should pass filterKeys as PRODUCT_SEARCH_KEYS.category", () => {
        render(<CampaignCategoriesDrawer {...defaultProps} />)

        expect(screen.getByTestId("filter-drawer")).toHaveAttribute("data-filter-keys", "category")
    })
})