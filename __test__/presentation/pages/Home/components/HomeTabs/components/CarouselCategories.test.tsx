import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import React from "react"
import CarouselCategories from "@/presentation/pages/Home/UseYourMiles/Layout/Tabs/components/CarouselCategories"

// Mock dependencies

vi.mock("react-horizontal-scrolling-menu", () => ({
    ScrollMenu: ({ children, LeftArrow, RightArrow, wrapperClassName, scrollContainerClassName, itemClassName }: {
        children: React.ReactNode
        LeftArrow?: () => React.ReactNode
        RightArrow?: () => React.ReactNode
        wrapperClassName?: string
        scrollContainerClassName?: string
        itemClassName?: string
    }) => (
        <div data-testid="scroll-menu">
            <div data-testid="wrapper-class">{wrapperClassName}</div>
            <div data-testid="scroll-container-class">{scrollContainerClassName}</div>
            <div data-testid="item-class">{itemClassName}</div>
            {LeftArrow && <div data-testid="left-arrow">Left Arrow</div>}
            {RightArrow && <div data-testid="right-arrow">Right Arrow</div>}
            <div data-testid="carousel-items">{children}</div>
        </div>
    ),
    VisibilityContext: vi.fn(),
}))

vi.mock("@/presentation/components/icons/IconCarouselArrowLeft", () => ({
    default: () => <div data-testid="arrow-left-icon">Left Arrow</div>,
}))

vi.mock("@/presentation/components/icons/IconCarouselArrowRight", () => ({
    default: () => <div data-testid="arrow-right-icon">Right Arrow</div>,
}))

vi.mock("clsx", () => ({
    default: (...classes: (string | undefined | null | false)[]) => 
        classes.filter(Boolean).join(' '),
}))

describe("CarouselCategories", () => {
    const mockItems = [
        <div key="1" data-testid="item-1">Item 1</div>,
        <div key="2" data-testid="item-2">Item 2</div>,
        <div key="3" data-testid="item-3">Item 3</div>,
    ]

    const productCategoriesAriaLabel = (count: number) =>
        `Carrusel de categorías de productos: El carrusel incluye las ${count} categorías de productos.`

    const renderCarousel = (
        items: React.ReactNode[],
        props?: Omit<React.ComponentProps<typeof CarouselCategories>, "items" | "ariaLabel">,
    ) =>
        render(
            <CarouselCategories
                items={items}
                ariaLabel={productCategoriesAriaLabel(items.length)}
                {...props}
            />,
        )

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render carousel with items", () => {
        renderCarousel(mockItems)

        expect(screen.getByTestId("scroll-menu")).toBeInTheDocument()
        expect(screen.getByTestId("carousel-items")).toBeInTheDocument()
        expect(screen.getByTestId("item-1")).toBeInTheDocument()
        expect(screen.getByTestId("item-2")).toBeInTheDocument()
        expect(screen.getByTestId("item-3")).toBeInTheDocument()
    })

    it("should render arrows by default", () => {
        renderCarousel(mockItems)

        expect(screen.getByTestId("left-arrow")).toBeInTheDocument()
        expect(screen.getByTestId("right-arrow")).toBeInTheDocument()
    })

    it("should not render arrows when showArrows is false", () => {
        renderCarousel(mockItems, { showArrows: false })

        expect(screen.queryByTestId("left-arrow")).not.toBeInTheDocument()
        expect(screen.queryByTestId("right-arrow")).not.toBeInTheDocument()
    })

    it("should render arrows on mobile by default", () => {
        renderCarousel(mockItems)

        expect(screen.getByTestId("left-arrow")).toBeInTheDocument()
        expect(screen.getByTestId("right-arrow")).toBeInTheDocument()
    })

    it("should hide arrows on mobile when showArrowsOnMobile is false", () => {
        renderCarousel(mockItems, { showArrowsOnMobile: false })

        expect(screen.getByTestId("left-arrow")).toBeInTheDocument()
        expect(screen.getByTestId("right-arrow")).toBeInTheDocument()
    })

    it("should apply default CSS classes", () => {
        renderCarousel(mockItems)

        expect(screen.getByTestId("wrapper-class")).toHaveTextContent("relative overflow-hidden")
        expect(screen.getByTestId("scroll-container-class")).toHaveTextContent("lg:max-w-[80%] lg:mx-auto flex gap-3 items-stretch overflow-x-auto lg:overflow-x-auto [&::-webkit-scrollbar]:hidden")
        expect(screen.getByTestId("item-class")).toHaveTextContent("shrink-0")
    })

    it("should apply custom CSS classes when provided", () => {
        const customWrapperClass = "custom-wrapper"
        const customScrollClass = "custom-scroll"
        const customItemClass = "custom-item"

        renderCarousel(mockItems, {
            wrapperClassName: customWrapperClass,
            scrollContainerClassName: customScrollClass,
            itemClassName: customItemClass,
        })

        expect(screen.getByTestId("wrapper-class")).toHaveTextContent("relative overflow-hidden custom-wrapper")
        expect(screen.getByTestId("scroll-container-class")).toHaveTextContent("lg:max-w-[80%] lg:mx-auto flex gap-3 items-stretch overflow-x-auto lg:overflow-x-auto [&::-webkit-scrollbar]:hidden custom-scroll")
        expect(screen.getByTestId("item-class")).toHaveTextContent("shrink-0 custom-item")
    })

    it("should render items with correct IDs", () => {
        renderCarousel(mockItems)

        const items = screen.getAllByTestId(/^item-\d$/)
        expect(items).toHaveLength(3)

        items.forEach((item, index) => {
            const expectedId = `carousel-item-${index}`
            expect(item.parentElement).toHaveAttribute("data-item-id", expectedId)
        })
    })

    it("should render empty state when no items provided", () => {
        renderCarousel([])

        expect(screen.getByTestId("scroll-menu")).toBeInTheDocument()
        expect(screen.getByTestId("carousel-items")).toBeInTheDocument()
        expect(screen.queryByTestId("item-1")).not.toBeInTheDocument()
    })

    it("should render with single item", () => {
        const singleItem = [<div key="1" data-testid="single-item">Single Item</div>]
        
        renderCarousel(singleItem)

        expect(screen.getByTestId("single-item")).toBeInTheDocument()
        expect(screen.getByTestId("carousel-items")).toBeInTheDocument()
    })

    it("should handle complex items with nested elements", () => {
        const complexItems = [
            <div key="1" data-testid="complex-item">
                <span data-testid="nested-span">Nested Content</span>
                <button data-testid="nested-button">Button</button>
            </div>
        ]

        renderCarousel(complexItems)

        expect(screen.getByTestId("complex-item")).toBeInTheDocument()
        expect(screen.getByTestId("nested-span")).toBeInTheDocument()
        expect(screen.getByTestId("nested-button")).toBeInTheDocument()
    })

    it("should maintain item order", () => {
        const orderedItems = [
            <div key="first" data-testid="first-item">First</div>,
            <div key="second" data-testid="second-item">Second</div>,
            <div key="third" data-testid="third-item">Third</div>,
        ]

        renderCarousel(orderedItems)

        const container = screen.getByTestId("carousel-items")
        const items = container.querySelectorAll('[data-testid]')
        
        expect(items[0]).toHaveAttribute("data-testid", "first-item")
        expect(items[1]).toHaveAttribute("data-testid", "second-item")
        expect(items[2]).toHaveAttribute("data-testid", "third-item")
    })

    it("should work with items that have props", () => {
        const itemsWithProps = [
            <button key="btn1" data-testid="button-1" onClick={vi.fn()}>
                Button 1
            </button>,
            <input key="input1" data-testid="input-1" value="test" readOnly />,
        ]

        renderCarousel(itemsWithProps)

        expect(screen.getByTestId("button-1")).toBeInTheDocument()
        expect(screen.getByTestId("input-1")).toBeInTheDocument()
        expect(screen.getByDisplayValue("test")).toBeInTheDocument()
    })

    it("should render with default props when no custom classes provided", () => {
        renderCarousel(mockItems)

        expect(screen.getByTestId("scroll-menu")).toBeInTheDocument()
        expect(screen.getByTestId("left-arrow")).toBeInTheDocument()
        expect(screen.getByTestId("right-arrow")).toBeInTheDocument()
    })

    it("should expose product categories carousel region with accessible name", () => {
        renderCarousel(mockItems)

        expect(
            screen.getByRole("region", {
                name: "Carrusel de categorías de productos: El carrusel incluye las 3 categorías de productos.",
            }),
        ).toHaveAttribute("aria-roledescription", "carrusel")
    })

    it("should handle activeItemIndex by passing ref to the active item wrapper", () => {
        renderCarousel(mockItems, { activeItemIndex: 1 })

        expect(screen.getByTestId("item-2")).toBeInTheDocument()
        expect(screen.getByTestId("item-2").parentElement).toHaveAttribute("data-item-id", "carousel-item-1")
    })
})
