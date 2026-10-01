import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SearchInput from "@/presentation/components/Form/components/SearchInput/SearchInput";

vi.mock("@/presentation/components/icons/IconSearch", () => ({
    default: () => <div data-testid="icon-search">Search Icon</div>,
}));

vi.mock("@/presentation/components/Form/components/Input", () => ({
    Input: React.forwardRef((props: any, ref) => (
        <input
            data-testid="search-input"
            ref={ref}
            {...props}
            className={`${props.classNames?.inputWrapper} ${props.classNames?.input}`}
        />
    )),
}));

describe("SearchInput", () => {
    const mockOnChange = vi.fn();
    const mockOnFocus = vi.fn();
    const mockOnBlur = vi.fn();
    const mockOnKeyDown = vi.fn();
    const mockOnClick = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders with value and placeholder", () => {
        render(
            <SearchInput
                value="test value"
                onChange={mockOnChange}
                placeholder="Search here"
            />
        );

        const input = screen.getByTestId("search-input");
        expect(input).toHaveAttribute("value", "test value");
        expect(input).toHaveAttribute("placeholder", "Search here");
    });

    it("calls onChange when value changes", () => {
        render(
            <SearchInput
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByTestId("search-input");
        fireEvent.change(input, { target: { value: "new value" } });

        expect(mockOnChange).toHaveBeenCalledWith("new value");
    });

    it("does not call onChange when displayOnly is true", () => {
        render(
            <SearchInput
                value="test"
                onChange={mockOnChange}
                displayOnly={true}
            />
        );

        const input = screen.getByTestId("search-input");
        fireEvent.change(input, { target: { value: "new value" } });

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("calls onFocus when input is focused", () => {
        render(
            <SearchInput
                value=""
                onChange={mockOnChange}
                onFocus={mockOnFocus}
            />
        );

        const input = screen.getByTestId("search-input");
        fireEvent.focus(input);

        expect(mockOnFocus).toHaveBeenCalled();
    });

    it("calls onBlur when input loses focus", () => {
        render(
            <SearchInput
                value=""
                onChange={mockOnChange}
                onBlur={mockOnBlur}
            />
        );

        const input = screen.getByTestId("search-input");
        fireEvent.blur(input);

        expect(mockOnBlur).toHaveBeenCalled();
    });

    it("calls onKeyDown when key is pressed", () => {
        render(
            <SearchInput
                value=""
                onChange={mockOnChange}
                onKeyDown={mockOnKeyDown}
            />
        );

        const input = screen.getByTestId("search-input");
        fireEvent.keyDown(input, { key: "Enter" });

        expect(mockOnKeyDown).toHaveBeenCalled();
    });

    it("sets readOnly when displayOnly is true", () => {
        render(
            <SearchInput
                value="test"
                onChange={mockOnChange}
                displayOnly={true}
            />
        );

        const input = screen.getByTestId("search-input");
        expect(input).toHaveAttribute("readOnly");
    });

    it("does not set readOnly when displayOnly is false", () => {
        render(
            <SearchInput
                value="test"
                onChange={mockOnChange}
                displayOnly={false}
            />
        );

        const input = screen.getByTestId("search-input");
        expect(input).not.toHaveAttribute("readOnly");
    });

    it("applies hideFocusRing styles when true", () => {
        render(
            <SearchInput
                value=""
                onChange={mockOnChange}
                hideFocusRing={true}
            />
        );

        const input = screen.getByTestId("search-input");
        expect(input.className).toContain("group-data-[focus=true]:ring-0");
    });

    it("applies focus ring styles when hideFocusRing is false", () => {
        render(
            <SearchInput
                value=""
                onChange={mockOnChange}
                hideFocusRing={false}
            />
        );

        const input = screen.getByTestId("search-input");
        expect(input.className).toContain("group-data-[focus=true]:ring-2");
    });

    it("applies cursor-pointer class when displayOnly is true", () => {
        render(
            <SearchInput
                value=""
                onChange={mockOnChange}
                displayOnly={true}
            />
        );

        const input = screen.getByTestId("search-input");
        expect(input.className).toContain("cursor-pointer");
    });

    it("forwards ref to input element", () => {
        const ref = React.createRef<HTMLInputElement>();
        
        render(
            <SearchInput
                value=""
                onChange={mockOnChange}
                inputRef={ref}
            />
        );

        expect(ref.current).toBeTruthy();
    });

    it("renders with default placeholder when not provided", () => {
        render(
            <SearchInput
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByTestId("search-input");
        expect(input).toBeInTheDocument();
    });

    it("sets correct input attributes", () => {
        render(
            <SearchInput
                value=""
                onChange={mockOnChange}
            />
        );

        const input = screen.getByTestId("search-input");
        expect(input).toHaveAttribute("type", "text");
        expect(input).toHaveAttribute("autoCorrect", "on");
        expect(input).toHaveAttribute("autoCapitalize", "none");
        expect(input).toHaveAttribute("autoComplete", "off");
        expect(input).toHaveAttribute("aria-invalid", "false");
    });

    it("passes additional props to Input component", () => {
        render(
            <SearchInput
                value=""
                onChange={mockOnChange}
                data-testid="custom-search"
                aria-label="Custom search input"
            />
        );

        const input = screen.getByTestId("custom-search");
        expect(input).toHaveAttribute("aria-label", "Custom search input");
    });
});
