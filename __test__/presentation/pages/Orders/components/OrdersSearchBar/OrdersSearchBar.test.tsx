import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
    useDebounce: vi.fn(),
}));

vi.mock("@/presentation/hooks/useDebounce", () => ({
    default: mocks.useDebounce,
}));

vi.mock("@/presentation/pages/Orders/components/OrdersSearchBar/ClearSearchButton", () => ({
    default: ({ onClear, isClearing }: { onClear: () => void; isClearing?: boolean }) => (
        <button data-testid="clear-button" data-clearing={isClearing} onClick={onClear}>Clear</button>
    ),
}));

vi.mock("@/presentation/components/Form/components/SearchInput", () => ({
    default: ({ name, placeholder, value, onChange, endContent }: { name?: string; placeholder?: string; value: string; onChange: (value: string) => void; endContent?: React.ReactNode }) => (
        <div>
            <input
                data-testid="search-input"
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {endContent && <div data-testid="search-end-content">{endContent}</div>}
        </div>
    ),
}));

import OrdersSearchBar from "@/presentation/pages/Orders/components/OrdersSearchBar/OrdersSearchBar";

describe("OrdersSearchBar", () => {
    let debouncedCallback: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        debouncedCallback = vi.fn();
        mocks.useDebounce.mockReturnValue(debouncedCallback);
    });

    it("initializes with provided value", () => {
        const mockOnSearch = vi.fn();

        render(<OrdersSearchBar value="123456" onSearch={mockOnSearch} onClear={vi.fn()} />);

        const input = screen.getByTestId("search-input");
        expect(input).toHaveValue("123456");
    });

    it("updates local state on change", () => {
        const mockOnSearch = vi.fn();

        render(<OrdersSearchBar value="" onSearch={mockOnSearch} onClear={vi.fn()} />);

        const input = screen.getByTestId("search-input");
        fireEvent.change(input, { target: { value: "789" } });

        expect(input).toHaveValue("789");
    });

    it("calls debounced search callback", () => {
        const mockOnSearch = vi.fn();

        render(<OrdersSearchBar value="" onSearch={mockOnSearch} onClear={vi.fn()} />);

        const input = screen.getByTestId("search-input");
        fireEvent.change(input, { target: { value: "123" } });

        expect(debouncedCallback).toHaveBeenCalledWith("123");
    });

    it("creates debounced callback with 500ms delay", () => {
        const mockOnSearch = vi.fn();

        render(<OrdersSearchBar value="" onSearch={mockOnSearch} onClear={vi.fn()} />);

        expect(mocks.useDebounce).toHaveBeenCalledWith(mockOnSearch, 500);
    });

    it("renders SearchInput with correct props", () => {
        const mockOnSearch = vi.fn();

        render(<OrdersSearchBar value="test" onSearch={mockOnSearch} onClear={vi.fn()} />);

        const input = screen.getByTestId("search-input");
        expect(input).toHaveAttribute("name", "orderNumber");
        expect(input).toHaveAttribute("placeholder", "Busca por número de pedido");
    });

    it("handles multiple value changes", () => {
        const mockOnSearch = vi.fn();

        render(<OrdersSearchBar value="" onSearch={mockOnSearch} onClear={vi.fn()} />);

        const input = screen.getByTestId("search-input");

        fireEvent.change(input, { target: { value: "123" } });
        expect(debouncedCallback).toHaveBeenCalledWith("123");

        fireEvent.change(input, { target: { value: "456" } });
        expect(debouncedCallback).toHaveBeenCalledWith("456");

        expect(debouncedCallback).toHaveBeenCalledTimes(2);
    });

    it("handles empty value", () => {
        const mockOnSearch = vi.fn();

        render(<OrdersSearchBar value="123" onSearch={mockOnSearch} onClear={vi.fn()} />);

        const input = screen.getByTestId("search-input");
        fireEvent.change(input, { target: { value: "" } });

        expect(input).toHaveValue("");
        expect(debouncedCallback).toHaveBeenCalledWith("");
    });

    it("renders clear button when value is not empty", () => {
        const mockOnSearch = vi.fn();

        render(<OrdersSearchBar value="123" onSearch={mockOnSearch} onClear={vi.fn()} />);

        expect(screen.getByTestId("clear-button")).toBeInTheDocument();
    });

    it("does not render clear button when value is empty", () => {
        const mockOnSearch = vi.fn();

        render(<OrdersSearchBar value="" onSearch={mockOnSearch} onClear={vi.fn()} />);

        expect(screen.queryByTestId("clear-button")).not.toBeInTheDocument();
    });

    it("calls onClear and clears local state when clear button is clicked", () => {
        const mockOnSearch = vi.fn();
        const mockOnClear = vi.fn();

        render(<OrdersSearchBar value="123" onSearch={mockOnSearch} onClear={mockOnClear} />);

        fireEvent.click(screen.getByTestId("clear-button"));

        expect(mockOnClear).toHaveBeenCalledTimes(1);
        expect(screen.getByTestId("search-input")).toHaveValue("");
    });

    it("passes isClearing to clear button", () => {
        const mockOnSearch = vi.fn();

        render(<OrdersSearchBar value="123" onSearch={mockOnSearch} onClear={vi.fn()} isClearing />);

        expect(screen.getByTestId("clear-button")).toHaveAttribute("data-clearing", "true");
    });

    it("strips non-numeric characters and spaces", () => {
        render(<OrdersSearchBar value="" onSearch={vi.fn()} onClear={vi.fn()} />);

        const input = screen.getByTestId("search-input");
        fireEvent.change(input, { target: { value: "12 a-34" } });

        expect(input).toHaveValue("1234");
        expect(debouncedCallback).toHaveBeenCalledWith("1234");
    });

    it("rejects input that contains only non-numeric characters", () => {
        render(<OrdersSearchBar value="12" onSearch={vi.fn()} onClear={vi.fn()} />);

        const input = screen.getByTestId("search-input");
        fireEvent.change(input, { target: { value: "12ab " } });

        expect(input).toHaveValue("12");
        expect(debouncedCallback).not.toHaveBeenCalled();
    });
});
