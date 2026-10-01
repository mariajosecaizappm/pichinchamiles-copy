import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/presentation/pages/Orders/components/OrdersSearchBar", () => ({
    default: ({
        value,
        onSearch,
        onClear,
        isClearing,
    }: {
        value: string;
        onSearch: (value: string) => void;
        onClear: () => void;
        isClearing?: boolean;
    }) => (
        <div>
            <input
                data-testid="search-bar"
                value={value}
                onChange={(e) => onSearch(e.target.value)}
                data-clearing={isClearing}
            />
            <button type="button" data-testid="clear-search" onClick={onClear}>
                Clear
            </button>
        </div>
    ),
}));

vi.mock("@/presentation/pages/Home/UseYourMiles/Layout/components/StickyNavWrapper", () => ({
    default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-testid="sticky-nav-wrapper" className={className}>
            {children}
        </div>
    ),
}));

vi.mock("@/presentation/components/Accordion", () => ({
    default: ({
        items,
    }: {
        items: Array<{ id: string; title: React.ReactNode; content: React.ReactNode }>;
    }) => (
        <div data-testid="orders-info-accordion">
            {items.map((item) => (
                <div key={item.id}>
                    <div data-testid="accordion-title">{item.title}</div>
                    <div data-testid="accordion-content">{item.content}</div>
                </div>
            ))}
        </div>
    ),
}));

vi.mock("@/presentation/pages/Orders/components/OrdersInfo/OrdersInfoHeader", () => ({
    default: () => <div data-testid="orders-info-header">Información sobre tus pedidos</div>,
}));

vi.mock("@/presentation/pages/Orders/components/OrdersInfo", () => ({
    default: () => <div data-testid="orders-info-list">Orders info list</div>,
}));

import OrdersLayout from "@/presentation/pages/Orders/components/Layout/OrdersLayout";

const renderLayout = (props?: Partial<React.ComponentProps<typeof OrdersLayout>>) => {
    const mockOnSearch = vi.fn();
    const mockOnClearSearch = vi.fn();

    const result = render(
        <OrdersLayout
            orderNumber=""
            onSearch={mockOnSearch}
            onClearSearch={mockOnClearSearch}
            {...props}
        >
            {props?.children ?? <div>Content</div>}
        </OrdersLayout>
    );

    return { ...result, mockOnSearch, mockOnClearSearch };
};

describe("OrdersLayout", () => {
    it("renders search bar with correct props", () => {
        const { mockOnSearch } = renderLayout({ orderNumber: "123456" });

        const searchBar = screen.getByTestId("search-bar");
        expect(searchBar).toHaveValue("123456");

        fireEvent.change(searchBar, { target: { value: "789" } });
        expect(mockOnSearch).toHaveBeenCalledWith("789");
    });

    it("passes onClearSearch to OrdersSearchBar", () => {
        const { mockOnClearSearch } = renderLayout();

        fireEvent.click(screen.getByTestId("clear-search"));
        expect(mockOnClearSearch).toHaveBeenCalledTimes(1);
    });

    it("displays header title", () => {
        renderLayout();

        expect(screen.getByText("Mis pedidos")).toBeInTheDocument();
        expect(
            screen.getByText("Cada pedido puede incluir uno o más productos canjeados con tus millas.")
        ).toBeInTheDocument();
    });

    it("renders children", () => {
        renderLayout({
            children: <div data-testid="child-content">Child Content</div>,
        });

        expect(screen.getByTestId("child-content")).toBeInTheDocument();
        expect(screen.getByText("Child Content")).toBeInTheDocument();
    });

    it("wraps search and mobile info in StickyNavWrapper", () => {
        renderLayout();

        const stickyNav = screen.getByTestId("sticky-nav-wrapper");
        expect(stickyNav).toContainElement(screen.getByTestId("search-bar"));
        expect(stickyNav).toContainElement(screen.getByTestId("orders-info-accordion"));
    });

    it("applies correct sticky positioning classes to StickyNavWrapper", () => {
        renderLayout();

        const stickyNav = screen.getByTestId("sticky-nav-wrapper");
        expect(stickyNav).toHaveClass("sticky");
        expect(stickyNav).toHaveClass("top-[90px]");
        expect(stickyNav).toHaveClass("md:top-[73px]");
        expect(stickyNav).toHaveClass("z-40");
        expect(stickyNav).toHaveClass("bg-white");
    });

    it("renders mobile accordion with orders info", () => {
        renderLayout();

        expect(screen.getByTestId("orders-info-accordion")).toBeInTheDocument();
        expect(screen.getByTestId("accordion-title")).toContainElement(
            screen.getAllByTestId("orders-info-header")[0]
        );
        expect(screen.getByTestId("accordion-content")).toContainElement(
            screen.getAllByTestId("orders-info-list")[0]
        );
    });

    it("renders desktop orders info sidebar", () => {
        renderLayout();

        expect(screen.getAllByTestId("orders-info-header")).toHaveLength(2);
        expect(screen.getAllByTestId("orders-info-list")).toHaveLength(2);
    });

    it("passes onSearch callback correctly", () => {
        const { mockOnSearch } = renderLayout();

        fireEvent.change(screen.getByTestId("search-bar"), { target: { value: "test" } });

        expect(mockOnSearch).toHaveBeenCalledWith("test");
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });

    it("passes isClearingSearch to OrdersSearchBar", () => {
        renderLayout({ isClearingSearch: true });

        expect(screen.getByTestId("search-bar")).toHaveAttribute("data-clearing", "true");
    });

    it("passes isClearingSearch as false by default", () => {
        renderLayout();

        expect(screen.getByTestId("search-bar")).toHaveAttribute("data-clearing", "false");
    });

    it("keeps header title static on rerender", () => {
        const mockOnSearch = vi.fn();
        const mockOnClearSearch = vi.fn();

        const { rerender } = render(
            <OrdersLayout
                orderNumber=""
                onSearch={mockOnSearch}
                onClearSearch={mockOnClearSearch}
            >
                <div>Content</div>
            </OrdersLayout>
        );

        expect(screen.getByText("Mis pedidos")).toBeInTheDocument();

        rerender(
            <OrdersLayout
                orderNumber=""
                onSearch={mockOnSearch}
                onClearSearch={mockOnClearSearch}
            >
                <div>Updated Content</div>
            </OrdersLayout>
        );

        expect(screen.getByText("Mis pedidos")).toBeInTheDocument();
        expect(screen.getByText("Updated Content")).toBeInTheDocument();
    });
});
