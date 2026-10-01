import {renderHook, act} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import useDebounce from "@/presentation/hooks/useDebounce"

describe("useDebounce", () => {
    beforeEach(() => {
        vi.useFakeTimers({shouldAdvanceTime: true})
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should debounce the callback", () => {
        const callback = vi.fn()
        const {result} = renderHook(() => useDebounce(callback, 300))

        act(() => {
            result.current("first")
        })

        expect(callback).not.toHaveBeenCalled()

        act(() => {
            vi.advanceTimersByTime(300)
        })

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith("first")
    })

    it("should reset timer on rapid calls", () => {
        const callback = vi.fn()
        const {result} = renderHook(() => useDebounce(callback, 300))

        act(() => {
            result.current("first")
        })

        act(() => {
            vi.advanceTimersByTime(100)
        })

        act(() => {
            result.current("second")
        })

        expect(callback).not.toHaveBeenCalled()

        act(() => {
            vi.advanceTimersByTime(100)
        })

        expect(callback).not.toHaveBeenCalled()

        act(() => {
            vi.advanceTimersByTime(200)
        })

        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith("second")
    })

    it("should handle multiple arguments through closure", () => {
        const callback = vi.fn()
        const {result} = renderHook(() => useDebounce(callback, 100))

        act(() => {
            result.current("search term")
        })

        act(() => {
            vi.advanceTimersByTime(100)
        })

        expect(callback).toHaveBeenCalledWith("search term")
    })

    it("should clear timeout on unmount", () => {
        const callback = vi.fn()
        const {result, unmount} = renderHook(() => useDebounce(callback, 300))

        act(() => {
            result.current("test")
        })

        unmount()

        act(() => {
            vi.advanceTimersByTime(300)
        })

        expect(callback).not.toHaveBeenCalled()
    })

    it("should work with different delay values", () => {
        const callback = vi.fn()
        const {result} = renderHook(() => useDebounce(callback, 500))

        act(() => {
            result.current("test")
        })

        act(() => {
            vi.advanceTimersByTime(499)
        })

        expect(callback).not.toHaveBeenCalled()

        act(() => {
            vi.advanceTimersByTime(1)
        })

        expect(callback).toHaveBeenCalledTimes(1)
    })

    it("should maintain callback type", () => {
        const callback = vi.fn((search: string) => search.toUpperCase())
        const {result} = renderHook(() => useDebounce(callback, 100))

        expect(typeof result.current).toBe("function")
    })
})
