import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import useIsDesktop from "@/presentation/hooks/useIsDesktop"

describe("useIsDesktop", () => {
    let listeners: Map<string, (event: MediaQueryListEvent) => void>
    let matchesValue: boolean

    const createMockMediaQuery = () => {
        listeners = new Map()
        return vi.fn().mockImplementation((query: string) => ({
            matches: matchesValue,
            media: query,
            addEventListener: vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
                listeners.set(event, handler)
            }),
            removeEventListener: vi.fn((event: string) => {
                listeners.delete(event)
            }),
        }))
    }

    beforeEach(() => {
        matchesValue = false
        window.matchMedia = createMockMediaQuery()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("should return isDesktop false by default (below breakpoint)", () => {
        matchesValue = false
        window.matchMedia = createMockMediaQuery()

        const { result } = renderHook(() => useIsDesktop())

        expect(result.current.isDesktop).toBe(false)
    })

    it("should return isDesktop true when viewport matches the breakpoint", () => {
        matchesValue = true
        window.matchMedia = createMockMediaQuery()

        const { result } = renderHook(() => useIsDesktop())

        expect(result.current.isDesktop).toBe(true)
    })

    it("should use default breakpoint of 768px", () => {
        renderHook(() => useIsDesktop())

        expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 768px)")
    })

    it("should accept a custom breakpoint", () => {
        renderHook(() => useIsDesktop(1024))

        expect(window.matchMedia).toHaveBeenCalledWith("(min-width: 1024px)")
    })

    it("should update isDesktop when media query changes", () => {
        matchesValue = false
        window.matchMedia = createMockMediaQuery()

        const { result } = renderHook(() => useIsDesktop())

        expect(result.current.isDesktop).toBe(false)

        act(() => {
            const handler = listeners.get("change")
            if (handler) {
                handler({ matches: true } as MediaQueryListEvent)
            }
        })

        expect(result.current.isDesktop).toBe(true)
    })

    it("should update to false when media query stops matching", () => {
        matchesValue = true
        window.matchMedia = createMockMediaQuery()

        const { result } = renderHook(() => useIsDesktop())

        expect(result.current.isDesktop).toBe(true)

        act(() => {
            const handler = listeners.get("change")
            if (handler) {
                handler({ matches: false } as MediaQueryListEvent)
            }
        })

        expect(result.current.isDesktop).toBe(false)
    })

    it("should add event listener on mount", () => {
        renderHook(() => useIsDesktop())

        const mockMediaQuery = (window.matchMedia as ReturnType<typeof vi.fn>).mock.results[0].value
        expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith("change", expect.any(Function))
    })

    it("should remove event listener on unmount", () => {
        const { unmount } = renderHook(() => useIsDesktop())

        const mockMediaQuery = (window.matchMedia as ReturnType<typeof vi.fn>).mock.results[0].value

        unmount()

        expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function))
    })
})
