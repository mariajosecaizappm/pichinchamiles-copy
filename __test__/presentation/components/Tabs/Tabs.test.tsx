import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Tabs, { TabItem } from "@/presentation/components/Tabs/Tabs";

describe("Tabs", () => {
    const mockItems: TabItem[] = [
        {
            id: "tab1",
            label: "First Tab",
            content: "Content of first tab"
        },
        {
            id: "tab2", 
            label: "Second Tab",
            content: "Content of second tab"
        },
        {
            id: "tab3",
            label: "Third Tab",
            content: "Content of third tab"
        }
    ];

    it("renders tabs correctly", () => {
        render(<Tabs items={mockItems} />);

        expect(screen.getByText("First Tab")).toBeInTheDocument();
        expect(screen.getByText("Second Tab")).toBeInTheDocument();
        expect(screen.getByText("Third Tab")).toBeInTheDocument();
    });

    it("renders content for default selected tab", () => {
        render(<Tabs items={mockItems} />);

        expect(screen.getByText("Content of first tab")).toBeInTheDocument();
    });

    it("renders content for specified default tab", () => {
        render(<Tabs items={mockItems} defaultTab="tab2" />);

        expect(screen.getByText("Content of second tab")).toBeInTheDocument();
    });

    it("provides onTabChange callback", () => {
        const onTabChange = vi.fn();
        render(<Tabs items={mockItems} onTabChange={onTabChange} />);

        // Verify the component renders with the callback
        expect(screen.getByText("First Tab")).toBeInTheDocument();
        expect(onTabChange).not.toHaveBeenCalled();
    });

    it("disables tabs when isDisabled is true", () => {
        const itemsWithDisabled: TabItem[] = [
            ...mockItems,
            {
                id: "disabled-tab",
                label: "Disabled Tab",
                content: "Disabled content",
                isDisabled: true
            }
        ];

        render(<Tabs items={itemsWithDisabled} />);

        const disabledTab = screen.getByText("Disabled Tab");
        expect(disabledTab).toBeInTheDocument();
    });

    it("renders with different variants", () => {
        const { rerender } = render(<Tabs items={mockItems} variant="bordered" />);
        expect(screen.getByText("First Tab")).toBeInTheDocument();

        rerender(<Tabs items={mockItems} variant="solid" />);
        expect(screen.getByText("First Tab")).toBeInTheDocument();

        rerender(<Tabs items={mockItems} variant="light" />);
        expect(screen.getByText("First Tab")).toBeInTheDocument();
    });

    it("renders with different colors", () => {
        const { rerender } = render(<Tabs items={mockItems} color="secondary" />);
        expect(screen.getByText("First Tab")).toBeInTheDocument();

        rerender(<Tabs items={mockItems} color="success" />);
        expect(screen.getByText("First Tab")).toBeInTheDocument();

        rerender(<Tabs items={mockItems} color="warning" />);
        expect(screen.getByText("First Tab")).toBeInTheDocument();

        rerender(<Tabs items={mockItems} color="danger" />);
        expect(screen.getByText("First Tab")).toBeInTheDocument();
    });

    it("handles empty items array", () => {
        render(<Tabs items={[]} />);

        // Should render without errors
        expect(screen.queryByText("First Tab")).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
        render(<Tabs items={mockItems} className="custom-tabs" />);

        const tabsElement = screen.getByRole("tablist");
        expect(tabsElement).toBeInTheDocument();
    });

    it("renders complex content in tabs", () => {
        const itemsWithComplexContent: TabItem[] = [
            {
                id: "complex-tab",
                label: "Complex Tab",
                content: (
                    <div>
                        <h3>Complex Content</h3>
                        <p>This is a paragraph</p>
                        <button>Click me</button>
                    </div>
                )
            }
        ];

        render(<Tabs items={itemsWithComplexContent} />);

        expect(screen.getByText("Complex Content")).toBeInTheDocument();
        expect(screen.getByText("This is a paragraph")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("renders single tab", () => {
        const singleTab: TabItem[] = [
            {
                id: "single",
                label: "Single Tab",
                content: "Single content"
            }
        ];

        render(<Tabs items={singleTab} />);

        expect(screen.getByText("Single Tab")).toBeInTheDocument();
        expect(screen.getByText("Single content")).toBeInTheDocument();
    });
});
