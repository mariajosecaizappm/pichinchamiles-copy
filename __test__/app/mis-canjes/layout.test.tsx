import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/presentation/pages/Orders/OrdersWrapper", () => ({
    default: ({ children }: any) => (
        <div data-testid="orders-wrapper">{children}</div>
    ),
}));

import OrdersLayout from "@/app/mis-pedidos/layout";

describe("mis-pedidos/layout", () => {
    it("wraps children in OrdersWrapper", () => {
        render(
            <OrdersLayout>
                <div data-testid="child-content">Test Content</div>
            </OrdersLayout>
        );

        expect(screen.getByTestId("orders-wrapper")).toBeInTheDocument();
        expect(screen.getByTestId("child-content")).toBeInTheDocument();
    });

    it("renders children prop correctly", () => {
        render(
            <OrdersLayout>
                <div>Child 1</div>
                <div>Child 2</div>
            </OrdersLayout>
        );

        expect(screen.getByText("Child 1")).toBeInTheDocument();
        expect(screen.getByText("Child 2")).toBeInTheDocument();
    });

    it("passes children through wrapper", () => {
        const { container } = render(
            <OrdersLayout>
                <span data-testid="test-span">Test</span>
            </OrdersLayout>
        );

        const wrapper = container.querySelector('[data-testid="orders-wrapper"]');
        const child = container.querySelector('[data-testid="test-span"]');
        
        expect(wrapper).toContainElement(child);
    });
});
