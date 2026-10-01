import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OrderStatus } from "@/domain/entity/Order/order";

vi.mock("@/presentation/pages/Orders/components/OrderCardItem/OrderCardItem.module.css", () => ({
    __esModule: true,
    default: {
        orderCard: "orderCard",
        orderCardHeader: "orderCardHeader",
        orderCardHeaderInfo: "orderCardHeaderInfo",
        orderCardHeaderIcon: "orderCardHeaderIcon",
        orderCardBody: "orderCardBody",
        orderCardBodyInfo: "orderCardBodyInfo",
    },
}));

vi.mock("@heroui/react", () => ({
    cn: (...classes: unknown[]) => classes.filter(Boolean).join(" "),
    Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className} />
    ),
}));

vi.mock("@/presentation/pages/Orders/components/OrderCardItem/components/OrderStatusChip", () => ({
    default: ({ status }: { status: string }) => <div data-testid="status-chip">{status}</div>,
}));

import PendingOrderCardItem from "@/presentation/pages/Orders/components/OrderCardItem/PendingOrderCardItem";

describe("PendingOrderCardItem", () => {
    it("renders the truck icon", () => {
        const { container } = render(<PendingOrderCardItem />);

        expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("shows StatusChip with pending status", () => {
        render(<PendingOrderCardItem />);

        expect(screen.getByTestId("status-chip")).toHaveTextContent(OrderStatus.PENDING);
    });

    it("displays the processing message", () => {
        render(<PendingOrderCardItem />);

        expect(screen.getByText("Tu pedido está siendo procesado")).toBeInTheDocument();
    });

    it("renders skeleton placeholders", () => {
        render(<PendingOrderCardItem />);

        expect(screen.getAllByTestId("skeleton")).toHaveLength(2);
    });

    it("applies the cursor-not-allowed style", () => {
        const { container } = render(<PendingOrderCardItem />);

        expect(container.firstChild).toHaveClass("orderCard", "cursor-not-allowed!");
    });
});
