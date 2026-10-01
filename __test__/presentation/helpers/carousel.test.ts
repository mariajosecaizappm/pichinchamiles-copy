import { describe, it, expect, vi, afterEach } from "vitest"
import { getScrollSnapSlideIndex } from "@/presentation/helpers/carousel"

const mockRect = (element: HTMLElement, rect: Partial<DOMRect>) => {
    vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
        x: rect.left ?? 0,
        y: rect.top ?? 0,
        top: rect.top ?? 0,
        left: rect.left ?? 0,
        right: (rect.left ?? 0) + (rect.width ?? 0),
        bottom: (rect.top ?? 0) + (rect.height ?? 0),
        width: rect.width ?? 0,
        height: rect.height ?? 0,
        toJSON: () => ({}),
    })
}

const createContainer = ({
    clientWidth,
    containerLeft,
    childrenRects,
}: {
    clientWidth: number
    containerLeft: number
    childrenRects: Array<{ left: number; width: number }>
}): HTMLElement => {
    const container = document.createElement("div")
    Object.defineProperty(container, "clientWidth", { value: clientWidth, configurable: true })
    mockRect(container, { left: containerLeft, width: clientWidth })

    childrenRects.forEach((rect) => {
        const child = document.createElement("div")
        mockRect(child, rect)
        container.appendChild(child)
    })

    return container
}

describe("getScrollSnapSlideIndex", () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("returns 0 when the container has no children", () => {
        const container = createContainer({ clientWidth: 430, containerLeft: 0, childrenRects: [] })
        expect(getScrollSnapSlideIndex(container)).toBe(0)
    })

    it("returns 0 when the first card is closest to the viewport center", () => {
        const container = createContainer({
            clientWidth: 430,
            containerLeft: 0,
            childrenRects: [
                { left: 16, width: 300 },
                { left: 332, width: 300 },
                { left: 648, width: 300 },
            ],
        })
        expect(getScrollSnapSlideIndex(container)).toBe(0)
    })

    it("returns the third card index when that card is centered", () => {
        // Viewport center at 215; 3rd card center at 215 after scroll
        const container = createContainer({
            clientWidth: 430,
            containerLeft: 0,
            childrenRects: [
                { left: -367, width: 300 },
                { left: -51, width: 300 },
                { left: 65, width: 300 },
                { left: 381, width: 300 },
                { left: 697, width: 300 },
                { left: 1013, width: 300 },
            ],
        })
        expect(getScrollSnapSlideIndex(container)).toBe(2)
    })

    it("returns the last card index when it is closest to the viewport center", () => {
        const container = createContainer({
            clientWidth: 430,
            containerLeft: 0,
            childrenRects: [
                { left: -1101, width: 300 },
                { left: -785, width: 300 },
                { left: -469, width: 300 },
                { left: -153, width: 300 },
                { left: 163, width: 300 },
                { left: 114, width: 300 },
            ],
        })
        expect(getScrollSnapSlideIndex(container)).toBe(5)
    })

    it("reaches the last of 3 cards when it is centered", () => {
        const container = createContainer({
            clientWidth: 430,
            containerLeft: 0,
            childrenRects: [
                { left: -469, width: 300 },
                { left: -153, width: 300 },
                { left: 65, width: 300 },
            ],
        })
        expect(getScrollSnapSlideIndex(container)).toBe(2)
    })
})
