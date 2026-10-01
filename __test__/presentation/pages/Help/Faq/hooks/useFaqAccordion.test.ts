import React from "react"
import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest"
import { useFaqAccordion } from "@/presentation/pages/Help/Faq/hooks/useFaqAccordion"
import type { Selection } from "@react-types/shared"

beforeAll(() => {
    Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
        value: vi.fn(),
        writable: true,
    })
})

const faqCategories = [
    {
        id: "cat-program",
        name: "Información del programa",
        questions: [
            { id: "q1", title: "Question 1", faqCategoryId: "cat-program", description: "Answer 1" },
            { id: "q2", title: "Question 2", faqCategoryId: "cat-program", description: "Answer 2" },
        ],
    },
    {
        id: "cat-account",
        name: "Mi cuenta",
        questions: [
            { id: "q3", title: "Question 3", faqCategoryId: "cat-account", description: "Answer 3" },
        ],
    },
]

describe("useFaqAccordion", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("initial state", () => {
        it("should initialize currentCategoryId to the first category id", () => {
            const { result } = renderHook(() => useFaqAccordion(faqCategories))
            expect(result.current.currentCategoryId).toBe("cat-program")
        })

        it("should initialize selectedKeys to the first question id of the first category", () => {
            const { result } = renderHook(() => useFaqAccordion(faqCategories))
            expect(result.current.selectedKeys).toEqual(new Set(["q1"]))
        })

        it("should initialize selectedKeys to empty set when first category has no questions", () => {
            const { result } = renderHook(() => useFaqAccordion([
                { id: "cat-empty", name: "Empty", questions: [] },
            ]))
            expect(result.current.selectedKeys).toEqual(new Set())
        })

        it("should initialize currentCategoryId to empty string when categories array is empty", () => {
            const { result } = renderHook(() => useFaqAccordion([]))
            expect(result.current.currentCategoryId).toBe("")
        })

        it("should return the first category as activeCategory", () => {
            const { result } = renderHook(() => useFaqAccordion(faqCategories))
            expect(result.current.activeCategory).toEqual(faqCategories[0])
        })

        it("should return undefined activeCategory when categories array is empty", () => {
            const { result } = renderHook(() => useFaqAccordion([]))
            expect(result.current.activeCategory).toBeUndefined()
        })

        it("should provide stickyRef and accordionContainerRef as ref objects", () => {
            const { result } = renderHook(() => useFaqAccordion(faqCategories))
            expect(result.current.stickyRef).toBeDefined()
            expect(result.current.accordionContainerRef).toBeDefined()
            expect(result.current.stickyRef).toHaveProperty("current")
            expect(result.current.accordionContainerRef).toHaveProperty("current")
        })

        it("should expose handleTabChange and handleSelectionChange as functions", () => {
            const { result } = renderHook(() => useFaqAccordion(faqCategories))
            expect(typeof result.current.handleTabChange).toBe("function")
            expect(typeof result.current.handleSelectionChange).toBe("function")
        })
    })

    describe("handleTabChange", () => {
        it("should update currentCategoryId to the given tab id", () => {
            const { result } = renderHook(() => useFaqAccordion(faqCategories))
            act(() => { result.current.handleTabChange("cat-account") })
            expect(result.current.currentCategoryId).toBe("cat-account")
        })

        it("should reset selectedKeys to the first question id of the new category", () => {
            const { result } = renderHook(() => useFaqAccordion(faqCategories))
            act(() => { result.current.handleTabChange("cat-account") })
            expect(result.current.selectedKeys).toEqual(new Set(["q3"]))
        })

        it("should reset selectedKeys to empty set when new category has no questions", () => {
            const categories = [...faqCategories, { id: "cat-empty", name: "Empty", questions: [] }]
            const { result } = renderHook(() => useFaqAccordion(categories))
            act(() => { result.current.handleTabChange("cat-empty") })
            expect(result.current.selectedKeys).toEqual(new Set())
        })

        it("should update activeCategory to the newly selected category", () => {
            const { result } = renderHook(() => useFaqAccordion(faqCategories))
            act(() => { result.current.handleTabChange("cat-account") })
            expect(result.current.activeCategory).toEqual(faqCategories[1])
        })
    })

    describe("handleSelectionChange", () => {
        it("should update selectedKeys with the provided set", () => {
            const { result } = renderHook(() => useFaqAccordion(faqCategories))
            act(() => { result.current.handleSelectionChange(new Set(["q2"]) as Selection) })
            expect(result.current.selectedKeys).toEqual(new Set(["q2"]))
        })

        it("should set selectedKeys to empty set when 'all' is provided", () => {
            const { result } = renderHook(() => useFaqAccordion(faqCategories))
            act(() => { result.current.handleSelectionChange("all") })
            expect(result.current.selectedKeys).toEqual(new Set())
        })

        it("should allow collapsing all items by passing an empty set", () => {
            const { result } = renderHook(() => useFaqAccordion(faqCategories))
            act(() => { result.current.handleSelectionChange(new Set<string>() as Selection) })
            expect(result.current.selectedKeys).toEqual(new Set())
        })
    })

    describe("scroll effect", () => {
        it("should not scroll after a tab change when refs are not attached", () => {
            vi.useFakeTimers()
            const scrollToSpy = vi.fn()
            window.scrollTo = scrollToSpy

            const { result } = renderHook(() => useFaqAccordion(faqCategories))
            act(() => { result.current.handleTabChange("cat-account") })
            act(() => { vi.advanceTimersByTime(0) })

            expect(scrollToSpy).not.toHaveBeenCalled()
            vi.useRealTimers()
        })

        it("should not scroll when selected keys are empty after deselect", () => {
            vi.useFakeTimers()
            const scrollToSpy = vi.fn()
            window.scrollTo = scrollToSpy

            const { result } = renderHook(() => useFaqAccordion(faqCategories))
            act(() => { result.current.handleSelectionChange(new Set<string>() as Selection) })
            act(() => { vi.advanceTimersByTime(0) })

            expect(scrollToSpy).not.toHaveBeenCalled()
            vi.useRealTimers()
        })

        describe("scroll-to-top on tab change", () => {
            it("should call window.scrollTo to position accordion below sticky header when both refs are attached", () => {
                vi.useFakeTimers()
                const scrollToSpy = vi.fn()
                window.scrollTo = scrollToSpy

                const { result } = renderHook(() => useFaqAccordion(faqCategories))

                const stickyEl = document.createElement("div")
                const accordionEl = document.createElement("div")
                vi.spyOn(stickyEl, "getBoundingClientRect").mockReturnValue({ bottom: 100 } as DOMRect)
                vi.spyOn(accordionEl, "getBoundingClientRect").mockReturnValue({ top: 300 } as DOMRect)
                ;(result.current.stickyRef as React.MutableRefObject<HTMLDivElement | null>).current = stickyEl
                ;(result.current.accordionContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = accordionEl

                act(() => { result.current.handleTabChange("cat-account") })
                act(() => { vi.advanceTimersByTime(0) })

                expect(scrollToSpy).toHaveBeenCalledWith({ top: 184, behavior: "smooth" })
                vi.useRealTimers()
            })

            it("should not scroll when delta is within threshold (≤ 1)", () => {
                vi.useFakeTimers()
                const scrollToSpy = vi.fn()
                window.scrollTo = scrollToSpy

                const { result } = renderHook(() => useFaqAccordion(faqCategories))

                const stickyEl = document.createElement("div")
                const accordionEl = document.createElement("div")
                vi.spyOn(stickyEl, "getBoundingClientRect").mockReturnValue({ bottom: 100 } as DOMRect)
                vi.spyOn(accordionEl, "getBoundingClientRect").mockReturnValue({ top: 116 } as DOMRect)
                ;(result.current.stickyRef as React.MutableRefObject<HTMLDivElement | null>).current = stickyEl
                ;(result.current.accordionContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = accordionEl

                act(() => { result.current.handleTabChange("cat-account") })
                act(() => { vi.advanceTimersByTime(0) })

                expect(scrollToSpy).not.toHaveBeenCalled()
                vi.useRealTimers()
            })

            it("should not scroll when stickyRef is not attached", () => {
                vi.useFakeTimers()
                const scrollToSpy = vi.fn()
                window.scrollTo = scrollToSpy

                const { result } = renderHook(() => useFaqAccordion(faqCategories))

                const accordionEl = document.createElement("div")
                ;(result.current.accordionContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = accordionEl

                act(() => { result.current.handleTabChange("cat-account") })
                act(() => { vi.advanceTimersByTime(0) })

                expect(scrollToSpy).not.toHaveBeenCalled()
                vi.useRealTimers()
            })

            it("should not scroll when accordionContainerRef is not attached", () => {
                vi.useFakeTimers()
                const scrollToSpy = vi.fn()
                window.scrollTo = scrollToSpy

                const { result } = renderHook(() => useFaqAccordion(faqCategories))

                const stickyEl = document.createElement("div")
                ;(result.current.stickyRef as React.MutableRefObject<HTMLDivElement | null>).current = stickyEl

                act(() => { result.current.handleTabChange("cat-account") })
                act(() => { vi.advanceTimersByTime(0) })

                expect(scrollToSpy).not.toHaveBeenCalled()
                vi.useRealTimers()
            })
        })

        it("should call scrollIntoView on the active element when no stickyRef is attached", () => {
            vi.useFakeTimers()
            const scrollIntoViewSpy = vi.spyOn(HTMLElement.prototype, "scrollIntoView")

            const { result } = renderHook(() => useFaqAccordion(faqCategories))
            act(() => { result.current.handleSelectionChange(new Set(["q2"]) as Selection) })
            act(() => { vi.advanceTimersByTime(0) })

            expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: "smooth", block: "nearest" })
            scrollIntoViewSpy.mockRestore()
            vi.useRealTimers()
        })
    })
})

