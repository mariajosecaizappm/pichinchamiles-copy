import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import ArrowButton from "@/presentation/pages/Products/components/Categories/Subcategories/ArrowButton/ArrowButton"

describe("ArrowButton", () => {
    it("should render button with children", () => {
        render(
            <ArrowButton>
                <span data-testid="arrow-icon">Arrow</span>
            </ArrowButton>
        )

        expect(screen.getByRole("button")).toBeInTheDocument()
        expect(screen.getByTestId("arrow-icon")).toBeInTheDocument()
    })

    it("should call onClick when clicked", () => {
        const handleClick = vi.fn()
        render(<ArrowButton onClick={handleClick}><span>Arrow</span></ArrowButton>)

        const button = screen.getByRole("button")
        fireEvent.click(button)

        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it("should be disabled when disabled prop is true", () => {
        render(<ArrowButton disabled><span>Arrow</span></ArrowButton>)

        const button = screen.getByRole("button")
        expect(button).toBeDisabled()
    })

    it("should pass type prop correctly", () => {
        render(<ArrowButton type="submit"><span>Arrow</span></ArrowButton>)

        const button = screen.getByRole("button")
        expect(button).toHaveAttribute("type", "submit")
    })

    it("should apply additional className", () => {
        render(<ArrowButton className="custom-class"><span>Arrow</span></ArrowButton>)

        const button = screen.getByRole("button")
        expect(button).toHaveClass("custom-class")
    })
})
