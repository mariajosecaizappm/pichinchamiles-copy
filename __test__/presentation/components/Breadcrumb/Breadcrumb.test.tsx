import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Breadcrumb, { BreadcrumbItemProps } from "@/presentation/components/Breadcrumb/Breadcrumb";

describe("Breadcrumb", () => {
    const mockItems: BreadcrumbItemProps[] = [
        {
            id: "home",
            label: "Home",
            href: "/"
        },
        {
            id: "products",
            label: "Products",
            href: "/products"
        },
        {
            id: "current",
            label: "Current Page",
            isCurrent: true
        }
    ];

    it("renders breadcrumb items correctly", () => {
        render(<Breadcrumb items={mockItems} />);

        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Products")).toBeInTheDocument();
        expect(screen.getByText("Current Page")).toBeInTheDocument();
    });

    it("renders links for items with href", () => {
        render(<Breadcrumb items={mockItems} />);

        const homeLink = screen.getByRole("link", { name: "Home" });
        const productsLink = screen.getByRole("link", { name: "Products" });
        
        expect(homeLink).toHaveAttribute("href", "/");
        expect(productsLink).toHaveAttribute("href", "/products");
    });

    it("marks current item correctly", () => {
        render(<Breadcrumb items={mockItems} />);

        const currentItem = screen.getByText("Current Page");
        expect(currentItem).toBeInTheDocument();
    });

    it("renders with custom separator", () => {
        render(<Breadcrumb items={mockItems} separator=">" />);

        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Products")).toBeInTheDocument();
    });

    it("handles empty items array", () => {
        render(<Breadcrumb items={[]} />);

        // Should render without errors
        expect(screen.queryByText("Home")).not.toBeInTheDocument();
    });

    it("renders items without href", () => {
        const itemsWithoutHref: BreadcrumbItemProps[] = [
            {
                id: "home",
                label: "Home"
            },
            {
                id: "current",
                label: "Current",
                isCurrent: true
            }
        ];

        render(<Breadcrumb items={itemsWithoutHref} />);

        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("Current")).toBeInTheDocument();
        
        expect(screen.getAllByRole("link")).toHaveLength(2);
    });

    it("applies custom className", () => {
        render(<Breadcrumb items={mockItems} className="custom-breadcrumb" />);

        const breadcrumbElement = screen.getByRole("navigation");
        expect(breadcrumbElement).toHaveClass("custom-breadcrumb");
    });

    it("renders single item", () => {
        const singleItem: BreadcrumbItemProps[] = [
            {
                id: "home",
                label: "Home",
                isCurrent: true
            }
        ];

        render(<Breadcrumb items={singleItem} />);

        expect(screen.getByText("Home")).toBeInTheDocument();
    });

});
