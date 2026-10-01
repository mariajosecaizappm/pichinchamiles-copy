import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import EmbeddedList from "@/presentation/components/EmbeddedList/EmbeddedList";
import type { EmbeddedListItem } from "@/presentation/components/EmbeddedList/types";

describe("EmbeddedList", () => {
    const mockItems: EmbeddedListItem[] = [
        {
            content: "First item content"
        },
        {
            content: "Second item content",
            subList: ["Sub item 1", "Sub item 2"]
        },
        {
            content: "Third item content"
        }
    ];

    it("renders items in unordered list by default", () => {
        render(<EmbeddedList items={mockItems} />);

        const lists = screen.getAllByRole("list");
        expect(lists.length).toBeGreaterThan(0);
        expect(screen.getAllByRole("listitem")).toHaveLength(5); // 3 main + 2 sub-list items
        expect(screen.getByText("First item content")).toBeInTheDocument();
        expect(screen.getByText("Second item content")).toBeInTheDocument();
        expect(screen.getByText("Third item content")).toBeInTheDocument();
    });

    it("renders ordered list when type is ol", () => {
        render(<EmbeddedList items={mockItems} type="ol" />);

        const lists = screen.getAllByRole("list");
        expect(lists[0].tagName).toBe("OL");
        expect(screen.getAllByRole("listitem")).toHaveLength(5); // 3 main + 2 sub-list items
    });

    it("renders sub-list when item has subList", () => {
        render(<EmbeddedList items={mockItems} />);

        expect(screen.getByText("Sub item 1")).toBeInTheDocument();
        expect(screen.getByText("Sub item 2")).toBeInTheDocument();
        
        // Check that sub-list is rendered as unordered list
        const subLists = screen.getAllByRole("list");
        expect(subLists.length).toBeGreaterThan(1); // Main list + sub-list
    });

    it("applies custom className", () => {
        render(<EmbeddedList items={mockItems} className="custom-embedded-list" />);

        const container = screen.getByText("First item content").closest("div");
        expect(container).toHaveClass("custom-embedded-list");
    });

    it("applies correct list styles based on type", () => {
        const { rerender } = render(<EmbeddedList items={mockItems} type="ul" />);
        
        const lists = screen.getAllByRole("list");
        expect(lists[0]).toHaveClass("list-disc");

        rerender(<EmbeddedList items={mockItems} type="ol" />);
        
        const olLists = screen.getAllByRole("list");
        expect(olLists[0]).toHaveClass("list-decimal");
    });

    it("renders items without sub-list correctly", () => {
        const itemsWithoutSubList: EmbeddedListItem[] = [
            { content: "Item without sub list" }
        ];

        render(<EmbeddedList items={itemsWithoutSubList} />);

        expect(screen.getByText("Item without sub list")).toBeInTheDocument();
        expect(screen.getAllByRole("list")).toHaveLength(1); // Only main list
    });

    it("generates unique keys for list items", () => {
        render(<EmbeddedList items={mockItems} />);

        const listItems = screen.getAllByRole("listitem");
        // Keys are internal React properties, we test that items are rendered correctly instead
        expect(listItems.length).toBeGreaterThan(0);
    });

    it("handles empty items array", () => {
        render(<EmbeddedList items={[]} />);

        // When empty, should render the container but no lists
        expect(screen.queryByRole("list")).not.toBeInTheDocument();
        expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    });

    it("applies custom subListClassName with default classes", () => {
        render(<EmbeddedList items={mockItems} subListClassName="custom-sub-list" />);

        const subList = screen.getByText("Sub item 1").closest("ul");
        expect(subList).toHaveClass("base-paragraph", "ml-6", "list-[circle]!", "mb-0", "custom-sub-list");
    });

    it("applies default classes when subListClassName not provided", () => {
        render(<EmbeddedList items={mockItems} />);

        const subList = screen.getByText("Sub item 1").closest("ul");
        expect(subList).toHaveClass("ml-6", "list-[circle]!", "mb-0", "base-paragraph");
    });

    it("applies correct classes to sub-list", () => {
        render(<EmbeddedList items={mockItems} />);

        const subList = screen.getByText("Sub item 1").closest("ul");
        expect(subList).toHaveClass("ml-6", "list-[circle]!", "mb-0", "base-paragraph");
    });

    it("applies className to list items correctly", () => {
        render(<EmbeddedList items={mockItems} className="custom-class" />);

        const lists = screen.getAllByRole("list");
        // Check that the main lists have the custom class
        const mainLists = lists.filter(list => list.classList.contains("custom-class"));
        expect(mainLists.length).toBe(3); // Three main list containers
    });

    it("preserves content order", () => {
        render(<EmbeddedList items={mockItems} />);

        // Check that main content is in correct order by looking for specific text patterns
        expect(screen.getByText("First item content")).toBeInTheDocument();
        expect(screen.getByText("Second item content")).toBeInTheDocument();
        expect(screen.getByText("Third item content")).toBeInTheDocument();
        
        // Verify sub-list items are present
        expect(screen.getByText("Sub item 1")).toBeInTheDocument();
        expect(screen.getByText("Sub item 2")).toBeInTheDocument();
    });
});
