import React from "react"
import {render, screen, fireEvent} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import ProductSearchBar from "@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/ProductSearchBar"

vi.mock("@/presentation/components/icons/IconSearch", () => ({
    default: () => <span data-testid="icon-search">Search</span>,
}))

describe("ProductSearchBar", () => {
    const defaultProps = {
        value: "",
        onChange: vi.fn(),
        onFocus: vi.fn(),
        onBlur: vi.fn(),
        onSubmit: vi.fn(),
    }

    it("should render input with placeholder", () => {
        render(<ProductSearchBar {...defaultProps} placeholder="Buscar producto" />)

        expect(screen.getByPlaceholderText("Buscar producto")).toBeInTheDocument()
    })

    it("should use default placeholder when not provided", () => {
        render(<ProductSearchBar {...defaultProps} />)

        expect(screen.getByPlaceholderText("Busca tu producto")).toBeInTheDocument()
    })

    it("should display provided value", () => {
        render(<ProductSearchBar {...defaultProps} value="test search" />)

        expect(screen.getByDisplayValue("test search")).toBeInTheDocument()
    })

    it("should call onChange when input value changes", () => {
        const onChange = vi.fn()
        render(<ProductSearchBar {...defaultProps} onChange={onChange} />)

        const input = screen.getByRole("textbox")
        fireEvent.change(input, {target: {value: "new value"}})

        expect(onChange).toHaveBeenCalledWith("new value")
    })

    it("should accept onFocus prop without errors", () => {
        const onFocus = vi.fn()
        expect(() => {
            render(<ProductSearchBar {...defaultProps} onFocus={onFocus} />)
            screen.getByRole("textbox")
        }).not.toThrow()
    })

    it("should call onBlur when input loses focus", () => {
        const onBlur = vi.fn()
        render(<ProductSearchBar {...defaultProps} onBlur={onBlur} />)

        const input = screen.getByRole("textbox")
        fireEvent.blur(input)

        expect(onBlur).toHaveBeenCalledTimes(1)
    })

    it("should call onSubmit when form is submitted", () => {
        const onSubmit = vi.fn((e) => e.preventDefault())
        const { container } = render(<ProductSearchBar {...defaultProps} onSubmit={onSubmit} />)

        const form = container.querySelector('form')
        if (form) {
            fireEvent.submit(form)
        }

        expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    it("should render search icon", () => {
        render(<ProductSearchBar {...defaultProps} />)

        expect(screen.getByTestId("icon-search")).toBeInTheDocument()
    })

    it("should render children when provided", () => {
        render(
            <ProductSearchBar {...defaultProps}>
                <div data-testid="child-content">Suggestions</div>
            </ProductSearchBar>
        )

        expect(screen.getByTestId("child-content")).toBeInTheDocument()
    })

    it("should not call onChange when displayOnly is true", () => {
        const onChange = vi.fn()
        render(<ProductSearchBar {...defaultProps} onChange={onChange} displayOnly={true} />)

        const input = screen.getByRole("textbox")
        fireEvent.change(input, {target: {value: "new value"}})

        expect(onChange).not.toHaveBeenCalled()
    })

    it("should apply readOnly when displayOnly is true", () => {
        render(<ProductSearchBar {...defaultProps} displayOnly={true} />)

        const input = screen.getByRole("textbox")
        expect(input).toHaveAttribute("readonly")
    })

    it("should apply cursor-pointer class when displayOnly is true", () => {
        const { container } = render(<ProductSearchBar {...defaultProps} displayOnly={true} />)

        const wrapper = container.querySelector(".cursor-pointer")
        expect(wrapper).toBeInTheDocument()
    })

    it("should forward ref to input element", () => {
        const inputRef = {current: null as HTMLInputElement | null}
        render(<ProductSearchBar {...defaultProps} inputRef={inputRef} />)

        expect(inputRef.current).toBeInstanceOf(HTMLInputElement)
    })

    it("should apply focus ring classes", () => {
        const { container } = render(<ProductSearchBar {...defaultProps} />)

        const inputWrapper = container.querySelector("[data-slot='input-wrapper']")
        expect(inputWrapper).toBeInTheDocument()
        expect(inputWrapper?.className).toContain("ring-2")
    })

    it("should call onClick when displayOnly button is clicked", () => {
        const onClick = vi.fn()
        render(<ProductSearchBar {...defaultProps} displayOnly onClick={onClick} />)

        fireEvent.click(screen.getByRole("button", { name: "Busca tu producto" }))
        expect(onClick).toHaveBeenCalledTimes(1)
    })

    it("should call onKeyDown when provided", () => {
        const onKeyDown = vi.fn()
        render(<ProductSearchBar {...defaultProps} onKeyDown={onKeyDown} />)

        fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" })
        expect(onKeyDown).toHaveBeenCalledTimes(1)
    })

    it("should not call onClick in displayOnly mode when onClick is undefined", () => {
        render(<ProductSearchBar {...defaultProps} displayOnly />)

        expect(() => {
            fireEvent.click(screen.getByRole("button", { name: "Busca tu producto" }))
        }).not.toThrow()
    })
})
