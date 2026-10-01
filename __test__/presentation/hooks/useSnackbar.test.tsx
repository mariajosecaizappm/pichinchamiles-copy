import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import useSnackbar from "@/presentation/hooks/useSnackbar"

vi.mock("@/presentation/components/Snackbar", () => ({
    default: ({ content, onClose }: { content: React.ReactNode; onClose: () => void }) => (
        <div data-testid="snackbar">
            {content}
            <button onClick={onClose}>Close</button>
        </div>
    ),
}))

const mockRender = vi.fn()
const mockUnmount = vi.fn()

vi.mock("react-dom/client", () => ({
    createRoot: vi.fn(() => ({
        render: mockRender,
        unmount: mockUnmount,
    })),
}))

const MockIcon = () => <svg data-testid="snackbar-icon" />

describe("useSnackbar", () => {
    beforeEach(() => {
        mockRender.mockClear()
        mockUnmount.mockClear()
        vi.useFakeTimers()
        document.body.innerHTML = ""
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should return addSnackbar function", () => {
        const { result } = renderHook(() => useSnackbar())
        expect(typeof result.current.addSnackbar).toBe("function")
    })

    it("should call root.render when addSnackbar is invoked", () => {
        const { result } = renderHook(() => useSnackbar())
        act(() => {
            result.current.addSnackbar({
                icon: MockIcon,
                content: <p>Test content</p>,
            })
        })
        expect(mockRender).toHaveBeenCalled()
    })

    it("should append a container to document.body", () => {
        const { result } = renderHook(() => useSnackbar())
        act(() => {
            result.current.addSnackbar({
                icon: MockIcon,
                content: "Test",
            })
        })
        expect(document.body.children.length).toBeGreaterThan(0)
    })

    it("should call render twice when autoDismiss fires (initial + null dismiss)", () => {
        const { result } = renderHook(() => useSnackbar())
        const callsBefore = mockRender.mock.calls.length

        act(() => {
            result.current.addSnackbar({
                icon: MockIcon,
                content: "Test",
                autoDismiss: 3000,
            })
        })

        expect(mockRender.mock.calls.length).toBe(callsBefore + 1)

        act(() => { vi.advanceTimersByTime(3000) })

        expect(mockRender.mock.calls.length).toBe(callsBefore + 2)
    })

    it("should call content function with close when content is a function", () => {
        const contentFn = vi.fn(() => <p>Dynamic content</p>)
        const { result } = renderHook(() => useSnackbar())
        act(() => {
            result.current.addSnackbar({
                icon: MockIcon,
                content: contentFn,
            })
        })
        expect(contentFn).toHaveBeenCalledWith(expect.any(Function))
    })

    it("should call footer function with close when footer is a function", () => {
        const footerFn = vi.fn(() => <button>Go to cart</button>)
        const { result } = renderHook(() => useSnackbar())
        act(() => {
            result.current.addSnackbar({
                icon: MockIcon,
                content: "Test",
                footer: footerFn,
            })
        })
        expect(footerFn).toHaveBeenCalledWith(expect.any(Function))
    })
})
