import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"
import { useFocusTrap } from "@/presentation/hooks/useFocusTrap"

// Test component that uses the hook
const TestComponent = ({ isActive, onEscape }: { isActive: boolean; onEscape?: () => void }) => {
    const containerRef = useFocusTrap({ isActive, onEscape })
    
    return (
        <section ref={containerRef as React.RefObject<HTMLElement>} data-testid="container">
            <button data-testid="first">First</button>
            <button data-testid="second">Second</button>
            <button data-testid="third">Third</button>
        </section>
    )
}

describe("useFocusTrap", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render without errors when isActive is false", () => {
        const { container } = render(<TestComponent isActive={false} />)
        expect(container).toBeInTheDocument()
    })

    it("should render without errors when isActive is true", () => {
        const { container } = render(<TestComponent isActive={true} />)
        expect(container).toBeInTheDocument()
    })

    it("should render without errors when onEscape is provided", () => {
        const onEscape = vi.fn()
        const { container } = render(<TestComponent isActive={true} onEscape={onEscape} />)
        expect(container).toBeInTheDocument()
    })

    it("should render without errors when onEscape is not provided", () => {
        const { container } = render(<TestComponent isActive={true} />)
        expect(container).toBeInTheDocument()
    })

    it("should render all focusable elements", () => {
        render(<TestComponent isActive={true} />)
        expect(screen.getByTestId("first")).toBeInTheDocument()
        expect(screen.getByTestId("second")).toBeInTheDocument()
        expect(screen.getByTestId("third")).toBeInTheDocument()
    })

    it("should handle unmount without errors", () => {
        const { unmount } = render(<TestComponent isActive={true} />)
        expect(() => unmount()).not.toThrow()
    })

    it("should handle changing from isActive false to true", () => {
        const { rerender } = render(<TestComponent isActive={false} />)
        expect(() => rerender(<TestComponent isActive={true} />)).not.toThrow()
    })

    it("should handle changing from isActive true to false", () => {
        const { rerender } = render(<TestComponent isActive={true} />)
        expect(() => rerender(<TestComponent isActive={false} />)).not.toThrow()
    })

    it("should handle changing onEscape callback", () => {
        const onEscape1 = vi.fn()
        const onEscape2 = vi.fn()
        const { rerender } = render(<TestComponent isActive={true} onEscape={onEscape1} />)
        expect(() => rerender(<TestComponent isActive={true} onEscape={onEscape2} />)).not.toThrow()
    })

    it("should handle adding onEscape callback", () => {
        const onEscape = vi.fn()
        const { rerender } = render(<TestComponent isActive={true} />)
        expect(() => rerender(<TestComponent isActive={true} onEscape={onEscape} />)).not.toThrow()
    })

    it("should handle removing onEscape callback", () => {
        const onEscape = vi.fn()
        const { rerender } = render(<TestComponent isActive={true} onEscape={onEscape} />)
        expect(() => rerender(<TestComponent isActive={true} />)).not.toThrow()
    })

    it("should handle Tab key event without errors", () => {
        const onEscape = vi.fn()
        render(<TestComponent isActive={true} onEscape={onEscape} />)
        
        const container = screen.getByTestId("container")
        const tabEvent = new KeyboardEvent("keydown", { key: "Tab" })
        
        expect(() => container.dispatchEvent(tabEvent)).not.toThrow()
    })

    it("should handle Shift+Tab key event without errors", () => {
        const onEscape = vi.fn()
        render(<TestComponent isActive={true} onEscape={onEscape} />)
        
        const container = screen.getByTestId("container")
        const shiftTabEvent = new KeyboardEvent("keydown", { key: "Tab", shiftKey: true })
        
        expect(() => container.dispatchEvent(shiftTabEvent)).not.toThrow()
    })

    it("should handle Escape key event without errors", () => {
        const onEscape = vi.fn()
        render(<TestComponent isActive={true} onEscape={onEscape} />)
        
        const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" })
        
        expect(() => document.dispatchEvent(escapeEvent)).not.toThrow()
    })

    it("should handle non-Tab key event without errors", () => {
        const onEscape = vi.fn()
        render(<TestComponent isActive={true} onEscape={onEscape} />)
        
        const container = screen.getByTestId("container")
        const enterEvent = new KeyboardEvent("keydown", { key: "Enter" })
        
        expect(() => container.dispatchEvent(enterEvent)).not.toThrow()
    })
})
