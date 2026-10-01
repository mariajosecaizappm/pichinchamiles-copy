import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook } from "@testing-library/react"
import { useScreenReader } from "@/presentation/hooks/useScreenReader"
import { ScreenReaderProvider } from "@/presentation/components/providers/ScreenReaderProvider"
import { ReactNode } from "react"

describe("useScreenReader", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
        <ScreenReaderProvider>{children}</ScreenReaderProvider>
    )

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should return the screen reader context when used within provider", () => {
        const { result } = renderHook(() => useScreenReader(), { wrapper })

        expect(result.current).toHaveProperty("announce")
        expect(result.current).toHaveProperty("success")
        expect(result.current).toHaveProperty("error")
        expect(result.current).toHaveProperty("info")
        expect(typeof result.current.announce).toBe("function")
        expect(typeof result.current.success).toBe("function")
        expect(typeof result.current.error).toBe("function")
        expect(typeof result.current.info).toBe("function")
    })

    it("should throw an error when used outside provider", () => {
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

        expect(() => {
            renderHook(() => useScreenReader())
        }).toThrow("useScreenReader must be used within ScreenReaderProvider")

        consoleError.mockRestore()
    })

    it("should provide announce function that accepts message and priority", () => {
        const { result } = renderHook(() => useScreenReader(), { wrapper })

        expect(() => {
            result.current.announce("Test message")
            result.current.announce("Test message", "polite")
            result.current.announce("Test message", "assertive")
        }).not.toThrow()
    })

    it("should provide success function that works correctly", () => {
        const { result } = renderHook(() => useScreenReader(), { wrapper })

        expect(() => {
            result.current.success("Success message")
        }).not.toThrow()
    })

    it("should provide error function that works correctly", () => {
        const { result } = renderHook(() => useScreenReader(), { wrapper })

        expect(() => {
            result.current.error("Error message")
        }).not.toThrow()
    })

    it("should provide info function that works correctly", () => {
        const { result } = renderHook(() => useScreenReader(), { wrapper })

        expect(() => {
            result.current.info("Info message")
        }).not.toThrow()
    })

    it("should use announce function with default polite priority", () => {
        const { result } = renderHook(() => useScreenReader(), { wrapper })

        expect(() => {
            result.current.announce("Default message")
        }).not.toThrow()
    })
})
