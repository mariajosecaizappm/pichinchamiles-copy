import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BreadcrumbForLayout from "@/presentation/components/Layout/BreadcrumbForLayout/BreadcrumbForLayout";

// Mock the Icon component
vi.mock("@/presentation/components/icons/Icon", () => ({
    default: ({ className, width, height, color, name }: any) => (
        <svg 
            data-testid={name}
            width={width} 
            height={height} 
            className={className}
            style={{ color }}
        />
    )
}));

describe("BreadcrumbForLayout", () => {
    const mockItems = [
        {
            id: "page1",
            label: "Page 1",
            href: "/page1"
        },
        {
            id: "page2",
            label: "Page 2",
            href: "/page2"
        },
        {
            id: "current",
            label: "Current Page",
            isCurrent: true
        }
    ];

    it("renders breadcrumb with home icon as first item", () => {
        render(<BreadcrumbForLayout items={mockItems} />);

        // Check that home icon is rendered
        expect(screen.getByTestId("icon-house")).toBeInTheDocument();
        
        // Check that other items are rendered
        expect(screen.getByText("Page 1")).toBeInTheDocument();
        expect(screen.getByText("Page 2")).toBeInTheDocument();
        expect(screen.getByText("Current Page")).toBeInTheDocument();
    });

    it("renders home link with default href", () => {
        render(<BreadcrumbForLayout items={mockItems} />);

        const homeLink = screen.getByRole("link", { name: /home/i });
        expect(homeLink).toHaveAttribute("href", "/");
    });

    it("renders home link with custom href", () => {
        render(<BreadcrumbForLayout items={mockItems} homeHref="/custom-home" />);

        const homeLink = screen.getByRole("link", { name: /home/i });
        expect(homeLink).toHaveAttribute("href", "/custom-home");
    });

    it("renders provided items correctly", () => {
        render(<BreadcrumbForLayout items={mockItems} />);

        const page1Link = screen.getByRole("link", { name: "Page 1" });
        const page2Link = screen.getByRole("link", { name: "Page 2" });
        
        expect(page1Link).toHaveAttribute("href", "/page1");
        expect(page2Link).toHaveAttribute("href", "/page2");
    });

    it("marks current item correctly", () => {
        render(<BreadcrumbForLayout items={mockItems} />);

        expect(screen.getByText("Current Page")).toBeInTheDocument();
    });

    it("renders with custom separator", () => {
        render(<BreadcrumbForLayout items={mockItems} separator=">" />);

        expect(screen.getByTestId("icon-house")).toBeInTheDocument();
        expect(screen.getByText("Page 1")).toBeInTheDocument();
    });

    it("handles empty items array", () => {
        render(<BreadcrumbForLayout items={[]} />);

        // Should still render home icon
        expect(screen.getByTestId("icon-house")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    });

    it("applies custom className", () => {
        render(<BreadcrumbForLayout items={mockItems} className="custom-breadcrumb" />);

        const breadcrumbElement = screen.getByRole("navigation");
        expect(breadcrumbElement).toHaveClass("custom-breadcrumb");
    });

    it("renders items without href as plain text", () => {
        const itemsWithoutHref = [
            {
                id: "page1",
                label: "Page 1"
            },
            {
                id: "current",
                label: "Current",
                isCurrent: true
            }
        ];

        render(<BreadcrumbForLayout items={itemsWithoutHref} />);

        expect(screen.getByText("Page 1")).toBeInTheDocument();
        expect(screen.getByText("Current")).toBeInTheDocument();
        
        // Should still have home link
        expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    });

    it("renders only home icon when no items provided", () => {
        render(<BreadcrumbForLayout items={[]} />);

        expect(screen.getByTestId("icon-house")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
        
        // Should not have other items
        expect(screen.queryByText("Page 1")).not.toBeInTheDocument();
    });

    it("renders correct number of total items (home + provided)", () => {
        render(<BreadcrumbForLayout items={mockItems} />);

        // Should have home link + 3 links from items (including current page) = 4 links total
        const links = screen.getAllByRole("link");
        expect(links).toHaveLength(4);
    });
});
