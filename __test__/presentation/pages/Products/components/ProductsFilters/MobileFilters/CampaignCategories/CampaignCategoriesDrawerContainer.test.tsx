import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { EventName } from "@/presentation/analytics/types"
import { mockTrack } from "../../../../../../../utils/analytics"

const {
    mockPush,
    mockReplace,
    mockSetDraft,
    mockReset,
    mockUseProductCampaingCategories,
    mockUseFilterDraft,
} = vi.hoisted(() => ({
    mockPush: vi.fn(),
    mockReplace: vi.fn(),
    mockSetDraft: vi.fn(),
    mockReset: vi.fn(),
    mockUseProductCampaingCategories: vi.fn(),
    mockUseFilterDraft: vi.fn(),
}))

let mockSearchParams = new URLSearchParams()
let mockSearchValues: {
    brand: string
    sort: string
    recommended: boolean
    search: string
    category: string
} = {
    brand: "",
    sort: "",
    recommended: false,
    search: "",
    category: "",
}
let mockCategories: Array<{
    id: string
    name: string
    slug: string
    parent: null
}> = []
let mockIsLoading = false

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush, replace: mockReplace }),
    usePathname: () => "/ofertas/productos/test-slug",
    useSearchParams: () => mockSearchParams,
}))

vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => ({
        searchValues: mockSearchValues,
        searchParams: mockSearchParams,
        onChangeFilter: vi.fn(),
    }),
}))

vi.mock(
    "@/presentation/hooks/queries/products/useProductCampaingCategories",
    () => ({
        useProductCampaingCategories: (params: unknown, enabled: boolean) =>
            mockUseProductCampaingCategories(params, enabled),
    })
)

vi.mock("@/presentation/pages/Products/hooks/useFilterDraft", () => ({
    default: (initial: unknown) => mockUseFilterDraft(initial),
}))

vi.mock(
    "@/presentation/pages/Offers/Products/Offer/components/Filters/Categories/CampaignCategoriesDrawer/CampaignCategoriesDrawer",
    () => ({
        default: (props: Record<string, unknown>) => (
            <div
                data-testid="campaign-categories-drawer"
                data-open={String(props.isOpen)}
                data-loading={String(props.isLoading)}
                data-disabled={String(props.disabled)}
                data-categories-count={
                    Array.isArray(props.categories) ? props.categories.length : 0
                }
            >
                <button
                    data-testid="apply"
                    onClick={props.onApplyFilters as () => void}
                >
                    apply
                </button>
                <button
                    data-testid="clear"
                    onClick={props.onClearFilters as () => void}
                >
                    clear
                </button>
                <button data-testid="close" onClick={props.onClose as () => void}>
                    close
                </button>
                <button
                    data-testid="toggle-open"
                    onClick={() => (props.onOpenChange as (v: boolean) => void)(true)}
                >
                    open
                </button>
                <button
                    data-testid="toggle-close"
                    onClick={() => (props.onOpenChange as (v: boolean) => void)(false)}
                >
                    close-open
                </button>
                <button
                    data-testid="select-category"
                    onClick={() =>
                        (props.onSelectCategory as (v: string | null) => void)("cat-2")
                    }
                >
                    select
                </button>
                <span data-testid="selected-category">
                    {String(props.selectedCategory)}
                </span>
            </div>
        ),
    })
)

import CampaignCategoriesDrawerContainer from "@/presentation/pages/Offers/Products/Offer/components/Filters/Categories/CampaignCategoriesDrawer/CampaignCategoriesDrawerContainer"

describe("CampaignCategoriesDrawerContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockTrack.mockReset()
        mockSearchParams = new URLSearchParams()
        mockSearchValues = {
            brand: "",
            sort: "",
            recommended: false,
            search: "",
            category: "",
        }
        mockCategories = [
            { id: "cat-1", name: "Category 1", slug: "/cat-1", parent: null },
        ]
        mockIsLoading = false

        mockUseProductCampaingCategories.mockImplementation(() => ({
            data: { data: mockCategories },
            isLoading: mockIsLoading,
        }))

        mockUseFilterDraft.mockImplementation((initial: unknown) => ({
            draft: initial,
            setDraft: mockSetDraft,
            reset: mockReset,
        }))
    })

    it("renders the drawer when campaignCategoryIds has items", () => {
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(
            screen.getByTestId("campaign-categories-drawer")
        ).toBeInTheDocument()
    })

    it("returns null when campaignCategoryIds is empty", () => {
        const { container } = render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={[]} />
        )
        expect(container.firstChild).toBeNull()
    })

    it("tracks VIEWED_FILTER when categories are non-empty", () => {
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(mockTrack).toHaveBeenCalledWith(EventName.VIEWED_FILTER, {
            filters: mockCategories,
        })
    })

    it("does not track VIEWED_FILTER when categories data is empty", () => {
        mockUseProductCampaingCategories.mockImplementation(() => ({
            data: { data: [] },
            isLoading: false,
        }))
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(mockTrack).not.toHaveBeenCalledWith(
            EventName.VIEWED_FILTER,
            expect.anything()
        )
    })

    it("does not track VIEWED_FILTER when categories is undefined", () => {
        mockUseProductCampaingCategories.mockImplementation(() => ({
            data: undefined,
            isLoading: false,
        }))
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(mockTrack).not.toHaveBeenCalledWith(
            EventName.VIEWED_FILTER,
            expect.anything()
        )
    })

    it("calls router.push with selected category on apply and closes", () => {
        mockSearchValues = { ...mockSearchValues, category: "cat-1" }
        mockSearchParams = new URLSearchParams("category=cat-1")
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        fireEvent.click(screen.getByTestId("toggle-open"))
        fireEvent.click(screen.getByTestId("apply"))
        expect(mockPush).toHaveBeenCalled()
        expect(mockPush.mock.calls[0][0] as string).toContain("category=cat-1")
        expect(screen.getByTestId("campaign-categories-drawer")).toHaveAttribute(
            "data-open",
            "false"
        )
    })

    it("calls router.push clearing category when applied draft is null", () => {
        mockUseFilterDraft.mockImplementation(() => ({
            draft: null,
            setDraft: mockSetDraft,
            reset: mockReset,
        }))
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        fireEvent.click(screen.getByTestId("apply"))
        expect(mockPush.mock.calls[0][0] as string).not.toContain("category=")
    })

    it("calls router.replace clearing category on clear", () => {
        mockSearchValues = { ...mockSearchValues, category: "cat-1" }
        mockSearchParams = new URLSearchParams("category=cat-1")
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        fireEvent.click(screen.getByTestId("clear"))
        expect(mockReplace).toHaveBeenCalled()
        expect(mockReplace.mock.calls[0][0] as string).not.toContain("category=")
        expect(mockSetDraft).toHaveBeenCalledWith(null)
    })

    it("resets draft to committed category on close", () => {
        mockSearchValues = { ...mockSearchValues, category: "cat-1" }
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        fireEvent.click(screen.getByTestId("close"))
        expect(mockReset).toHaveBeenCalledWith("cat-1")
        expect(mockPush).not.toHaveBeenCalled()
        expect(mockReplace).not.toHaveBeenCalled()
    })

    it("resets draft to null on close when no category in URL", () => {
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        fireEvent.click(screen.getByTestId("close"))
        expect(mockReset).toHaveBeenCalledWith(null)
    })

    it("syncs selected category from URL", () => {
        mockSearchValues = { ...mockSearchValues, category: "cat-1" }
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(screen.getByTestId("selected-category")).toHaveTextContent("cat-1")
    })

    it("shows null selected category when URL has no category", () => {
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(screen.getByTestId("selected-category")).toHaveTextContent("null")
    })

    it("forwards onSelectCategory to setDraft", () => {
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        fireEvent.click(screen.getByTestId("select-category"))
        expect(mockSetDraft).toHaveBeenCalledWith("cat-2")
    })

    it("passes categories count to drawer", () => {
        mockCategories = [
            { id: "cat-1", name: "Category 1", slug: "/cat-1", parent: null },
            { id: "cat-2", name: "Category 2", slug: "/cat-2", parent: null },
        ]
        mockUseProductCampaingCategories.mockImplementation(() => ({
            data: { data: mockCategories },
            isLoading: false,
        }))
        render(
            <CampaignCategoriesDrawerContainer
                campaignCategoryIds={["cat-1", "cat-2"]}
            />
        )
        expect(screen.getByTestId("campaign-categories-drawer")).toHaveAttribute(
            "data-categories-count",
            "2"
        )
    })

    it("passes empty categories array when categories data is missing", () => {
        mockUseProductCampaingCategories.mockImplementation(() => ({
            data: undefined,
            isLoading: false,
        }))
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(screen.getByTestId("campaign-categories-drawer")).toHaveAttribute(
            "data-categories-count",
            "0"
        )
    })

    it("sets disabled false when categories is undefined", () => {
        mockUseProductCampaingCategories.mockImplementation(() => ({
            data: undefined,
            isLoading: false,
        }))
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(screen.getByTestId("campaign-categories-drawer")).toHaveAttribute(
            "data-disabled",
            "false"
        )
    })

    it("sets disabled false when categories is undefined", () => {
        mockUseProductCampaingCategories.mockImplementation(() => ({
            data: undefined,
            isLoading: false,
        }))
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(screen.getByTestId("campaign-categories-drawer")).toHaveAttribute(
            "data-disabled",
            "false"
        )
    })

    it("sets disabled false when categories exist", () => {
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(screen.getByTestId("campaign-categories-drawer")).toHaveAttribute(
            "data-disabled",
            "false"
        )
    })

    it("passes isLoading true to drawer", () => {
        mockUseProductCampaingCategories.mockImplementation(() => ({
            data: { data: mockCategories },
            isLoading: true,
        }))
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(screen.getByTestId("campaign-categories-drawer")).toHaveAttribute(
            "data-loading",
            "true"
        )
    })

    it("passes isLoading false when not loading", () => {
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(screen.getByTestId("campaign-categories-drawer")).toHaveAttribute(
            "data-loading",
            "false"
        )
    })

    it("enables query only when open and campaignCategoryIds is non-empty", () => {
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(mockUseProductCampaingCategories).toHaveBeenCalledWith(
            { id: ["cat-1"] },
            false
        )

        fireEvent.click(screen.getByTestId("toggle-open"))
        expect(mockUseProductCampaingCategories).toHaveBeenCalledWith(
            { id: ["cat-1"] },
            true
        )
    })

    it("keeps query disabled when campaignCategoryIds is empty", () => {
        render(<CampaignCategoriesDrawerContainer campaignCategoryIds={[]} />)
        expect(mockUseProductCampaingCategories).toHaveBeenCalledWith(
            { id: [] },
            false
        )
    })

    it("opens via handleOpenChange", () => {
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        fireEvent.click(screen.getByTestId("toggle-open"))
        expect(screen.getByTestId("campaign-categories-drawer")).toHaveAttribute(
            "data-open",
            "true"
        )
    })

    it("closes via handleOpenChange", () => {
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        fireEvent.click(screen.getByTestId("toggle-open"))
        fireEvent.click(screen.getByTestId("toggle-close"))
        expect(screen.getByTestId("campaign-categories-drawer")).toHaveAttribute(
            "data-open",
            "false"
        )
    })

    it("initializes useFilterDraft with committed category null", () => {
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(mockUseFilterDraft).toHaveBeenCalledWith(null)
    })

    it("initializes useFilterDraft with committed category from URL", () => {
        mockSearchValues = { ...mockSearchValues, category: "cat-9" }
        render(
            <CampaignCategoriesDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(mockUseFilterDraft).toHaveBeenCalledWith("cat-9")
    })
})