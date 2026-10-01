import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

const mocks = vi.hoisted(() => ({
    scrollPrev: vi.fn(),
    scrollToItem: vi.fn(),
    getPrevElement: vi.fn(),
    last: vi.fn(),
}))

vi.mock("react-horizontal-scrolling-menu", async () => {
    const { createContext } = await import("react")
    return {
        VisibilityContext: createContext({
            scrollPrev: mocks.scrollPrev,
            scrollNext: vi.fn(),
            isFirstItemVisible: true,
            isLastItemVisible: false,
            visibleItemsWithoutSeparators: [],
            initComplete: true,
            isItemVisible: vi.fn(),
            scrollToItem: mocks.scrollToItem,
            getPrevElement: mocks.getPrevElement,
            getItemById: vi.fn(),
            getItemByIndex: vi.fn(),
            items: { toItems: () => [], last: mocks.last },
            scrollContainer: { current: null },
            wrapperRef: { current: null },
        }),
    }
})

vi.mock("@/presentation/components/icons/IconCarouselArrowLeft", () => ({
    default: () => <span data-testid="left-icon" />,
}))

vi.mock("@heroui/react", () => ({
    cn: (...args: string[]) => args.filter(Boolean).join(" "),
}))

import { LeftArrow } from "@/presentation/components/ScrollMenu/LeftArrow"

describe("LeftArrow", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render a button", () => {
        render(<LeftArrow />)
        expect(screen.getByRole("button")).toBeInTheDocument()
    })

    it("should have aria-label='Anterior' for screen readers", () => {
        render(<LeftArrow />)
        expect(screen.getByRole("button", { name: "Anterior" })).toBeInTheDocument()
    })

    it("should only call scrollPrev when infinite is false (default)", () => {
        render(<LeftArrow />)
        fireEvent.click(screen.getByRole("button", { name: "Anterior" }))
        expect(mocks.scrollPrev).toHaveBeenCalledOnce()
        expect(mocks.getPrevElement).not.toHaveBeenCalled()
        expect(mocks.scrollToItem).not.toHaveBeenCalled()
    })

    it("should call scrollPrev when infinite and there is a previous element", () => {
        mocks.getPrevElement.mockReturnValue({})
        render(<LeftArrow infinite />)
        fireEvent.click(screen.getByRole("button", { name: "Anterior" }))
        expect(mocks.scrollPrev).toHaveBeenCalledOnce()
        expect(mocks.scrollToItem).not.toHaveBeenCalled()
    })

    it("should scroll to the last item when infinite and there is no previous element", () => {
        const lastItem = { index: "9" }
        mocks.getPrevElement.mockReturnValue(null)
        mocks.last.mockReturnValue(lastItem)
        render(<LeftArrow infinite />)
        fireEvent.click(screen.getByRole("button", { name: "Anterior" }))
        expect(mocks.scrollToItem).toHaveBeenCalledWith(lastItem, "smooth")
        expect(mocks.scrollPrev).not.toHaveBeenCalled()
    })

    it("should do nothing when infinite and there is no previous element and no last item", () => {
        mocks.getPrevElement.mockReturnValue(null)
        mocks.last.mockReturnValue(undefined)
        render(<LeftArrow infinite />)
        fireEvent.click(screen.getByRole("button", { name: "Anterior" }))
        expect(mocks.scrollToItem).not.toHaveBeenCalled()
        expect(mocks.scrollPrev).not.toHaveBeenCalled()
    })

    it("should render the left arrow icon inside an aria-hidden span", () => {
        const { container } = render(<LeftArrow />)
        const hiddenSpan = container.querySelector("span[aria-hidden='true']")
        expect(hiddenSpan).toBeInTheDocument()
        expect(hiddenSpan).toContainElement(screen.getByTestId("left-icon"))
    })
})
