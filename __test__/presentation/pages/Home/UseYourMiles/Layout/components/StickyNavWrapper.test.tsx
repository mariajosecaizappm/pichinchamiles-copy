import { render, screen, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

const cnMock = vi.fn((...args: unknown[]) => args.filter(Boolean).join(" "))

vi.mock("@heroui/react", () => ({
    cn: (...args: unknown[]) => cnMock(...args),
}))

let intersectionCallback: (entries: Partial<IntersectionObserverEntry>[]) => void
const observeMock = vi.fn()
const disconnectMock = vi.fn()

beforeEach(() => {
    cnMock.mockClear()
    observeMock.mockClear()
    disconnectMock.mockClear()

    global.IntersectionObserver = vi.fn((callback) => {
        intersectionCallback = callback as typeof intersectionCallback
        return {
            observe: observeMock,
            disconnect: disconnectMock,
            unobserve: vi.fn(),
            root: null,
            rootMargin: "",
            thresholds: [],
            takeRecords: vi.fn(),
        }
    }) as unknown as typeof IntersectionObserver
})

import StickyNavWrapper from "@/presentation/pages/Home/UseYourMiles/Layout/components/StickyNavWrapper"

describe("StickyNavWrapper", () => {
    it("should render children", () => {
        render(
            <StickyNavWrapper>
                <span>Child content</span>
            </StickyNavWrapper>
        )
        expect(screen.getByText("Child content")).toBeInTheDocument()
    })

    it("should call cn with className prop", () => {
        render(
            <StickyNavWrapper className="md:sticky top-0">
                <span>Content</span>
            </StickyNavWrapper>
        )
        expect(cnMock).toHaveBeenCalledWith("md:sticky top-0", false)
    })

    it("should create an IntersectionObserver on mount", () => {
        render(
            <StickyNavWrapper>
                <span>Content</span>
            </StickyNavWrapper>
        )
        expect(global.IntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            { threshold: 1, rootMargin: "-1px 0px 0px 0px" }
        )
        expect(observeMock).toHaveBeenCalled()
    })

    it("should call cn with shadow classes when stuck (not intersecting)", () => {
        render(
            <StickyNavWrapper className="sticky">
                <span>Content</span>
            </StickyNavWrapper>
        )

        cnMock.mockClear()

        act(() => {
            intersectionCallback([{ isIntersecting: false }])
        })

        expect(cnMock).toHaveBeenCalledWith(
            "sticky",
            "shadow-[0px_8px_8px_-8px_rgba(7,7,7,0.16)] transition-shadow duration-200"
        )
    })

    it("should call cn without shadow classes when not stuck (intersecting)", () => {
        render(
            <StickyNavWrapper className="sticky">
                <span>Content</span>
            </StickyNavWrapper>
        )

        act(() => {
            intersectionCallback([{ isIntersecting: false }])
        })

        cnMock.mockClear()

        act(() => {
            intersectionCallback([{ isIntersecting: true }])
        })

        expect(cnMock).toHaveBeenCalledWith("sticky", false)
    })

    it("should disconnect observer on unmount", () => {
        const { unmount } = render(
            <StickyNavWrapper>
                <span>Content</span>
            </StickyNavWrapper>
        )

        unmount()

        expect(disconnectMock).toHaveBeenCalled()
    })
})
