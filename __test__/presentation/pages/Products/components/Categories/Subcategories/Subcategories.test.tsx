import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import Subcategories from "@/presentation/pages/Products/components/Categories/Subcategories/Subcategories"
import { Category } from "@/domain/entity/Category/structure/category"
import { CategoryWithCount } from "@/presentation/pages/Products/components/Categories/types"
import { EventName } from "@/presentation/analytics/types"
import { mockTrack } from "../../../../../../utils/analytics"

const mockUseIsDesktop = vi.fn()

const { mockScrollPrev, mockScrollNext, mockUseIsVisible } = vi.hoisted(() => ({
    mockScrollPrev: vi.fn(),
    mockScrollNext: vi.fn(),
    mockUseIsVisible: vi.fn(),
}))

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: (breakpoint: number) => mockUseIsDesktop(breakpoint),
}))

vi.mock("react-horizontal-scrolling-menu", async () => {
    const React = await vi.importActual("react")
    const VisibilityContext = (React as typeof import("react")).createContext({
        scrollPrev: () => {},
        scrollNext: () => {},
        useIsVisible: () => false,
    })

    const contextValue = {
        scrollPrev: mockScrollPrev,
        scrollNext: mockScrollNext,
        useIsVisible: mockUseIsVisible,
    }

    return {
        ScrollMenu: ({ children, LeftArrow, RightArrow }: { children: React.ReactNode; LeftArrow?: (() => React.ReactNode) | null; RightArrow?: (() => React.ReactNode) | null }) => (
            <div data-testid="scroll-menu">
                {LeftArrow && (
                    <div data-testid="left-arrow-wrapper">
                        <VisibilityContext.Provider value={contextValue}>
                            <LeftArrow />
                        </VisibilityContext.Provider>
                    </div>
                )}
                {RightArrow && (
                    <div data-testid="right-arrow-wrapper">
                        <VisibilityContext.Provider value={contextValue}>
                            <RightArrow />
                        </VisibilityContext.Provider>
                    </div>
                )}
                {children}
            </div>
        ),
        VisibilityContext,
    }
})

vi.mock("@/presentation/pages/Products/components/Categories/Subcategories/ArrowButton", () => ({
    default: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
        <button data-testid="arrow-button" {...props}>{children}</button>
    ),
}))

vi.mock("@/presentation/pages/Products/components/Categories/SubcategoryChip", () => ({
    default: ({ category, href, onPress, ...props }: { category: Category; href: string; onPress?: () => void; [key: string]: unknown }) => (
        <button data-testid={`chip-${category.slug}`} data-href={href} onClick={onPress} {...props}>
            {category.name}
        </button>
    ),
}))

describe("Subcategories", () => {
    const mockCategories: CategoryWithCount[] = [
        { id: "1", name: "Phones", slug: "phones", parent: null, count: 5 },
        { id: "2", name: "Tablets", slug: "tablets", parent: null, count: 3 },
        { id: "3", name: "Laptops", slug: "laptops", parent: null, count: 8 },
    ]

    const buildSubcategoryHref = (slug: string) => `/productos/categoria/electronics/${slug}`

    beforeEach(() => {
        mockTrack.mockReset()
        mockUseIsDesktop.mockReturnValue({ isDesktop: false })
    })

    it("should render one SubcategoryChip per category", () => {
        render(
            <Subcategories
                categories={mockCategories}
                activeSubcategory="phones"
                buildSubcategoryHref={buildSubcategoryHref}
            />
        )

        expect(screen.getByTestId("chip-phones")).toBeInTheDocument()
        expect(screen.getByTestId("chip-tablets")).toBeInTheDocument()
        expect(screen.getByTestId("chip-laptops")).toBeInTheDocument()
    })

    it("should pass correct href from buildSubcategoryHref", () => {
        render(
            <Subcategories
                categories={mockCategories}
                activeSubcategory="phones"
                buildSubcategoryHref={buildSubcategoryHref}
            />
        )

        expect(screen.getByTestId("chip-phones")).toHaveAttribute(
            "data-href",
            "/productos/categoria/electronics/phones"
        )
        expect(screen.getByTestId("chip-tablets")).toHaveAttribute(
            "data-href",
            "/productos/categoria/electronics/tablets"
        )
    })

    it("should set data-active=true for active subcategory", () => {
        render(
            <Subcategories
                categories={mockCategories}
                activeSubcategory="tablets"
                buildSubcategoryHref={buildSubcategoryHref}
            />
        )

        expect(screen.getByTestId("chip-tablets")).toHaveAttribute("data-active", "true")
    })

    it("should set data-active=false for inactive subcategories", () => {
        render(
            <Subcategories
                categories={mockCategories}
                activeSubcategory="tablets"
                buildSubcategoryHref={buildSubcategoryHref}
            />
        )

        expect(screen.getByTestId("chip-phones")).toHaveAttribute("data-active", "false")
        expect(screen.getByTestId("chip-laptops")).toHaveAttribute("data-active", "false")
    })

    it("should render the Categorías heading", () => {
        render(
            <Subcategories
                categories={mockCategories}
                activeSubcategory="phones"
                buildSubcategoryHref={buildSubcategoryHref}
            />
        )

        expect(screen.getByText("Categorías")).toBeInTheDocument()
    })

    it("should render ScrollMenu component", () => {
        render(
            <Subcategories
                categories={mockCategories}
                activeSubcategory="phones"
                buildSubcategoryHref={buildSubcategoryHref}
            />
        )

        expect(screen.getByTestId("scroll-menu")).toBeInTheDocument()
    })

    it("should handle empty activeSubcategory", () => {
        render(
            <Subcategories
                categories={mockCategories}
                activeSubcategory=""
                buildSubcategoryHref={buildSubcategoryHref}
            />
        )

        mockCategories.forEach((cat) => {
            expect(screen.getByTestId(`chip-${cat.slug}`)).toHaveAttribute("data-active", "false")
        })
    })

    it("should track analytics when a subcategory chip is clicked", () => {
        render(
            <Subcategories
                categories={mockCategories}
                activeSubcategory="phones"
                buildSubcategoryHref={buildSubcategoryHref}
            />
        )

        fireEvent.click(screen.getByTestId("chip-tablets"))

        expect(mockTrack).toHaveBeenCalledWith(EventName.CLICKED_FILTERS, {
            type: "category",
            filter: mockCategories[1],
        })
    })

    describe("desktop arrows", () => {
        beforeEach(() => {
            mockUseIsDesktop.mockReturnValue({ isDesktop: true })
        })

        it("should render left and right arrows on desktop", () => {
            render(
                <Subcategories
                    categories={mockCategories}
                    activeSubcategory="phones"
                    buildSubcategoryHref={buildSubcategoryHref}
                />
            )

            expect(screen.getByTestId("left-arrow-wrapper")).toBeInTheDocument()
            expect(screen.getByTestId("right-arrow-wrapper")).toBeInTheDocument()
        })

        it("should call scrollPrev when left arrow is clicked", () => {
            mockUseIsVisible.mockReturnValue(false)

            render(
                <Subcategories
                    categories={mockCategories}
                    activeSubcategory="phones"
                    buildSubcategoryHref={buildSubcategoryHref}
                />
            )

            const leftArrowButton = screen.getByTestId("left-arrow-wrapper").querySelector("button")
            expect(leftArrowButton).not.toBeDisabled()
            fireEvent.click(leftArrowButton!)

            expect(mockScrollPrev).toHaveBeenCalledTimes(1)
        })

        it("should call scrollNext when right arrow is clicked", () => {
            mockUseIsVisible.mockReturnValue(false)

            render(
                <Subcategories
                    categories={mockCategories}
                    activeSubcategory="phones"
                    buildSubcategoryHref={buildSubcategoryHref}
                />
            )

            const rightArrowButton = screen.getByTestId("right-arrow-wrapper").querySelector("button")
            expect(rightArrowButton).not.toBeDisabled()
            fireEvent.click(rightArrowButton!)

            expect(mockScrollNext).toHaveBeenCalledTimes(1)
        })

        it("should disable left arrow when first item is visible", () => {
            mockUseIsVisible.mockReturnValue(true)

            render(
                <Subcategories
                    categories={mockCategories}
                    activeSubcategory="phones"
                    buildSubcategoryHref={buildSubcategoryHref}
                />
            )

            const leftArrowButton = screen.getByTestId("left-arrow-wrapper").querySelector("button")
            expect(leftArrowButton).toBeDisabled()
        })

        it("should disable right arrow when last item is visible", () => {
            mockUseIsVisible.mockReturnValue(true)

            render(
                <Subcategories
                    categories={mockCategories}
                    activeSubcategory="phones"
                    buildSubcategoryHref={buildSubcategoryHref}
                />
            )

            const rightArrowButton = screen.getByTestId("right-arrow-wrapper").querySelector("button")
            expect(rightArrowButton).toBeDisabled()
        })
    })
})
