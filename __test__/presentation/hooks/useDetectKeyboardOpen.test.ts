import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import useDetectKeyboardOpen from "@/presentation/hooks/useDetectKeyboardOpen"

describe("useDetectKeyboardOpen", () => {
    let resizeHandler: (() => void) | null = null
    let addEventListener: ReturnType<typeof vi.fn>
    let removeEventListener: ReturnType<typeof vi.fn>
    const originalVisualViewport = window.visualViewport
    const originalScreen = window.screen

    const setupVisualViewport = (screenHeight: number, viewportHeight: number) => {
        resizeHandler = null
        addEventListener = vi.fn((event: string, handler: () => void) => {
            if (event === "resize") {
                resizeHandler = handler
            }
        })
        removeEventListener = vi.fn()

        Object.defineProperty(window, "screen", {
            configurable: true,
            value: { height: screenHeight },
        })
        Object.defineProperty(window, "visualViewport", {
            configurable: true,
            value: {
                height: viewportHeight,
                addEventListener,
                removeEventListener,
            },
        })
    }

    beforeEach(() => {
        setupVisualViewport(800, 800)
    })

    afterEach(() => {
        Object.defineProperty(window, "screen", {
            configurable: true,
            value: originalScreen,
        })

        if (originalVisualViewport) {
            Object.defineProperty(window, "visualViewport", {
                configurable: true,
                value: originalVisualViewport,
            })
        } else {
            Object.defineProperty(window, "visualViewport", {
                configurable: true,
                value: undefined,
            })
        }

        vi.restoreAllMocks()
    })

    it("should return false when the keyboard is closed", () => {
        setupVisualViewport(800, 800)

        const { result } = renderHook(() => useDetectKeyboardOpen())

        expect(result.current).toBe(false)
    })

    it("should return true when the keyboard is open", () => {
        setupVisualViewport(800, 400)

        const { result } = renderHook(() => useDetectKeyboardOpen())

        expect(result.current).toBe(true)
    })

    it("should use defaultValue when visualViewport is unavailable", () => {
        Object.defineProperty(window, "visualViewport", {
            configurable: true,
            value: undefined,
        })

        const { result } = renderHook(() => useDetectKeyboardOpen(300, true))

        expect(result.current).toBe(true)
    })

    it("should respect a custom minKeyboardHeight threshold", () => {
        setupVisualViewport(800, 400)

        const { result } = renderHook(() => useDetectKeyboardOpen(250))

        expect(result.current).toBe(true)
    })

    it("should update state when visualViewport resizes", () => {
        setupVisualViewport(800, 800)

        const { result } = renderHook(() => useDetectKeyboardOpen())

        expect(result.current).toBe(false)

        act(() => {
            Object.defineProperty(window.visualViewport!, "height", {
                configurable: true,
                value: 400,
            })
            resizeHandler?.()
        })

        expect(result.current).toBe(true)

        act(() => {
            Object.defineProperty(window.visualViewport!, "height", {
                configurable: true,
                value: 800,
            })
            resizeHandler?.()
        })

        expect(result.current).toBe(false)
    })

    it("should not update state when resize reports the same keyboard state", () => {
        setupVisualViewport(800, 800)

        const { result } = renderHook(() => useDetectKeyboardOpen())

        expect(result.current).toBe(false)

        act(() => {
            resizeHandler?.()
        })

        expect(result.current).toBe(false)
    })

    it("should register and remove the resize listener", () => {
        const { unmount } = renderHook(() => useDetectKeyboardOpen())

        expect(addEventListener).toHaveBeenCalledWith("resize", expect.any(Function))

        unmount()

        expect(removeEventListener).toHaveBeenCalledWith("resize", expect.any(Function))
    })

    it("should re-evaluate when minKeyboardHeight changes", () => {
        setupVisualViewport(800, 550)

        const { result, rerender } = renderHook(
            ({ minKeyboardHeight }) => useDetectKeyboardOpen(minKeyboardHeight),
            { initialProps: { minKeyboardHeight: 200 } },
        )

        expect(result.current).toBe(true)

        rerender({ minKeyboardHeight: 300 })

        expect(result.current).toBe(false)
    })
})
