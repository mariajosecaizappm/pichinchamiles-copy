import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { EventName } from "@/presentation/analytics/types"
import { mockTrack } from "../../../../../../utils/analytics"

const mockOnChangeFilter = vi.fn()
let mockSearchValues: { category?: string } = {}
const mockUseProductCampaingCategories = vi.fn()

vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => ({
        searchValues: mockSearchValues,
        onChangeFilter: mockOnChangeFilter,
    }),
}))

// Hook swapped: useProductCampaingCategories(params, enabled) -> nested { data: { data } }
vi.mock("@/presentation/hooks/queries/products/useProductCampaingCategories", () => ({
    useProductCampaingCategories: (params: unknown, enabled: boolean) =>
        mockUseProductCampaingCategories(params, enabled),
}))

// Confirmed on-disk location via `find`: the container and CampaignCategoriesFilter
// both live under Offers/Products/Offer/components/Filters/Categories/.
vi.mock(
    "@/presentation/pages/Offers/Products/Offer/components/Filters/Categories/CampaignCategoriesFilter",
    () => ({
        default: (props: Record<string, unknown>) => (
            <div
                data-testid="campaign-categories-filter"
                data-loading={String(props.isLoading)}
                data-show-all={String(props.showAllCategories)}
            >
                <button
                    data-testid="check-cat-1"
                    onClick={() => (props.onCheckCategory as (v: string) => void)("cat-1")}
                >
                    check cat-1
                </button>
                <button
                    data-testid="open-accordion"
                    onClick={() => (props.onAccordionOpenChange as (v: boolean) => void)(true)}
                >
                    open
                </button>
                <button
                    data-testid="toggle-show-all"
                    onClick={() => (props.setShowAllCategories as (v: boolean) => void)(true)}
                >
                    show all
                </button>
                <span data-testid="current-category">{props.currentCategory as string}</span>
                <span data-testid="pending">{String(props.isPendingTransition)}</span>
                <div
                    data-testid="press-cat-1"
                    onPointerDown={() =>
                        (props.onPressCategory as (e: unknown, c: { id: string }) => void)(
                            { preventDefault: vi.fn(), stopPropagation: vi.fn() },
                            { id: "cat-1" }
                        )
                    }
                >
                    press cat-1
                </div>
            </div>
        ),
    }),
)

import CampaignCategoriesFilterContainer from "@/presentation/pages/Offers/Products/Offer/components/Filters/Categories/CampaignCategoriesFilterContainer"

describe("CampaignCategoriesFilterContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockTrack.mockReset()
        mockSearchValues = {}
        mockUseProductCampaingCategories.mockReturnValue({ data: { data: [] }, isLoading: false })
    })

    it("should call useProductCampaingCategories with the nested data.data shape unpacked to categories", () => {
        mockUseProductCampaingCategories.mockReturnValue({
            data: { data: [{ id: "cat-1", name: "Cat 1", slug: "/cat-1", parent: null }] },
            isLoading: false,
        })

        render(<CampaignCategoriesFilterContainer campaignCategoryIds={["cat-1"]} />)

        expect(screen.getByTestId("campaign-categories-filter")).toBeInTheDocument()
    })

    it("should not fetch until the accordion is opened (enabled flag)", () => {
        render(<CampaignCategoriesFilterContainer campaignCategoryIds={["cat-1"]} />)

        expect(mockUseProductCampaingCategories).toHaveBeenCalledWith({ id: ["cat-1"] }, false)
    })

    it("should enable the fetch once onAccordionOpenChange fires with true", () => {
        render(<CampaignCategoriesFilterContainer campaignCategoryIds={["cat-1"]} />)

        fireEvent.click(screen.getByTestId("open-accordion"))

        expect(mockUseProductCampaingCategories).toHaveBeenLastCalledWith({ id: ["cat-1"] }, true)
    })

    it("should keep the query disabled when campaignCategoryIds is empty even if accordion opens", () => {
        render(<CampaignCategoriesFilterContainer campaignCategoryIds={[]} />)

        fireEvent.click(screen.getByTestId("open-accordion"))

        expect(mockUseProductCampaingCategories).toHaveBeenLastCalledWith({ id: [] }, false)
    })

    it("should track CLICKED_FILTERS with the matched category on check", () => {
        mockUseProductCampaingCategories.mockReturnValue({
            data: { data: [{ id: "cat-1", name: "Cat 1", slug: "/cat-1", parent: null }] },
            isLoading: false,
        })

        render(<CampaignCategoriesFilterContainer campaignCategoryIds={["cat-1"]} />)

        fireEvent.click(screen.getByTestId("check-cat-1"))

        expect(mockTrack).toHaveBeenCalledWith(EventName.CLICKED_FILTERS, {
            type: "category",
            filter: { id: "cat-1", name: "Cat 1", slug: "/cat-1", parent: null },
        })
    })

    it("should call onChangeFilter with the category key and value on check", () => {
        render(<CampaignCategoriesFilterContainer campaignCategoryIds={["cat-1"]} />)

        fireEvent.click(screen.getByTestId("check-cat-1"))

        expect(mockOnChangeFilter).toHaveBeenCalledWith("category", "cat-1")
    })

    it("should not call onChangeFilter when the clicked category is already current", () => {
        mockSearchValues = { category: "cat-1" }
        render(<CampaignCategoriesFilterContainer campaignCategoryIds={["cat-1"]} />)

        fireEvent.click(screen.getByTestId("check-cat-1"))

        expect(mockOnChangeFilter).not.toHaveBeenCalled()
    })

    it("should default categories to an empty array when data is undefined", () => {
        mockUseProductCampaingCategories.mockReturnValue({ data: undefined, isLoading: false })

        render(<CampaignCategoriesFilterContainer campaignCategoryIds={["cat-1"]} />)

        expect(screen.getByTestId("campaign-categories-filter")).toBeInTheDocument()
    })

    it("should pass isLoading through to CampaignCategoriesFilter", () => {
        mockUseProductCampaingCategories.mockReturnValue({ data: { data: [] }, isLoading: true })

        render(<CampaignCategoriesFilterContainer campaignCategoryIds={["cat-1"]} />)

        expect(screen.getByTestId("campaign-categories-filter")).toHaveAttribute("data-loading", "true")
    })

    it("should pass currentCategory from searchValues.category", () => {
        mockSearchValues = { category: "cat-9" }
        render(<CampaignCategoriesFilterContainer campaignCategoryIds={["cat-1"]} />)

        expect(screen.getByTestId("current-category")).toHaveTextContent("cat-9")
    })

    it("should clear the category on pointerDown when the current category is selected", () => {
        mockSearchValues = { category: "cat-1" }
        mockUseProductCampaingCategories.mockReturnValue({
            data: { data: [{ id: "cat-1", name: "Cat 1", slug: "/cat-1", parent: null }] },
            isLoading: false,
        })

        render(<CampaignCategoriesFilterContainer campaignCategoryIds={["cat-1"]} />)

        fireEvent.pointerDown(screen.getByTestId("press-cat-1"))

        expect(mockOnChangeFilter).toHaveBeenCalledWith("category", "")
    })

    it("should not change the category on pointerDown when a different category is selected", () => {
        mockSearchValues = { category: "cat-2" }
        mockUseProductCampaingCategories.mockReturnValue({
            data: { data: [{ id: "cat-1", name: "Cat 1", slug: "/cat-1", parent: null }] },
            isLoading: false,
        })

        render(<CampaignCategoriesFilterContainer campaignCategoryIds={["cat-1"]} />)

        fireEvent.pointerDown(screen.getByTestId("press-cat-1"))

        expect(mockOnChangeFilter).not.toHaveBeenCalled()
    })

    it("should toggle showAllCategories when setShowAllCategories is called", () => {
        mockUseProductCampaingCategories.mockReturnValue({
            data: { data: [{ id: "cat-1", name: "Cat 1", slug: "/cat-1", parent: null }] },
            isLoading: false,
        })

        render(<CampaignCategoriesFilterContainer campaignCategoryIds={["cat-1"]} />)

        fireEvent.click(screen.getByTestId("toggle-show-all"))

        expect(screen.getByTestId("campaign-categories-filter")).toHaveAttribute(
            "data-show-all",
            "true",
        )
    })
})