import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

vi.mock("@heroui/react", () => ({
    cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
}))

vi.mock("react-horizontal-scrolling-menu", () => ({
    ScrollMenu: ({ children, LeftArrow, RightArrow }: { 
        children: React.ReactNode; 
        LeftArrow?: React.ReactNode; 
        RightArrow?: React.ReactNode 
    }) => (
        <div data-testid="scroll-menu">
            {LeftArrow && <div data-testid="left-arrow">{LeftArrow}</div>}
            {children}
            {RightArrow && <div data-testid="right-arrow">{RightArrow}</div>}
        </div>
    ),
}))

vi.mock("@/presentation/components/ScrollMenu/LeftArrow", () => ({
    LeftArrow: ({ className }: { className?: string }) => (
        <button data-testid="left-arrow-btn" className={className}>Left</button>
    ),
}))

vi.mock("@/presentation/components/ScrollMenu/RightArrow", () => ({
    RightArrow: ({ className }: { className?: string }) => (
        <button data-testid="right-arrow-btn" className={className}>Right</button>
    ),
}))

import CardsSliderWrapper from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/CardsSliderWrapper/CardsSliderWrapper"

describe("CardsSliderWrapper", () => {
    const mockItems = [{ id: "1", name: "Item 1" }, { id: "2", name: "Item 2" }]
    const renderItem = (item: { id: string; name: string }) => <div data-testid={`item-${item.id}`}>{item.name}</div>

    it("should render ScrollMenu", () => {
        render(<CardsSliderWrapper items={mockItems} renderItem={renderItem} />)
        expect(screen.getByTestId("scroll-menu")).toBeInTheDocument()
    })

    it("should render all items", () => {
        render(<CardsSliderWrapper items={mockItems} renderItem={renderItem} />)
        expect(screen.getByTestId("item-1")).toBeInTheDocument()
        expect(screen.getByTestId("item-2")).toBeInTheDocument()
    })

    it("should render left arrow when showLeftArrow is true", () => {
        render(<CardsSliderWrapper items={mockItems} renderItem={renderItem} showLeftArrow />)
        expect(screen.getByTestId("left-arrow")).toBeInTheDocument()
    })

    it("should not render left arrow when showLeftArrow is false", () => {
        render(<CardsSliderWrapper items={mockItems} renderItem={renderItem} showLeftArrow={false} />)
        expect(screen.queryByTestId("left-arrow")).not.toBeInTheDocument()
    })

    it("should render right arrow when showRightArrow is true", () => {
        render(<CardsSliderWrapper items={mockItems} renderItem={renderItem} showRightArrow />)
        expect(screen.getByTestId("right-arrow")).toBeInTheDocument()
    })

    it("should not render right arrow when showRightArrow is false", () => {
        render(<CardsSliderWrapper items={mockItems} renderItem={renderItem} showRightArrow={false} />)
        expect(screen.queryByTestId("right-arrow")).not.toBeInTheDocument()
    })

    it("should render empty when items is empty", () => {
        render(<CardsSliderWrapper items={[]} renderItem={renderItem} />)
        expect(screen.getByTestId("scroll-menu")).toBeInTheDocument()
        expect(screen.queryByTestId("item-1")).not.toBeInTheDocument()
    })
})
