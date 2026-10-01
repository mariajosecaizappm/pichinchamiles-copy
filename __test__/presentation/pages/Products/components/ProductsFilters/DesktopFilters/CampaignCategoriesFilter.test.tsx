import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { Category } from "@/domain/entity/Category/structure/category"

vi.mock("@heroui/react", () => ({
    Accordion: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    AccordionItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Divider: () => <hr data-testid="divider" />,
    RadioGroup: ({
        children,
        value,
        onValueChange,
        isDisabled,
    }: {
        children: React.ReactNode
        value: string
        onValueChange: (v: string) => void
        isDisabled: boolean
    }) => (
        <div data-testid="radio-group" data-value={value} data-disabled={String(isDisabled)}>
            <button data-testid="change-value" onClick={() => onValueChange("cat-2")}>change</button>
            {children}
        </div>
    ),
    Skeleton: ({ className }: { className: string }) => <div data-testid="skeleton" className={className} />,
}))

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/FilterAccordion",
    () => ({
        default: ({
            title,
            children,
            onExpandedChange,
        }: {
            title: string
            children: React.ReactNode
            onExpandedChange?: (isOpen: boolean) => void
        }) => (
            <div data-testid="filter-accordion" data-title={title}>
                <button
                    data-testid="toggle-accordion"
                    onClick={() => onExpandedChange?.(true)}
                >
                    toggle
                </button>
                {children}
            </div>
        ),
    }),
)

vi.mock("@/presentation/components/Form/components/Radio", () => ({
    Radio: ({ children, value }: { children: React.ReactNode; value: string }) => (
        <div data-testid="radio-option" data-value={value}>{children}</div>
    ),
}))

vi.mock(
    "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/ShowAllFilters",
    () => ({
        default: ({ showAll, setShowAll }: { showAll: boolean; setShowAll: (v: boolean) => void }) => (
            <button data-testid="show-all" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Ver menos" : "Ver todos"}
            </button>
        ),
    }),
)

import CampaignCategoriesFilter from "@/presentation/pages/Offers/Products/Offer/components/Filters/Categories/CampaignCategoriesFilter"

const buildCategory = (overrides: Partial<Category> = {}): Category => ({
    id: "cat-1",
    name: "Category 1",
    slug: "/cat-1",
    parent: null,
    ...overrides,
})

const defaultProps = {
    categories: [buildCategory()],
    isLoading: false,
    showAllCategories: false,
    setShowAllCategories: vi.fn(),
    currentCategory: "",
    onCheckCategory: vi.fn(),
    onPressCategory: vi.fn(),
    isPendingTransition: false,
}

describe("CampaignCategoriesFilter", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render FilterAccordion with title 'Categorías'", () => {
        render(<CampaignCategoriesFilter {...defaultProps} />)

        expect(screen.getByTestId("filter-accordion")).toHaveAttribute("data-title", "Categorías")
    })

    it("should render a Divider", () => {
        render(<CampaignCategoriesFilter {...defaultProps} />)

        expect(screen.getByTestId("divider")).toBeInTheDocument()
    })

    it("should render skeletons when loading", () => {
        render(<CampaignCategoriesFilter {...defaultProps} isLoading={true} />)

        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0)
    })

    it("should render category radio options when not loading", () => {
        const categories = [
            buildCategory({ id: "cat-1", name: "Category 1" }),
            buildCategory({ id: "cat-2", name: "Category 2" }),
        ]
        render(<CampaignCategoriesFilter {...defaultProps} categories={categories} />)

        const options = screen.getAllByTestId("radio-option")
        expect(options).toHaveLength(2)
        expect(options[0]).toHaveTextContent("Category 1")
    })

    it("should pass currentCategory as RadioGroup value", () => {
        render(<CampaignCategoriesFilter {...defaultProps} currentCategory="cat-1" />)

        expect(screen.getByTestId("radio-group")).toHaveAttribute("data-value", "cat-1")
    })

    it("should call onCheckCategory when RadioGroup value changes", () => {
        const onCheckCategory = vi.fn()
        render(<CampaignCategoriesFilter {...defaultProps} onCheckCategory={onCheckCategory} />)

        fireEvent.click(screen.getByTestId("change-value"))

        expect(onCheckCategory).toHaveBeenCalledWith("cat-2")
    })

    it("should disable RadioGroup when isPendingTransition is true", () => {
        render(<CampaignCategoriesFilter {...defaultProps} isPendingTransition={true} />)

        expect(screen.getByTestId("radio-group")).toHaveAttribute("data-disabled", "true")
    })

    it("should show ShowAllFilters when categories exceed default limit", () => {
        const categories = Array.from({ length: 8 }, (_, i) =>
            buildCategory({ id: `cat-${i}`, name: `Category ${i}` }),
        )
        render(<CampaignCategoriesFilter {...defaultProps} categories={categories} />)

        expect(screen.getByTestId("show-all")).toBeInTheDocument()
    })

    it("should not show ShowAllFilters when categories are within limit", () => {
        render(<CampaignCategoriesFilter {...defaultProps} />)

        expect(screen.queryByTestId("show-all")).not.toBeInTheDocument()
    })

    it("should not show ShowAllFilters at the exact default limit", () => {
        const categories = Array.from({ length: 7 }, (_, i) =>
            buildCategory({ id: `cat-${i}`, name: `Category ${i}` }),
        )
        render(<CampaignCategoriesFilter {...defaultProps} categories={categories} />)

        expect(screen.queryByTestId("show-all")).not.toBeInTheDocument()
    })

    it("should show all categories when showAllCategories is true", () => {
        const categories = Array.from({ length: 8 }, (_, i) =>
            buildCategory({ id: `cat-${i}`, name: `Category ${i}` }),
        )
        render(
            <CampaignCategoriesFilter
                {...defaultProps}
                categories={categories}
                showAllCategories={true}
            />
        )

        expect(screen.getAllByTestId("radio-option")).toHaveLength(8)
    })

    it("should call onPressCategory on pointer down", () => {
        const onPressCategory = vi.fn()
        const categories = [
            buildCategory({ id: "cat-1", name: "Category 1" }),
            buildCategory({ id: "cat-2", name: "Category 2" }),
        ]
        render(
            <CampaignCategoriesFilter
                {...defaultProps}
                categories={categories}
                onPressCategory={onPressCategory}
            />
        )

        const option = screen.getByText("Category 1")
        fireEvent.pointerDown(option.parentElement as HTMLElement)

        expect(onPressCategory).toHaveBeenCalledWith(
            expect.anything(),
            categories[0]
        )
    })

    it("should forward onAccordionOpenChange when accordion expands", () => {
        const onAccordionOpenChange = vi.fn()
        render(
            <CampaignCategoriesFilter
                {...defaultProps}
                onAccordionOpenChange={onAccordionOpenChange}
            />
        )

        fireEvent.click(screen.getByTestId("toggle-accordion"))

        expect(onAccordionOpenChange).toHaveBeenCalledWith(true)
    })
})
