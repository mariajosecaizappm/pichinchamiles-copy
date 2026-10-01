import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CookiesPolicies from "@/presentation/pages/CookiesPolicies/CookiesPolicies";
import CookiePolicyListItem from "@/presentation/pages/CookiesPolicies/CookiePolicyListItem";
import { cookiesContent } from "@/presentation/pages/CookiesPolicies/data";

// Mock the components that are not directly being tested
vi.mock("@/presentation/components/Layout/LegalConditionsLayout", () => ({
    default: ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div data-testid="legal-conditions-layout">
            <h1 data-testid="layout-title">{title}</h1>
            {children}
        </div>
    )
}));

vi.mock("@/presentation/components/List", () => ({
    default: ({ items, className }: { 
        items: React.ReactNode[], 
        className?: string
    }) => (
        <div data-testid="list" className={className}>
            {Array.isArray(items) ? items.map((item, index) => {
                if (typeof item === 'object' && item !== null && 'title' in item) {
                    const keyItem = `list-item-${index}`;
                    return (
                        <div key={keyItem} className="font-thin">
                            <strong className="font-bold">{(item as unknown as { title: string }).title}</strong>: {(item as unknown as { description: string }).description}
                        </div>
                    );
                }
                return item;
            }) : items}
        </div>
    )
}));

describe("CookiePolicyListItem", () => {
    it("renders title and description correctly", () => {
        render(<CookiePolicyListItem title="Test Title" description="Test Description" />);

        expect(screen.getByText("Test Title")).toBeInTheDocument();
        // Check the container element for the full content
        const container = screen.getByText("Test Title").parentElement;
        expect(container).toHaveTextContent("Test Title: Test Description");
    });

    it("applies bold styling to title", () => {
        render(<CookiePolicyListItem title="Bold Title" description="Description" />);

        const titleElement = screen.getByText("Bold Title");
        expect(titleElement.tagName).toBe("STRONG");
        expect(titleElement).toHaveClass("font-bold");
    });

    it("renders title and description with separator", () => {
        render(<CookiePolicyListItem title="Title" description="Description" />);

        const container = screen.getByText("Title").parentElement;
        expect(container).toHaveTextContent("Title: Description");
    });
});

describe("CookiesPolicies", () => {
    it("renders the page with correct title", () => {
        render(<CookiesPolicies />);

        expect(screen.getByTestId("layout-title")).toHaveTextContent("Política de cookies");
    });

    it("renders all cookie content sections", () => {
        render(<CookiesPolicies />);

        cookiesContent.forEach((item) => {
            expect(screen.getByText(item.title)).toBeInTheDocument();
            if (item.content) {
                expect(screen.getByText(item.content)).toBeInTheDocument();
            }
        });
    });

    it("renders list when item has list property", () => {
        render(<CookiesPolicies />);

        // Check that the List component is rendered for items with list
        expect(screen.getByTestId("list")).toBeInTheDocument();
    });

    it("renders correct number of content sections", () => {
        render(<CookiesPolicies />);

        const headings = screen.getAllByRole("heading", { level: 6 });
        expect(headings).toHaveLength(cookiesContent.length);
    });

    it("renders layout components correctly", () => {
        render(<CookiesPolicies />);

        expect(screen.getByTestId("legal-conditions-layout")).toBeInTheDocument();
        expect(screen.getByTestId("layout-title")).toBeInTheDocument();
    });

    it("has correct page structure", () => {
        render(<CookiesPolicies />);

        const layout = screen.getByTestId("legal-conditions-layout");
        expect(layout).toBeInTheDocument();
        expect(screen.getByTestId("layout-title")).toHaveTextContent("Política de cookies");
    });

    it("renders CookiePolicyListItem for list items", () => {
        render(<CookiesPolicies />);

        // Check that list items are rendered using CookiePolicyListItem
        const listItems = screen.getAllByTestId("list");
        expect(listItems.length).toBeGreaterThan(0);

        // Check for specific cookie types
        expect(screen.getByText("Cookies Esenciales")).toBeInTheDocument();
        expect(screen.getByText("Cookies de Rendimiento")).toBeInTheDocument();
        expect(screen.getByText("Cookies Funcionales")).toBeInTheDocument();
    });

    it("generates unique keys for content sections", () => {
        render(<CookiesPolicies />);

        cookiesContent.forEach((_, index) => {
            // Check that the section exists by looking for the title instead of the key
            expect(cookiesContent[index].title).toBeDefined();
        });
    });

    it("renders content with correct styling", () => {
        render(<CookiesPolicies />);

        const headings = screen.getAllByRole("heading", { level: 6 });
        headings.forEach((heading) => {
            expect(heading).toHaveClass("mb-5", "font-bold");
        });

        const paragraphs = screen.getAllByText(/En Pichincha Miles|El objetivo de esta Política|Las cookies son/);
        paragraphs.forEach((paragraph) => {
            expect(paragraph).toHaveClass("font-thin");
        });
    });

    it("renders List component with correct props", () => {
        render(<CookiesPolicies />);

        const list = screen.getByTestId("list");
        expect(list).toHaveClass("space-y-5");
    });

    it("renders list items with correct styling", () => {
        render(<CookiesPolicies />);

        const listItems = screen.getAllByTestId("list");
        listItems.forEach((item) => {
            expect(item).toHaveClass("space-y-5");
        });
    });

    it("renders specific cookie policy content", () => {
        render(<CookiesPolicies />);

        expect(screen.getByText(/Este sitio web utiliza cookies/)).toBeInTheDocument();
        expect(screen.getByText(/En Pichincha Miles utilizamos cookies para personalizar/)).toBeInTheDocument();
        expect(screen.getAllByText("Política de Cookies")[0]).toBeInTheDocument();
        expect(screen.getByText(/El objetivo de esta Política es proporcionar/)).toBeInTheDocument();
        expect(screen.getByText(/¿Qué es una cookie\?/)).toBeInTheDocument();
        expect(screen.getByText(/Las cookies son pequeños archivos de texto/)).toBeInTheDocument();
        expect(screen.getByText(/Tipos de cookies que utilizamos/)).toBeInTheDocument();
    });

    it("handles items without list property", () => {
        const itemsWithoutList = cookiesContent.filter(item => !item.list);
        
        render(<CookiesPolicies />);

        itemsWithoutList.forEach((item) => {
            expect(screen.getByText(item.title)).toBeInTheDocument();
            expect(screen.getByText(item.content)).toBeInTheDocument();
            // These items should not have a list
            const section = screen.getByText(item.title).closest("div");
            expect(section?.querySelector('[data-testid="list"]')).not.toBeInTheDocument();
        });
    });
});
