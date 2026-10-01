import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useImageGestures } from "@/presentation/pages/Products/ProductDetails/components/ProductGallery/hooks/useImageGestures"

describe("useImageGestures", () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"))
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should initialize with default values", () => {
        const { result } = renderHook(() => useImageGestures())

        expect(result.current.scale).toBe(1)
        expect(result.current.translate).toEqual({ x: 0, y: 0 })
        expect(result.current.handlers).toBeDefined()
        expect(result.current.reset).toBeDefined()
    })

    it("should reset to initial state", () => {
        const { result } = renderHook(() => useImageGestures())

        // Simulate zoom
        act(() => {
            result.current.handlers.onTouchStart({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                timeStamp: Date.now(),
            } as React.TouchEvent)
        })

        // Double tap to zoom
        act(() => {
            result.current.handlers.onTouchStart({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                timeStamp: Date.now() + 100,
            } as React.TouchEvent)
        })

        // Reset
        act(() => {
            result.current.reset()
        })

        expect(result.current.scale).toBe(1)
        expect(result.current.translate).toEqual({ x: 0, y: 0 })
    })

    it("should handle single touch start", () => {
        const { result } = renderHook(() => useImageGestures())

        act(() => {
            result.current.handlers.onTouchStart({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                timeStamp: Date.now(),
            } as React.TouchEvent)
        })

        expect(result.current.scale).toBe(1)
    })

    it("should handle double tap to zoom in", () => {
        const { result } = renderHook(() => useImageGestures())

        // First tap
        act(() => {
            result.current.handlers.onTouchStart({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                timeStamp: Date.now(),
            } as React.TouchEvent)
        })

        // Second tap within 300ms
        act(() => {
            result.current.handlers.onTouchStart({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                timeStamp: Date.now() + 100,
            } as React.TouchEvent)
        })

        expect(result.current.scale).toBe(2.5)
    })

    it("should handle double tap to zoom out when already zoomed", () => {
        const { result } = renderHook(() => useImageGestures())

        // Zoom in first
        act(() => {
            result.current.handlers.onTouchStart({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                timeStamp: 1000,
            } as React.TouchEvent)
        })

        act(() => {
            result.current.handlers.onTouchStart({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                timeStamp: 1100,
            } as React.TouchEvent)
        })

        expect(result.current.scale).toBe(2.5)

        // Wait past 300ms window
        act(() => {
            vi.advanceTimersByTime(500)
        })

        // Double tap again to zoom out
        act(() => {
            result.current.handlers.onTouchStart({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                timeStamp: 1600,
            } as React.TouchEvent)
        })

        act(() => {
            result.current.handlers.onTouchStart({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                timeStamp: 1650,
            } as React.TouchEvent)
        })

        expect(result.current.scale).toBe(1)
        expect(result.current.translate).toEqual({ x: 0, y: 0 })
    })

    it("should handle two finger pinch zoom", () => {
        const { result } = renderHook(() => useImageGestures())

        // Start pinch
        act(() => {
            result.current.handlers.onTouchStart({
                touches: [
                    { clientX: 100, clientY: 100 },
                    { clientX: 200, clientY: 100 },
                ] as unknown as React.TouchList,
                timeStamp: Date.now(),
            } as React.TouchEvent)
        })

        // Move fingers apart
        act(() => {
            result.current.handlers.onTouchMove({
                touches: [
                    { clientX: 50, clientY: 100 },
                    { clientX: 250, clientY: 100 },
                ] as unknown as React.TouchList,
                preventDefault: vi.fn(),
            } as unknown as React.TouchEvent)
        })

        expect(result.current.scale).toBeGreaterThan(1)
    })

    it("should limit scale to maximum of 5", () => {
        const { result } = renderHook(() => useImageGestures())

        // Start with zoom
        act(() => {
            result.current.handlers.onTouchStart({
                touches: [
                    { clientX: 100, clientY: 100 },
                    { clientX: 110, clientY: 100 },
                ] as unknown as React.TouchList,
                timeStamp: Date.now(),
            } as React.TouchEvent)
        })

        // Simulate large pinch
        for (let i = 0; i < 10; i++) {
            act(() => {
                result.current.handlers.onTouchMove({
                    touches: [
                        { clientX: 0, clientY: 100 },
                        { clientX: 500 + i * 100, clientY: 100 },
                    ] as unknown as React.TouchList,
                    preventDefault: vi.fn(),
                } as unknown as React.TouchEvent)
            })
        }

        expect(result.current.scale).toBeLessThanOrEqual(5)
    })

    it("should limit scale to minimum of 1", () => {
        const { result } = renderHook(() => useImageGestures())

        // Try to pinch smaller
        act(() => {
            result.current.handlers.onTouchStart({
                touches: [
                    { clientX: 100, clientY: 100 },
                    { clientX: 200, clientY: 100 },
                ] as unknown as React.TouchList,
                timeStamp: Date.now(),
            } as React.TouchEvent)
        })

        // Move fingers closer
        act(() => {
            result.current.handlers.onTouchMove({
                touches: [
                    { clientX: 150, clientY: 100 },
                    { clientX: 155, clientY: 100 },
                ] as unknown as React.TouchList,
                preventDefault: vi.fn(),
            } as unknown as React.TouchEvent)
        })

        expect(result.current.scale).toBeGreaterThanOrEqual(1)
    })

    it("should handle pan when zoomed", () => {
        const { result } = renderHook(() => useImageGestures())

        // Zoom in first
        act(() => {
            result.current.handlers.onTouchStart({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                timeStamp: Date.now(),
            } as React.TouchEvent)
        })

        act(() => {
            result.current.handlers.onTouchStart({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                timeStamp: Date.now() + 100,
            } as React.TouchEvent)
        })

        // Pan
        act(() => {
            result.current.handlers.onTouchMove({
                touches: [{ clientX: 150, clientY: 150 }] as unknown as React.TouchList,
                preventDefault: vi.fn(),
            } as unknown as React.TouchEvent)
        })

        expect(result.current.translate.x).not.toBe(0)
        expect(result.current.translate.y).not.toBe(0)
    })

    it("should handle touch end", () => {
        const { result } = renderHook(() => useImageGestures())

        // Start zoom
        act(() => {
            result.current.handlers.onTouchStart({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                timeStamp: Date.now(),
            } as React.TouchEvent)
        })

        act(() => {
            result.current.handlers.onTouchStart({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                timeStamp: Date.now() + 100,
            } as React.TouchEvent)
        })

        // Touch end
        act(() => {
            result.current.handlers.onTouchEnd()
        })

        // Scale should remain (above 1.05 threshold)
        expect(result.current.scale).toBe(2.5)
    })

    it("should snap to 1 when scale is below 1.05 on touch end", () => {
        const { result } = renderHook(() => useImageGestures())

        // Set scale just above 1
        act(() => {
            result.current.handlers.onTouchStart({
                touches: [
                    { clientX: 100, clientY: 100 },
                    { clientX: 105, clientY: 100 },
                ] as unknown as React.TouchList,
                timeStamp: Date.now(),
            } as React.TouchEvent)
        })

        // Touch end - should snap back
        act(() => {
            result.current.handlers.onTouchEnd()
        })

        expect(result.current.scale).toBe(1)
    })

    it("should prevent default on touch move", () => {
        const { result } = renderHook(() => useImageGestures())

        const preventDefault = vi.fn()

        act(() => {
            result.current.handlers.onTouchMove({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                preventDefault,
            } as unknown as React.TouchEvent)
        })

        expect(preventDefault).toHaveBeenCalled()
    })

    it("should handle touch move without active panning", () => {
        const { result } = renderHook(() => useImageGestures())

        // Touch move without starting pan (no panning ref set)
        act(() => {
            result.current.handlers.onTouchMove({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                preventDefault: vi.fn(),
            } as unknown as React.TouchEvent)
        })

        // Should not crash
        expect(result.current.translate).toEqual({ x: 0, y: 0 })
    })

    it("should handle slow double tap (not a double tap)", () => {
        const { result } = renderHook(() => useImageGestures())

        // First tap
        act(() => {
            result.current.handlers.onTouchStart({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                timeStamp: 0,
            } as React.TouchEvent)
        })

        // Advance time past 300ms
        act(() => {
            vi.advanceTimersByTime(400)
        })

        // Second tap after 300ms (not a double tap)
        act(() => {
            result.current.handlers.onTouchStart({
                touches: [{ clientX: 100, clientY: 100 }] as unknown as React.TouchList,
                timeStamp: 400,
            } as React.TouchEvent)
        })

        // Should not zoom
        expect(result.current.scale).toBe(1)
    })

    it("should handle empty touch list", () => {
        const { result } = renderHook(() => useImageGestures())

        act(() => {
            result.current.handlers.onTouchStart({
                touches: [] as unknown as React.TouchList,
                timeStamp: Date.now(),
            } as React.TouchEvent)
        })

        // Should not crash
        expect(result.current.scale).toBe(1)
    })
})
