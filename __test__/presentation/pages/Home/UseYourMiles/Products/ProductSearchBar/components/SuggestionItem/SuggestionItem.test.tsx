import React from "react"
import {render, screen, fireEvent} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import SuggestionItem from "@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/components/SuggestionItem/SuggestionItem"

describe("SuggestionItem", () => {
    it("should render suggestion text", () => {
        render(<SuggestionItem suggestion="Test Suggestion" onClick={vi.fn()} />)

        expect(screen.getByText("Test Suggestion")).toBeInTheDocument()
    })

    it("should call onClick when clicked", () => {
        const onClick = vi.fn()
        render(<SuggestionItem suggestion="Test Suggestion" onClick={onClick} />)

        const button = screen.getByRole("button")
        fireEvent.click(button)

        expect(onClick).toHaveBeenCalledTimes(1)
        expect(onClick).toHaveBeenCalledWith("Test Suggestion")
    })

    it("should render as a button", () => {
        render(<SuggestionItem suggestion="Test" onClick={vi.fn()} />)

        expect(screen.getByRole("button")).toBeInTheDocument()
    })

    it("should apply correct styling classes", () => {
        const {container} = render(<SuggestionItem suggestion="Test" onClick={vi.fn()} />)

        const button = container.querySelector("button")
        expect(button).toHaveClass("w-full")
        expect(button).toHaveClass("text-left")
        expect(button).toHaveClass("hover:bg-gray-100")
        expect(button).toHaveClass("cursor-pointer")
        expect(button).toHaveClass("transition-colors")
    })

    it("should render with long suggestion text", () => {
        const longSuggestion = "This is a very long suggestion text that might wrap to multiple lines"
        render(<SuggestionItem suggestion={longSuggestion} onClick={vi.fn()} />)

        expect(screen.getByText(longSuggestion)).toBeInTheDocument()
    })

    it("should render with special characters in suggestion", () => {
        const specialSuggestion = "Producto con ñ y acentos: café, niño"
        render(<SuggestionItem suggestion={specialSuggestion} onClick={vi.fn()} />)

        expect(screen.getByText(specialSuggestion)).toBeInTheDocument()
    })

    it("should handle rapid clicks", () => {
        const onClick = vi.fn()
        render(<SuggestionItem suggestion="Test" onClick={onClick} />)

        const button = screen.getByRole("button")
        fireEvent.click(button)
        fireEvent.click(button)
        fireEvent.click(button)

        expect(onClick).toHaveBeenCalledTimes(3)
    })

    it("should have correct button type", () => {
        render(<SuggestionItem suggestion="Test" onClick={vi.fn()} />)

        const button = screen.getByRole("button")
        expect(button).toHaveAttribute("type", "button")
    })

    it("should render disabled suggestion as text without button", () => {
        render(<SuggestionItem suggestion="Nombre sin respuesta" disabled />)

        expect(screen.getByText("Nombre sin respuesta")).toBeInTheDocument()
        expect(screen.queryByRole("button")).not.toBeInTheDocument()
    })

    it("should not call onClick when disabled", () => {
        const onClick = vi.fn()
        const {container} = render(<SuggestionItem suggestion="Test" onClick={onClick} disabled />)

        const span = container.querySelector("span")
        fireEvent.click(span as HTMLElement)

        expect(onClick).not.toHaveBeenCalled()
    })
})
