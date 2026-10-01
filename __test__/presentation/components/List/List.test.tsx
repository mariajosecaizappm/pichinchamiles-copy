import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import List from "@/presentation/components/List/List";

describe("List", () => {
    it("renders items in an unordered list by default", () => {
        render(<List items={["One", "Two"]} />);

        expect(screen.getByRole("list")).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
        expect(document.querySelector('[data-test-id="list-item-0"]')).toBeInTheDocument();
        expect(document.querySelector('[data-test-id="list-item-1"]')).toBeInTheDocument();
    });

    it("renders ordered list when type is ol", () => {
        render(<List items={["One", "Two"]} type="ol" />);

        expect(screen.getByRole("list")).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
        expect(document.querySelector('[data-test-id="list-item-0"]')).toBeInTheDocument();
        expect(document.querySelector('[data-test-id="list-item-1"]')).toBeInTheDocument();
    });

    it("uses renderItem callback when provided", () => {
        render(
            <List
                items={["One", "Two"]}
                renderItem={(item, i) => (
                    <span data-testid={`rendered-${i}`}>{`item-${item}`}</span>
                )}
            />,
        );

        expect(screen.getByTestId("rendered-0")).toHaveTextContent("item-One");
        expect(screen.getByTestId("rendered-1")).toHaveTextContent("item-Two");
    });

    it("supports items of any type via renderItem", () => {
        const complexItems = [
            { id: 1, label: "First" },
            { id: 2, label: "Second" },
        ];

        render(
            <List
                items={complexItems}
                renderItem={(item) => <div data-testid={`complex-${item.id}`}>{item.label}</div>}
            />,
        );

        expect(screen.getByTestId("complex-1")).toHaveTextContent("First");
        expect(screen.getByTestId("complex-2")).toHaveTextContent("Second");
    });
});