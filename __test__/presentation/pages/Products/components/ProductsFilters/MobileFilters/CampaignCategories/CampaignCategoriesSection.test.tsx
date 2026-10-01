import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

const mockUseProductCampaingCategories = vi.fn()

// Hook swapped: useProductCampaingCategories(params, enabled) -> { data: { data }, isLoading }
vi.mock("@/presentation/hooks/queries/products/useProductCampaingCategories", () => ({
    useProductCampaingCategories: (params: unknown, enabled: boolean) =>
        mockUseProductCampaingCategories(params, enabled),
}))

// Path fixed: CampaignCategoriesOptions lives alongside CampaignCategoriesSection
// under Offers/.../Filters/Categories/CampaignCategoriesDrawer/
vi.mock(
    "@/presentation/pages/Offers/Products/Offer/components/Filters/Categories/CampaignCategoriesDrawer/CampaignCategoriesOptions",
    () => ({
        default: ({
            isLoading,
            categories,
            selectedCategory,
        }: {
            isLoading: boolean
            categories: { id: string; name: string }[]
            selectedCategory: string | null
        }) => (
            <div
                data-testid="campaign-categories-options"
                data-loading={String(isLoading)}
                data-selected={selectedCategory ?? "none"}
                data-count={categories.length}
            />
        ),
    }),
)

import CampaignCategoriesSection from "@/presentation/pages/Offers/Products/Offer/components/Filters/Categories/CampaignCategoriesDrawer/CampaignCategoriesSection"

describe("CampaignCategoriesSection", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should pass isLoading to CampaignCategoriesOptions", () => {
        mockUseProductCampaingCategories.mockReturnValue({ data: { data: [] }, isLoading: true })

        render(
            <CampaignCategoriesSection
                campaignCategoryIds={["cat-1"]}
                selectedCategory={null}
                onSelectCategory={vi.fn()}
            />,
        )

        expect(screen.getByTestId("campaign-categories-options")).toHaveAttribute("data-loading", "true")
    })

    it("should pass categories to CampaignCategoriesOptions using the nested data.data shape", () => {
        mockUseProductCampaingCategories.mockReturnValue({
            data: { data: [{ id: "cat-1", name: "Cat 1", slug: "/cat-1", parent: null }] },
            isLoading: false,
        })

        render(
            <CampaignCategoriesSection
                campaignCategoryIds={["cat-1"]}
                selectedCategory={null}
                onSelectCategory={vi.fn()}
            />,
        )

        expect(screen.getByTestId("campaign-categories-options")).toHaveAttribute("data-count", "1")
    })

    it("should pass empty array when data is undefined", () => {
        mockUseProductCampaingCategories.mockReturnValue({ data: undefined, isLoading: false })

        render(
            <CampaignCategoriesSection
                campaignCategoryIds={[]}
                selectedCategory={null}
                onSelectCategory={vi.fn()}
            />,
        )

        expect(screen.getByTestId("campaign-categories-options")).toHaveAttribute("data-count", "0")
    })

    it("should pass selectedCategory to CampaignCategoriesOptions", () => {
        mockUseProductCampaingCategories.mockReturnValue({ data: { data: [] }, isLoading: false })

        render(
            <CampaignCategoriesSection
                campaignCategoryIds={[]}
                selectedCategory="cat-1"
                onSelectCategory={vi.fn()}
            />,
        )

        expect(screen.getByTestId("campaign-categories-options")).toHaveAttribute("data-selected", "cat-1")
    })

    it("should call useProductCampaingCategories with { id: campaignCategoryIds } and enabled=true when ids exist", () => {
        mockUseProductCampaingCategories.mockReturnValue({ data: { data: [] }, isLoading: false })

        render(
            <CampaignCategoriesSection
                campaignCategoryIds={["id-1", "id-2"]}
                selectedCategory={null}
                onSelectCategory={vi.fn()}
            />,
        )

        expect(mockUseProductCampaingCategories).toHaveBeenCalledWith({ id: ["id-1", "id-2"] }, true)
    })

    it("should call useProductCampaingCategories with enabled=false when campaignCategoryIds is empty", () => {
        mockUseProductCampaingCategories.mockReturnValue({ data: { data: [] }, isLoading: false })

        render(
            <CampaignCategoriesSection
                campaignCategoryIds={[]}
                selectedCategory={null}
                onSelectCategory={vi.fn()}
            />,
        )

        expect(mockUseProductCampaingCategories).toHaveBeenCalledWith({ id: [] }, false)
    })

    it("should call useProductCampaingCategories with enabled=false when the enabled prop is explicitly false", () => {
        mockUseProductCampaingCategories.mockReturnValue({ data: { data: [] }, isLoading: false })

        render(
            <CampaignCategoriesSection
                campaignCategoryIds={["id-1"]}
                selectedCategory={null}
                onSelectCategory={vi.fn()}
                enabled={false}
            />,
        )

        expect(mockUseProductCampaingCategories).toHaveBeenCalledWith({ id: ["id-1"] }, false)
    })
})