import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OrderStatus, ShippingAddress } from "@/domain/entity/Order/order";

const mockShippingAddress = {} as unknown as ShippingAddress;

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

vi.mock("@/presentation/pages/Orders/components/OrderCardItem/PendingOrderCardItem", () => ({
    default: () => <div data-testid="pending-order-card-item" />,
}));

vi.mock("@/presentation/pages/Orders/components/OrderCardItem", () => ({
    default: ({
        order,
        onSelectOrder,
    }: {
        order: { orderNumber: string };
        onSelectOrder: (order: { orderNumber: string }) => void;
    }) => (
        <div data-testid={`order-card-${order.orderNumber}`} onClick={() => onSelectOrder(order)}>
            Order: {order.orderNumber}
        </div>
    ),
}));

import Orders from "@/presentation/pages/Orders/Orders";

describe("Orders", () => {
    const mockOrders = {
        data: [
            {
                orderNumber: "111",
                orderStatus: OrderStatus.DELIVERED,
                estimatedDeliveredDate: new Date("2024-01-15"),
                orderCreatedAt: new Date("2024-01-10"),
                totalCoins: 50,
                totalPoints: 1000,
                shippingDetails: [],
                shippingAddress: mockShippingAddress,
            },
            {
                orderNumber: "222",
                orderStatus: OrderStatus.PENDING,
                estimatedDeliveredDate: new Date("2024-02-15"),
                orderCreatedAt: new Date("2024-02-10"),
                totalCoins: 100,
                totalPoints: 2000,
                shippingDetails: [],
                shippingAddress: mockShippingAddress,
            },
        ],
        pagination: {
            page: 1,
            pageSize: 10,
            total: 15,
            totalPages: 2,
        },
    };

    it("renders list of order cards", () => {
        const mockOnLoadMore = vi.fn();
        const mockOnSelectOrder = vi.fn();

        render(
            <Orders
                orders={mockOrders}
                isLoadingMore={false}
                onLoadMore={mockOnLoadMore}
                onSelectOrder={mockOnSelectOrder}
                isPendingOrder={false}
            />
        );

        expect(screen.getByTestId("order-card-111")).toBeInTheDocument();
        expect(screen.getByTestId("order-card-222")).toBeInTheDocument();
    });

    it("shows load more button when more pages exist", () => {
        const mockOnLoadMore = vi.fn();
        const mockOnSelectOrder = vi.fn();

        render(
            <Orders
                orders={mockOrders}
                isLoadingMore={false}
                onLoadMore={mockOnLoadMore}
                onSelectOrder={mockOnSelectOrder}
                isPendingOrder={false}
            />
        );

        expect(screen.getByRole("button", { name: /cargar más registros/i })).toBeInTheDocument();
    });

    it("hides load more button when on last page", () => {
        const lastPageOrders = {
            ...mockOrders,
            pagination: {
                page: 2,
                pageSize: 10,
                total: 15,
                totalPages: 2,
            },
        };

        const mockOnLoadMore = vi.fn();
        const mockOnSelectOrder = vi.fn();

        render(
            <Orders
                orders={lastPageOrders}
                isLoadingMore={false}
                onLoadMore={mockOnLoadMore}
                onSelectOrder={mockOnSelectOrder}
                isPendingOrder={false}
            />
        );

        expect(screen.queryByRole("button", { name: /cargar más registros/i })).not.toBeInTheDocument();
    });

    it("disables load more button when loading", () => {
        const mockOnLoadMore = vi.fn();
        const mockOnSelectOrder = vi.fn();

        render(
            <Orders
                orders={mockOrders}
                isLoadingMore={true}
                onLoadMore={mockOnLoadMore}
                onSelectOrder={mockOnSelectOrder}
                isPendingOrder={false}
            />
        );

        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute("aria-busy", "true");
    });

    it("changes button text when loading", () => {
        const mockOnLoadMore = vi.fn();
        const mockOnSelectOrder = vi.fn();

        const { rerender } = render(
            <Orders
                orders={mockOrders}
                isLoadingMore={false}
                onLoadMore={mockOnLoadMore}
                onSelectOrder={mockOnSelectOrder}
                isPendingOrder={false}
            />
        );

        expect(screen.getByText("Cargar más registros")).toBeInTheDocument();

        rerender(
            <Orders
                orders={mockOrders}
                isLoadingMore={true}
                onLoadMore={mockOnLoadMore}
                onSelectOrder={mockOnSelectOrder}
                isPendingOrder={false}
            />
        );

        expect(screen.getByText("Cargando registros...")).toBeInTheDocument();
    });

    it("calls onLoadMore when button is clicked", () => {
        const mockOnLoadMore = vi.fn();
        const mockOnSelectOrder = vi.fn();

        render(
            <Orders
                orders={mockOrders}
                isLoadingMore={false}
                onLoadMore={mockOnLoadMore}
                onSelectOrder={mockOnSelectOrder}
                isPendingOrder={false}
            />
        );

        const button = screen.getByRole("button", { name: /cargar más registros/i });
        fireEvent.click(button);

        expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
    });

    it("renders empty list when no orders", () => {
        const emptyOrders = {
            data: [],
            pagination: {
                page: 1,
                pageSize: 10,
                total: 0,
                totalPages: 0,
            },
        };

        const mockOnLoadMore = vi.fn();
        const mockOnSelectOrder = vi.fn();

        render(
            <Orders
                orders={emptyOrders}
                isLoadingMore={false}
                onLoadMore={mockOnLoadMore}
                onSelectOrder={mockOnSelectOrder}
                isPendingOrder={false}
            />
        );

        expect(screen.queryByTestId(/order-card-/)).not.toBeInTheDocument();
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("renders single order correctly", () => {
        const singleOrder = {
            data: [mockOrders.data[0]],
            pagination: {
                page: 1,
                pageSize: 10,
                total: 1,
                totalPages: 1,
            },
        };

        const mockOnLoadMore = vi.fn();
        const mockOnSelectOrder = vi.fn();

        render(
            <Orders
                orders={singleOrder}
                isLoadingMore={false}
                onLoadMore={mockOnLoadMore}
                onSelectOrder={mockOnSelectOrder}
                isPendingOrder={false}
            />
        );

        expect(screen.getByTestId("order-card-111")).toBeInTheDocument();
        expect(screen.queryByTestId("order-card-222")).not.toBeInTheDocument();
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("calls onSelectOrder when an order card is clicked", () => {
        const mockOnLoadMore = vi.fn();
        const mockOnSelectOrder = vi.fn();

        render(
            <Orders
                orders={mockOrders}
                isLoadingMore={false}
                onLoadMore={mockOnLoadMore}
                onSelectOrder={mockOnSelectOrder}
                isPendingOrder={false}
            />
        );

        fireEvent.click(screen.getByTestId("order-card-111"));

        expect(mockOnSelectOrder).toHaveBeenCalledTimes(1);
        expect(mockOnSelectOrder).toHaveBeenCalledWith(mockOrders.data[0]);
    });

    it("renders PendingOrderCardItem when isPendingOrder is true", () => {
        const mockOnLoadMore = vi.fn();
        const mockOnSelectOrder = vi.fn();

        render(
            <Orders
                orders={mockOrders}
                isLoadingMore={false}
                onLoadMore={mockOnLoadMore}
                onSelectOrder={mockOnSelectOrder}
                isPendingOrder={true}
            />
        );

        expect(screen.getByTestId("pending-order-card-item")).toBeInTheDocument();
    });

    it("does not render PendingOrderCardItem when isPendingOrder is false", () => {
        const mockOnLoadMore = vi.fn();
        const mockOnSelectOrder = vi.fn();

        render(
            <Orders
                orders={mockOrders}
                isLoadingMore={false}
                onLoadMore={mockOnLoadMore}
                onSelectOrder={mockOnSelectOrder}
                isPendingOrder={false}
            />
        );

        expect(screen.queryByTestId("pending-order-card-item")).not.toBeInTheDocument();
    });
});
