import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { Category } from "@/domain/entity/Category/structure/category"
import { EventName } from "@/presentation/analytics/types"
import { mockTrack } from "../../../../../../../utils/analytics"

vi.mock("@/presentation/pages/Products/components/ProductsFilters/FilterAccordion", () => ({
    default: ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div data-testid="filter-accordion" data-title={title}>{children}</div>
    ),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/ToggleFilter", () => ({
    default: ({ children, isActive, onPress }: { children: React.ReactNode; isActive: boolean; onPress: () => void }) => (
        <button
            data-testid="toggle-filter"
            data-active={String(isActive)}
            onClick={onPress}
        >
            {children}
        </button>
    ),
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/ToggleFilterSkeleton", () => ({
    default: () => <div data-testid="toggle-filter-skeleton" />,
}))

vi.mock("@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/ShowAllFilters", () => ({
    default: ({ showAll, setShowAll }: { showAll: boolean; setShowAll: (v: boolean) => void }) => (
        <button data-testid="show-all-filters" data-show-all={String(showAll)} onClick={() => setShowAll(!showAll)}>
            {showAll ? "Ver menos" : "Ver todos"}
        </button>
    ),
}))

import CampaignCategoriesOptions from "@/presentation/pages/Offers/Products/Offer/components/Filters/Categories/CampaignCategoriesDrawer/CampaignCategoriesOptions"

const buildCategory = (overrides: Partial<Category> = {}): Category => ({
    id: "cat-1",
    name: "Category 1",
    slug: "/cat-1",
    parent: null,
    ...overrides,
})

describe("CampaignCategoriesOptions", () => {
    const defaultProps = {
        isLoading: false,
        categories: [buildCategory({ id: "cat-1", name: "Category 1" })],
        selectedCategory: null,
        onSelectCategory: vi.fn(),
    }

    beforeEach(() => {
        vi.clearAllMocks()
        mockTrack.mockReset()
    })

    it("should render inside a FilterAccordion with title 'Categorías'", () => {
        render(<CampaignCategoriesOptions {...defaultProps} />)

        expect(screen.getByTestId("filter-accordion")).toHaveAttribute("data-title", "Categorías")
    })

    it("should render skeletons when loading", () => {
        render(<CampaignCategoriesOptions {...defaultProps} isLoading={true} />)

        expect(screen.getAllByTestId("toggle-filter-skeleton")).toHaveLength(3)
    })

    it("should render category toggle filters when not loading", () => {
        const categories = [
            buildCategory({ id: "cat-1", name: "Category 1" }),
            buildCategory({ id: "cat-2", name: "Category 2" }),
        ]
        render(<CampaignCategoriesOptions {...defaultProps} categories={categories} />)

        const filters = screen.getAllByTestId("toggle-filter")
        expect(filters).toHaveLength(2)
        expect(filters[0]).toHaveTextContent("Category 1")
        expect(filters[1]).toHaveTextContent("Category 2")
    })

    it("should mark selected category as active", () => {
        render(<CampaignCategoriesOptions {...defaultProps} selectedCategory="cat-1" />)

        expect(screen.getByTestId("toggle-filter")).toHaveAttribute("data-active", "true")
    })

    it("should call onSelectCategory with null when active category is pressed", () => {
        const onSelectCategory = vi.fn()
        render(
            <CampaignCategoriesOptions
                {...defaultProps}
                selectedCategory="cat-1"
                onSelectCategory={onSelectCategory}
            />,
        )

        fireEvent.click(screen.getByTestId("toggle-filter"))

        expect(onSelectCategory).toHaveBeenCalledWith(null)
    })

    it("should call onSelectCategory with category id when inactive category is pressed", () => {
        const onSelectCategory = vi.fn()
        render(
            <CampaignCategoriesOptions
                {...defaultProps}
                selectedCategory={null}
                onSelectCategory={onSelectCategory}
            />,
        )

        fireEvent.click(screen.getByTestId("toggle-filter"))

        expect(onSelectCategory).toHaveBeenCalledWith("cat-1")
        expect(mockTrack).toHaveBeenCalledWith(EventName.CLICKED_FILTERS, {
            type: "category",
            filter: defaultProps.categories[0],
        })
    })

    it("should not show ShowAllFilters when categories count is at or below limit", () => {
        render(<CampaignCategoriesOptions {...defaultProps} />)

        expect(screen.queryByTestId("show-all-filters")).not.toBeInTheDocument()
    })

    it("should not show ShowAllFilters at the exact display limit", () => {
        const categories = Array.from({ length: 7 }, (_, i) =>
            buildCategory({ id: `cat-${i}`, name: `Category ${i}` }),
        )
        render(<CampaignCategoriesOptions {...defaultProps} categories={categories} />)

        expect(screen.queryByTestId("show-all-filters")).not.toBeInTheDocument()
    })

    it("should show ShowAllFilters when categories exceed the display limit", () => {
        const categories = Array.from({ length: 8 }, (_, i) =>
            buildCategory({ id: `cat-${i}`, name: `Category ${i}` }),
        )
        render(<CampaignCategoriesOptions {...defaultProps} categories={categories} />)

        expect(screen.getByTestId("show-all-filters")).toBeInTheDocument()
    })

    it("should show all categories after clicking ShowAllFilters", () => {
        const categories = Array.from({ length: 8 }, (_, i) =>
            buildCategory({ id: `cat-${i}`, name: `Category ${i}` }),
        )
        render(<CampaignCategoriesOptions {...defaultProps} categories={categories} />)

        expect(screen.getAllByTestId("toggle-filter")).toHaveLength(7)

        fireEvent.click(screen.getByTestId("show-all-filters"))

        expect(screen.getAllByTestId("toggle-filter")).toHaveLength(8)
    })
})
