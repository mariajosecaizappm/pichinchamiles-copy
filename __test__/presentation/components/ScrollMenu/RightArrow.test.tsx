import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

const mocks = vi.hoisted(() => ({
    scrollNext: vi.fn(),
    scrollToItem: vi.fn(),
    getNextElement: vi.fn(),
    first: vi.fn(),
}))

vi.mock("react-horizontal-scrolling-menu", async () => {
    const { createContext } = await import("react")
    return {
        VisibilityContext: createContext({
            scrollPrev: vi.fn(),
            scrollNext: mocks.scrollNext,
            isFirstItemVisible: false,
            isLastItemVisible: true,
            visibleItemsWithoutSeparators: [],
            initComplete: true,
            isItemVisible: vi.fn(),
            scrollToItem: mocks.scrollToItem,
            getNextElement: mocks.getNextElement,
            getItemById: vi.fn(),
            getItemByIndex: vi.fn(),
            items: { toItems: () => [], first: mocks.first },
            scrollContainer: { current: null },
            wrapperRef: { current: null },
        }),
    }
})

vi.mock("@/presentation/components/icons/IconCarouselArrowRight", () => ({
    default: () => <span data-testid="right-icon" />,
}))

vi.mock("@heroui/react", () => ({
    cn: (...args: string[]) => args.filter(Boolean).join(" "),
}))

import { RightArrow } from "@/presentation/components/ScrollMenu/RightArrow"

describe("RightArrow", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render a button", () => {
        render(<RightArrow />)
        expect(screen.getByRole("button")).toBeInTheDocument()
    })

    it("should have aria-label='Siguiente' for screen readers", () => {
        render(<RightArrow />)
        expect(screen.getByRole("button", { name: "Siguiente" })).toBeInTheDocument()
    })

    it("should only call scrollNext when infinite is false (default)", () => {
        render(<RightArrow />)
        fireEvent.click(screen.getByRole("button", { name: "Siguiente" }))
        expect(mocks.scrollNext).toHaveBeenCalledOnce()
        expect(mocks.getNextElement).not.toHaveBeenCalled()
        expect(mocks.scrollToItem).not.toHaveBeenCalled()
    })

    it("should call scrollNext when infinite and there is a next element", () => {
        mocks.getNextElement.mockReturnValue({})
        render(<RightArrow infinite />)
        fireEvent.click(screen.getByRole("button", { name: "Siguiente" }))
        expect(mocks.scrollNext).toHaveBeenCalledOnce()
        expect(mocks.scrollToItem).not.toHaveBeenCalled()
    })

    it("should scroll to the first item when infinite and there is no next element", () => {
        const firstItem = { index: "0" }
        mocks.getNextElement.mockReturnValue(null)
        mocks.first.mockReturnValue(firstItem)
        render(<RightArrow infinite />)
        fireEvent.click(screen.getByRole("button", { name: "Siguiente" }))
        expect(mocks.scrollToItem).toHaveBeenCalledWith(firstItem, "smooth")
        expect(mocks.scrollNext).not.toHaveBeenCalled()
    })

    it("should do nothing when infinite and there is no next element and no first item", () => {
        mocks.getNextElement.mockReturnValue(null)
        mocks.first.mockReturnValue(undefined)
        render(<RightArrow infinite />)
        fireEvent.click(screen.getByRole("button", { name: "Siguiente" }))
        expect(mocks.scrollToItem).not.toHaveBeenCalled()
        expect(mocks.scrollNext).not.toHaveBeenCalled()
    })

    it("should render the right arrow icon inside an aria-hidden span", () => {
        const { container } = render(<RightArrow />)
        const hiddenSpan = container.querySelector("span[aria-hidden='true']")
        expect(hiddenSpan).toBeInTheDocument()
        expect(hiddenSpan).toContainElement(screen.getByTestId("right-icon"))
    })
})