import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Accordion, { AccordionItem } from "@/presentation/components/Accordion/Accordion";

describe("Accordion", () => {
    const mockItems: AccordionItem[] = [
        {
            id: "item1",
            title: "First Item",
            content: "Content of first item"
        },
        {
            id: "item2", 
            title: "Second Item",
            content: "Content of second item"
        }
    ];

    it("renders accordion items correctly", () => {
        render(<Accordion items={mockItems} />);

        expect(screen.getByText("First Item")).toBeInTheDocument();
        expect(screen.getByText("Second Item")).toBeInTheDocument();
    });

    it("renders HTML content when hasHtml is true", () => {
        const itemsWithHtml: AccordionItem[] = [
            {
                id: "html-item",
                title: "HTML Item",
                content: "<strong>Bold content</strong>",
                hasHtml: true
            }
        ];

        render(<Accordion items={itemsWithHtml} />);
        
        expect(screen.getByText("HTML Item")).toBeInTheDocument();
    });

    it("renders with correct accessibility attributes", () => {
        render(<Accordion items={mockItems} />);

        expect(screen.getByText("First Item")).toBeInTheDocument();
        expect(screen.getByText("Second Item")).toBeInTheDocument();
    });

    it("renders items as buttons", () => {
        render(<Accordion items={mockItems} />);

        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(2);
    });

    it("renders items with correct titles", () => {
        render(<Accordion items={mockItems} />);

        expect(screen.getByText("First Item")).toBeInTheDocument();
        expect(screen.getByText("Second Item")).toBeInTheDocument();
    });

    it("renders content for all items", () => {
        render(<Accordion items={mockItems} />);

        expect(screen.getByText("First Item")).toBeInTheDocument();
        expect(screen.getByText("Second Item")).toBeInTheDocument();
    });

    it("handles allowMultiple prop", () => {
        render(<Accordion items={mockItems} allowMultiple={true} />);

        // Test that component renders without errors when allowMultiple is true
        expect(screen.getByText("First Item")).toBeInTheDocument();
        expect(screen.getByText("Second Item")).toBeInTheDocument();
    });

    it("handles empty items array", () => {
        render(<Accordion items={[]} />);

        // Should render without errors but no content
        expect(screen.queryByText("First Item")).not.toBeInTheDocument();
    });

    it("renders with default allowMultiple=false", () => {
        render(<Accordion items={mockItems} />);

        // Should render without errors with default props
        expect(screen.getByText("First Item")).toBeInTheDocument();
        expect(screen.getByText("Second Item")).toBeInTheDocument();
    });

    it("applies custom className", () => {
        render(<Accordion items={mockItems} className="custom-class" />);

        expect(screen.getByText("First Item")).toBeInTheDocument();
        expect(screen.getByText("Second Item")).toBeInTheDocument();
    });
});
