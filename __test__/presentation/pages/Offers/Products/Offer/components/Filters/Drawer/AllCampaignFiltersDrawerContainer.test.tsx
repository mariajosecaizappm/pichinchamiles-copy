import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import AllCampaignFiltersDrawerContainer from "@/presentation/pages/Offers/Products/Offer/components/Filters/Drawer/AllCampaignFiltersDrawerContainer"
import type { OrderByValue } from "@/presentation/pages/Products/components/ProductsFilters/types"

const {
    mockOnOpen,
    mockOnOpenChange,
    mockApplyMany,
    mockResetOrderBy,
    mockResetBrand,
    mockResetCampaignCategory,
    mockSetOrderByState,
    mockSetCampaignCategoryState,
    mockSetBrandState,
    mockUseDisclosure,
    mockUseProductSearch,
    mockUseProductsOfferContext,
    mockUseProductBrands,
    mockUseFilterNavigation,
    mockUseFilterDraft,
    mockBuildOrderBySearchParams,
    mockBuildSingleKeyParams,
    CLEAR_ALL_FILTERS_PARAMS,
} = vi.hoisted(() => ({
    mockOnOpen: vi.fn(),
    mockOnOpenChange: vi.fn(),
    mockApplyMany: vi.fn(),
    mockResetOrderBy: vi.fn(),
    mockResetBrand: vi.fn(),
    mockResetCampaignCategory: vi.fn(),
    mockSetOrderByState: vi.fn(),
    mockSetCampaignCategoryState: vi.fn(),
    mockSetBrandState: vi.fn(),
    mockUseDisclosure: vi.fn(),
    mockUseProductSearch: vi.fn(),
    mockUseProductsOfferContext: vi.fn(),
    mockUseProductBrands: vi.fn(),
    mockUseFilterNavigation: vi.fn(),
    mockUseFilterDraft: vi.fn(),
    mockBuildOrderBySearchParams: vi.fn(),
    mockBuildSingleKeyParams: vi.fn(),
    CLEAR_ALL_FILTERS_PARAMS: {
        brand: null,
        category: null,
        sort: null,
    },
}))

vi.mock("@heroui/react", () => ({
    useDisclosure: () => mockUseDisclosure(),
    Divider: ({ className }: { className?: string }) => (
        <div data-testid="divider" className={className} />
    ),
}))

vi.mock("@/presentation/hooks/useProductSearch", () => ({
    default: () => mockUseProductSearch(),
}))

vi.mock(
    "@/presentation/pages/Offers/Products/Offer/context/useProductsOfferContext",
    () => ({
        default: () => mockUseProductsOfferContext(),
    })
)

vi.mock("@/presentation/pages/Products/hooks/useProductBrands", () => ({
    default: (args: unknown) => mockUseProductBrands(args),
}))

vi.mock("@/presentation/pages/Products/hooks/useFilterNavigation", () => ({
    default: () => mockUseFilterNavigation(),
}))

vi.mock("@/presentation/pages/Products/hooks/useFilterDraft", () => ({
    default: (committed: unknown) => mockUseFilterDraft(committed),
}))

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/ProductsFiltersConfig",
    () => ({
        buildOrderBySearchParams: (v: unknown) => mockBuildOrderBySearchParams(v),
        buildSingleKeyParams: (key: string, value: unknown) =>
            mockBuildSingleKeyParams(key, value),
        CLEAR_ALL_FILTERS_PARAMS,
    })
)

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/AllFiltersDrawer/AllFiltersDrawer",
    () => ({
        default: ({
            isOpen,
            onOpen,
            onOpenChange,
            handleClose,
            onClearFilters,
            onApplyFilters,
            children,
        }: {
            isOpen: boolean
            onOpen: () => void
            onOpenChange: () => void
            handleClose: () => void
            onClearFilters: () => void
            onApplyFilters: () => void
            children: React.ReactNode
        }) => (
            <div data-testid="all-filters-drawer" data-open={String(isOpen)}>
                <button type="button" data-testid="open-btn" onClick={onOpen}>
                    open
                </button>
                <button type="button" data-testid="close-btn" onClick={handleClose}>
                    close
                </button>
                <button type="button" data-testid="clear-btn" onClick={onClearFilters}>
                    clear
                </button>
                <button type="button" data-testid="apply-btn" onClick={onApplyFilters}>
                    apply
                </button>
                <button
                    type="button"
                    data-testid="open-change-btn"
                    onClick={onOpenChange}
                >
                    openChange
                </button>
                {children}
            </div>
        ),
    })
)

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/OrderBy/OrderByOptions",
    () => ({
        default: ({
            selectedOption,
            onSelectOption,
        }: {
            selectedOption: OrderByValue | null
            onSelectOption: (v: OrderByValue | null) => void
        }) => (
            <div
                data-testid="order-by-options"
                data-selected={String(selectedOption)}
            >
                <button
                    type="button"
                    data-testid="select-order"
                    onClick={() => onSelectOption("price_asc" as OrderByValue)}
                >
                    select order
                </button>
            </div>
        ),
    })
)

vi.mock(
    "@/presentation/pages/Offers/Products/Offer/components/Filters/Categories/CampaignCategoriesDrawer/CampaignCategoriesSection",
    () => ({
        default: ({
            campaignCategoryIds,
            selectedCategory,
            onSelectCategory,
        }: {
            campaignCategoryIds: string[]
            selectedCategory: string | null
            onSelectCategory: (v: string | null) => void
        }) => (
            <div
                data-testid="campaign-categories-section"
                data-ids={campaignCategoryIds.join(",")}
                data-selected={String(selectedCategory)}
            >
                <button
                    type="button"
                    data-testid="select-category"
                    onClick={() => onSelectCategory("cat-1")}
                >
                    select category
                </button>
            </div>
        ),
    })
)

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/BrandsOptions",
    () => ({
        default: ({
            isLoading,
            brands,
            selectedBrand,
            onSelectBrand,
        }: {
            isLoading: boolean
            brands: { id: string; name: string }[]
            selectedBrand: string | null
            onSelectBrand: (v: string | null) => void
        }) => (
            <div
                data-testid="brands-options"
                data-loading={String(isLoading)}
                data-selected={String(selectedBrand)}
                data-brands={brands.map((b) => b.id).join(",")}
            >
                <button
                    type="button"
                    data-testid="select-brand"
                    onClick={() => onSelectBrand("brand-1")}
                >
                    select brand
                </button>
            </div>
        ),
    })
)

function setupFilterDraftMocks() {
    let call = 0
    mockUseFilterDraft.mockImplementation((committed: unknown) => {
        const idx = call % 3
        call += 1
        const map = [
            { setDraft: mockSetOrderByState, reset: mockResetOrderBy },
            {
                setDraft: mockSetCampaignCategoryState,
                reset: mockResetCampaignCategory,
            },
            { setDraft: mockSetBrandState, reset: mockResetBrand },
        ] as const
        return {
            draft: committed,
            setDraft: map[idx].setDraft,
            reset: map[idx].reset,
        }
    })
}

describe("AllCampaignFiltersDrawerContainer", () => {
    const defaultBrands = [
        { id: "brand-1", name: "Brand One" },
        { id: "brand-2", name: "Brand Two" },
    ]

    beforeEach(() => {
        vi.clearAllMocks()

        mockUseDisclosure.mockReturnValue({
            isOpen: false,
            onOpen: mockOnOpen,
            onOpenChange: mockOnOpenChange,
        })

        mockUseProductSearch.mockReturnValue({
            searchValues: {
                sort: null,
                category: null,
                brand: null,
            },
        })

        mockUseProductsOfferContext.mockReturnValue({
            brandIds: ["brand-1", "brand-2"],
        })

        mockUseProductBrands.mockReturnValue({
            brands: defaultBrands,
            isLoading: false,
        })

        mockUseFilterNavigation.mockReturnValue({
            applyMany: mockApplyMany,
        })

        setupFilterDraftMocks()

        mockBuildOrderBySearchParams.mockReturnValue({ sort: "price_asc" })
        mockBuildSingleKeyParams.mockImplementation(
            (key: string, value: unknown) => ({
                [key]: value,
            })
        )
    })

    it("renders AllFiltersDrawer", () => {
        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(screen.getByTestId("all-filters-drawer")).toBeInTheDocument()
    })

    it("forwards onOpen from useDisclosure", () => {
        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        fireEvent.click(screen.getByTestId("open-btn"))
        expect(mockOnOpen).toHaveBeenCalled()
    })

    it("forwards onOpenChange from useDisclosure", () => {
        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        fireEvent.click(screen.getByTestId("open-change-btn"))
        expect(mockOnOpenChange).toHaveBeenCalled()
    })

    it("passes isOpen to AllFiltersDrawer", () => {
        mockUseDisclosure.mockReturnValue({
            isOpen: true,
            onOpen: mockOnOpen,
            onOpenChange: mockOnOpenChange,
        })
        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(screen.getByTestId("all-filters-drawer")).toHaveAttribute(
            "data-open",
            "true"
        )
    })

    it("initializes drafts from searchValues (including category array)", () => {
        mockUseProductSearch.mockReturnValue({
            searchValues: {
                sort: "relevance" as OrderByValue,
                category: ["cat-from-url"],
                brand: "brand-from-url",
            },
        })
        setupFilterDraftMocks()

        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )

        expect(mockUseFilterDraft).toHaveBeenNthCalledWith(1, "relevance")
        expect(mockUseFilterDraft).toHaveBeenNthCalledWith(2, "cat-from-url")
        expect(mockUseFilterDraft).toHaveBeenNthCalledWith(3, "brand-from-url")
    })

    it("initializes category draft from string category", () => {
        mockUseProductSearch.mockReturnValue({
            searchValues: {
                sort: null,
                category: "cat-string",
                brand: null,
            },
        })
        setupFilterDraftMocks()

        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )

        expect(mockUseFilterDraft).toHaveBeenNthCalledWith(2, "cat-string")
    })

    it("initializes category draft as null when category is missing", () => {
        mockUseProductSearch.mockReturnValue({
            searchValues: {
                sort: null,
                category: undefined,
                brand: null,
            },
        })
        setupFilterDraftMocks()

        render(<AllCampaignFiltersDrawerContainer campaignCategoryIds={[]} />)

        expect(mockUseFilterDraft).toHaveBeenNthCalledWith(2, null)
    })

    it("initializes category draft as null when category is an empty array", () => {
        mockUseProductSearch.mockReturnValue({
            searchValues: {
                sort: null,
                category: [],
                brand: null,
            },
        })
        setupFilterDraftMocks()

        render(<AllCampaignFiltersDrawerContainer campaignCategoryIds={[]} />)

        expect(mockUseFilterDraft).toHaveBeenNthCalledWith(2, null)
    })

    it("treats empty brand string as null", () => {
        mockUseProductSearch.mockReturnValue({
            searchValues: {
                sort: null,
                category: null,
                brand: "",
            },
        })
        setupFilterDraftMocks()

        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={[]} />
        )

        expect(mockUseFilterDraft).toHaveBeenNthCalledWith(3, null)
    })

    it("resets drafts to committed values on close", () => {
        mockUseProductSearch.mockReturnValue({
            searchValues: {
                sort: "price_desc" as OrderByValue,
                category: "cat-committed",
                brand: "brand-committed",
            },
        })
        setupFilterDraftMocks()

        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )

        fireEvent.click(screen.getByTestId("close-btn"))

        expect(mockResetOrderBy).toHaveBeenCalledWith("price_desc")
        expect(mockResetBrand).toHaveBeenCalledWith("brand-committed")
        expect(mockResetCampaignCategory).toHaveBeenCalledWith("cat-committed")
    })

    it("clears all filters, resets drafts to null and closes drawer", () => {
        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )

        fireEvent.click(screen.getByTestId("clear-btn"))

        expect(mockApplyMany).toHaveBeenCalledWith(CLEAR_ALL_FILTERS_PARAMS)
        expect(mockResetOrderBy).toHaveBeenCalledWith(null)
        expect(mockResetBrand).toHaveBeenCalledWith(null)
        expect(mockResetCampaignCategory).toHaveBeenCalledWith(null)
        expect(mockOnOpenChange).toHaveBeenCalled()
    })

    it("applies orderBy, brand and category together via applyMany", () => {
        let call = 0
        mockUseFilterDraft.mockImplementation(() => {
            const drafts = [
                {
                    draft: "price_asc" as OrderByValue,
                    setDraft: mockSetOrderByState,
                    reset: mockResetOrderBy,
                },
                {
                    draft: "cat-1",
                    setDraft: mockSetCampaignCategoryState,
                    reset: mockResetCampaignCategory,
                },
                {
                    draft: "brand-1",
                    setDraft: mockSetBrandState,
                    reset: mockResetBrand,
                },
            ]
            return drafts[call++ % 3]
        })

        mockBuildOrderBySearchParams.mockReturnValue({ sort: "price_asc" })
        mockBuildSingleKeyParams
            .mockReturnValueOnce({ brand: "brand-1" })
            .mockReturnValueOnce({ category: "cat-1" })

        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )

        fireEvent.click(screen.getByTestId("apply-btn"))

        expect(mockBuildOrderBySearchParams).toHaveBeenCalledWith("price_asc")
        expect(mockBuildSingleKeyParams).toHaveBeenCalledWith("brand", "brand-1")
        expect(mockBuildSingleKeyParams).toHaveBeenCalledWith("category", "cat-1")
        expect(mockApplyMany).toHaveBeenCalledWith({
            sort: "price_asc",
            brand: "brand-1",
            category: "cat-1",
        })
        expect(mockOnOpenChange).toHaveBeenCalled()
    })

    it("forwards onSelectOption to setOrderByState", () => {
        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={[]} />
        )
        fireEvent.click(screen.getByTestId("select-order"))
        expect(mockSetOrderByState).toHaveBeenCalledWith("price_asc")
    })

    it("forwards onSelectCategory to setCampaignCategoryState", () => {
        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        fireEvent.click(screen.getByTestId("select-category"))
        expect(mockSetCampaignCategoryState).toHaveBeenCalledWith("cat-1")
    })

    it("forwards onSelectBrand to setBrandState", () => {
        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        fireEvent.click(screen.getByTestId("select-brand"))
        expect(mockSetBrandState).toHaveBeenCalledWith("brand-1")
    })

    it("does not render CampaignCategoriesSection when campaignCategoryIds is empty", () => {
        render(<AllCampaignFiltersDrawerContainer campaignCategoryIds={[]} />)
        expect(
            screen.queryByTestId("campaign-categories-section")
        ).not.toBeInTheDocument()
    })

    it("renders CampaignCategoriesSection when campaignCategoryIds has items", () => {
        render(
            <AllCampaignFiltersDrawerContainer
                campaignCategoryIds={["cat-1", "cat-2"]}
            />
        )
        const section = screen.getByTestId("campaign-categories-section")
        expect(section).toBeInTheDocument()
        expect(section).toHaveAttribute("data-ids", "cat-1,cat-2")
    })

    it("renders Divider when campaign categories section is shown", () => {
        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(screen.getAllByTestId("divider").length).toBeGreaterThanOrEqual(1)
    })

    it("does not render BrandsOptions when brands list is empty", () => {
        mockUseProductBrands.mockReturnValue({
            brands: [],
            isLoading: false,
        })
        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        expect(screen.queryByTestId("brands-options")).not.toBeInTheDocument()
    })

    it("renders BrandsOptions and forwards isLoading when brands exist", () => {
        mockUseProductBrands.mockReturnValue({
            brands: defaultBrands,
            isLoading: true,
        })
        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        const brands = screen.getByTestId("brands-options")
        expect(brands).toBeInTheDocument()
        expect(brands).toHaveAttribute("data-loading", "true")
        expect(brands).toHaveAttribute("data-brands", "brand-1,brand-2")
    })

    it("renders Divider when brands section is shown", () => {
        mockUseProductBrands.mockReturnValue({
            brands: defaultBrands,
            isLoading: false,
        })
        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={[]} />
        )
        expect(screen.getByTestId("divider")).toBeInTheDocument()
    })

    it("runs handleClose body with all resets", () => {
        mockUseProductSearch.mockReturnValue({
            searchValues: {
                sort: "price_asc" as OrderByValue,
                category: "c1",
                brand: "b1",
            },
        })
        setupFilterDraftMocks()

        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        fireEvent.click(screen.getByTestId("close-btn"))

        expect(mockResetOrderBy).toHaveBeenCalledWith("price_asc")
        expect(mockResetBrand).toHaveBeenCalledWith("b1")
        expect(mockResetCampaignCategory).toHaveBeenCalledWith("c1")
    })

    it("runs handleClearFilters full body", () => {
        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        fireEvent.click(screen.getByTestId("clear-btn"))

        expect(mockApplyMany).toHaveBeenCalledWith(CLEAR_ALL_FILTERS_PARAMS)
        expect(mockResetOrderBy).toHaveBeenCalledWith(null)
        expect(mockResetBrand).toHaveBeenCalledWith(null)
        expect(mockResetCampaignCategory).toHaveBeenCalledWith(null)
        expect(mockOnOpenChange).toHaveBeenCalled()
    })

    it("runs handleApplyFilters full body", () => {
        let call = 0
        mockUseFilterDraft.mockImplementation(() => {
            const drafts = [
                { draft: "price_asc" as OrderByValue, setDraft: mockSetOrderByState, reset: mockResetOrderBy },
                { draft: "cat-1", setDraft: mockSetCampaignCategoryState, reset: mockResetCampaignCategory },
                { draft: "brand-1", setDraft: mockSetBrandState, reset: mockResetBrand },
            ]
            return drafts[call++ % 3]
        })
        mockBuildOrderBySearchParams.mockReturnValue({ sort: "price_asc" })
        mockBuildSingleKeyParams
            .mockReturnValueOnce({ brand: "brand-1" })
            .mockReturnValueOnce({ category: "cat-1" })

        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        fireEvent.click(screen.getByTestId("apply-btn"))

        expect(mockBuildOrderBySearchParams).toHaveBeenCalledWith("price_asc")
        expect(mockBuildSingleKeyParams).toHaveBeenCalledWith("brand", "brand-1")
        expect(mockBuildSingleKeyParams).toHaveBeenCalledWith("category", "cat-1")
        expect(mockApplyMany).toHaveBeenCalled()
        expect(mockOnOpenChange).toHaveBeenCalled()
    })

    it("renders both category and brand sections together", () => {
        mockUseProductBrands.mockReturnValue({
            brands: defaultBrands,
            isLoading: false,
        })
        render(
            <AllCampaignFiltersDrawerContainer
                campaignCategoryIds={["cat-1", "cat-2"]}
            />
        )

        expect(screen.getByTestId("campaign-categories-section")).toBeInTheDocument()
        expect(screen.getByTestId("brands-options")).toBeInTheDocument()
        expect(screen.getAllByTestId("divider").length).toBeGreaterThanOrEqual(2)
    })

    it("passes brands || [] into BrandsOptions", () => {
        mockUseProductBrands.mockReturnValue({
            brands: defaultBrands,
            isLoading: false,
        })
        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={[]} />
        )
        expect(screen.getByTestId("brands-options")).toHaveAttribute(
            "data-brands",
            "brand-1,brand-2"
        )
    })

    it("disables useProductBrands when drawer is closed", () => {
        mockUseDisclosure.mockReturnValue({
            isOpen: false,
            onOpen: mockOnOpen,
            onOpenChange: mockOnOpenChange,
        })
        render(<AllCampaignFiltersDrawerContainer campaignCategoryIds={[]} />)
        expect(mockUseProductBrands).toHaveBeenCalledWith({
            brands: ["brand-1", "brand-2"],
            enabled: false,
        })
    })

    it("enables useProductBrands only when drawer is open", () => {
        mockUseDisclosure.mockReturnValue({
            isOpen: true,
            onOpen: mockOnOpen,
            onOpenChange: mockOnOpenChange,
        })
        render(<AllCampaignFiltersDrawerContainer campaignCategoryIds={[]} />)
        expect(mockUseProductBrands).toHaveBeenCalledWith({
            brands: ["brand-1", "brand-2"],
            enabled: true,
        })
    })

    it("passes orderBy draft state to OrderByOptions", () => {
        let call = 0
        mockUseFilterDraft.mockImplementation(() => {
            const drafts = [
                {
                    draft: "price_desc" as OrderByValue,
                    setDraft: mockSetOrderByState,
                    reset: mockResetOrderBy,
                },
                {
                    draft: null,
                    setDraft: mockSetCampaignCategoryState,
                    reset: mockResetCampaignCategory,
                },
                {
                    draft: null,
                    setDraft: mockSetBrandState,
                    reset: mockResetBrand,
                },
            ]
            return drafts[call++ % 3]
        })

        render(<AllCampaignFiltersDrawerContainer campaignCategoryIds={[]} />)

        expect(screen.getByTestId("order-by-options")).toHaveAttribute(
            "data-selected",
            "price_desc"
        )
    })

    it("passes category and brand draft state to sections", () => {
        let call = 0
        mockUseFilterDraft.mockImplementation(() => {
            const drafts = [
                {
                    draft: null,
                    setDraft: mockSetOrderByState,
                    reset: mockResetOrderBy,
                },
                {
                    draft: "cat-selected",
                    setDraft: mockSetCampaignCategoryState,
                    reset: mockResetCampaignCategory,
                },
                {
                    draft: "brand-selected",
                    setDraft: mockSetBrandState,
                    reset: mockResetBrand,
                },
            ]
            return drafts[call++ % 3]
        })

        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )

        expect(screen.getByTestId("campaign-categories-section")).toHaveAttribute(
            "data-selected",
            "cat-selected"
        )
        expect(screen.getByTestId("brands-options")).toHaveAttribute(
            "data-selected",
            "brand-selected"
        )
    })

    it("applies null drafts without crashing", () => {
        mockBuildOrderBySearchParams.mockReturnValue({ sort: null })
        mockBuildSingleKeyParams
            .mockReturnValueOnce({ brand: null })
            .mockReturnValueOnce({ category: null })

        render(
            <AllCampaignFiltersDrawerContainer campaignCategoryIds={["cat-1"]} />
        )
        fireEvent.click(screen.getByTestId("apply-btn"))

        expect(mockApplyMany).toHaveBeenCalledWith({
            sort: null,
            brand: null,
            category: null,
        })
    })

    it("does not render brands section when brands is undefined", () => {
        mockUseProductBrands.mockReturnValue({
            brands: undefined,
            isLoading: false,
        })
        render(<AllCampaignFiltersDrawerContainer campaignCategoryIds={[]} />)
        expect(screen.queryByTestId("brands-options")).not.toBeInTheDocument()
    })
})