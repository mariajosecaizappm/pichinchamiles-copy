import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Order, OrderStatus, ShippingAddress, ShippingDetail, ShippingStatus } from "@/domain/entity/Order/order";

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

vi.mock("@/presentation/pages/Orders/components/OrderCardItem/components/OrderStatusChip", () => ({
    default: ({ status }: { status: string }) => <div data-testid="status-chip">{status}</div>,
}));

import OrderCardItem from "@/presentation/pages/Orders/components/OrderCardItem/OrderCardItem";

const mockShippingAddress = {} as unknown as ShippingAddress;

const baseOrder: Order = {
    orderNumber: "123456",
    orderStatus: OrderStatus.DELIVERED,
    estimatedDeliveredDate: new Date("2024-01-15"),
    orderCreatedAt: new Date("2024-01-10T10:30:00"),
    totalCoins: 50,
    totalPoints: 1000,
    shippingDetails: [],
    shippingAddress: mockShippingAddress,
};

const createShippingDetail = (guidNumber: string, isOwnDelivery: boolean): ShippingDetail => ({
    guidNumber,
    shippingStatus: ShippingStatus.DELIVERED,
    isOwnDelivery,
    orderLines: [],
    tracking: [],
});

const renderOrderCardItem = (
    overrides?: Partial<Order>,
    onSelectOrder = vi.fn(),
    isPendingOrder?: boolean
) =>
    render(
        <OrderCardItem
            order={{ ...baseOrder, ...overrides }}
            onSelectOrder={onSelectOrder}
            isPendingOrder={isPendingOrder}
        />
    );

describe("OrderCardItem", () => {
    it("displays order date formatted correctly", () => {
        renderOrderCardItem();

        expect(screen.getByText(/10\/01\/2024/)).toBeInTheDocument();
    });

    it("shows StatusChip with correct status", () => {
        renderOrderCardItem();

        const statusChip = screen.getByTestId("status-chip");
        expect(statusChip).toHaveTextContent("delivered");
    });

    it("displays order number", () => {
        renderOrderCardItem();

        expect(screen.getByText("Pedido #123456")).toBeInTheDocument();
    });

    it("shows own delivery message with singular product", () => {
        renderOrderCardItem({
            shippingAddress: { isThirdPartyAddress: false } as unknown as ShippingAddress,
            shippingDetails: [createShippingDetail("GUID-1", true)],
        });

        expect(screen.getByText("Tú recibes 1 producto")).toBeInTheDocument();
    });

    it("shows own delivery message with plural products", () => {
        renderOrderCardItem({
            shippingAddress: { isThirdPartyAddress: false } as unknown as ShippingAddress,
            shippingDetails: [
                createShippingDetail("GUID-1", true),
                createShippingDetail("GUID-2", true),
            ],
        });

        expect(screen.getByText("Tú recibes 2 productos")).toBeInTheDocument();
    });

    it("shows third party delivery message with singular product", () => {
        renderOrderCardItem({
            shippingAddress: { isThirdPartyAddress: true } as unknown as ShippingAddress,
            shippingDetails: [createShippingDetail("GUID-1", false)],
        });

        expect(screen.getByText("Un tercero recibe 1 producto")).toBeInTheDocument();
    });

    it("shows third party delivery message with plural products", () => {
        renderOrderCardItem({
            shippingAddress: { isThirdPartyAddress: true } as unknown as ShippingAddress,
            shippingDetails: [
                createShippingDetail("GUID-1", false),
                createShippingDetail("GUID-2", false),
            ],
        });

        expect(screen.getByText("Un tercero recibe 2 productos")).toBeInTheDocument();
    });

    it("shows third party delivery message with count matching all shipments", () => {
        renderOrderCardItem({
            shippingAddress: { isThirdPartyAddress: true } as unknown as ShippingAddress,
            shippingDetails: [
                createShippingDetail("GUID-1", true),
                createShippingDetail("GUID-2", false),
                createShippingDetail("GUID-3", true),
            ],
        });

        expect(screen.getByText("Un tercero recibe 3 productos")).toBeInTheDocument();
    });

    it("shows delivery message with zero products when no shipping details", () => {
        renderOrderCardItem();

        expect(screen.getByText("Tú recibes 0 producto")).toBeInTheDocument();
    });

    it("renders truck icon", () => {
        const { container } = renderOrderCardItem();

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it("resolves status to novelty when any shipping has novelty status, regardless of order status", () => {
        const order = {
            ...baseOrder,
            orderStatus: "delivered" as any,
            shippingDetails: [
                {
                    guidNumber: "GUID-1",
                    shippingStatus: "delivered" as any,
                    isOwnDelivery: true,
                    orderLines: [],
                    tracking: [],
                },
                {
                    guidNumber: "GUID-2",
                    shippingStatus: "novelty" as any,
                    isOwnDelivery: false,
                    orderLines: [],
                    tracking: [],
                },
            ],
        };

        render(<OrderCardItem order={order} />);

        expect(screen.getByTestId("status-chip")).toHaveTextContent("novelty");
    });

    it("resolves status to delivered when order is delivered and all shippings are delivered", () => {
        const order = {
            ...baseOrder,
            orderStatus: "delivered" as any,
            shippingDetails: [
                {
                    guidNumber: "GUID-1",
                    shippingStatus: "delivered" as any,
                    isOwnDelivery: true,
                    orderLines: [],
                    tracking: [],
                },
            ],
        };

        render(<OrderCardItem order={order} />);

        expect(screen.getByTestId("status-chip")).toHaveTextContent("delivered");
    });

    it("resolves status to pending when order is delivered but not all shippings are delivered", () => {
        const order = {
            ...baseOrder,
            orderStatus: "delivered" as any,
            shippingDetails: [
                {
                    guidNumber: "GUID-1",
                    shippingStatus: "delivered" as any,
                    isOwnDelivery: true,
                    orderLines: [],
                    tracking: [],
                },
                {
                    guidNumber: "GUID-2",
                    shippingStatus: "waitingtosend" as any,
                    isOwnDelivery: false,
                    orderLines: [],
                    tracking: [],
                },
            ],
        };

        render(<OrderCardItem order={order} />);

        expect(screen.getByTestId("status-chip")).toHaveTextContent("pending");
    });

    it("resolves status to the original order status when not delivered and no novelty", () => {
        const order = {
            ...baseOrder,
            orderStatus: "paid" as any,
            shippingDetails: [
                {
                    guidNumber: "GUID-1",
                    shippingStatus: "waitingtosend" as any,
                    isOwnDelivery: true,
                    orderLines: [],
                    tracking: [],
                },
            ],
        };

        render(<OrderCardItem order={order} />);

        expect(screen.getByTestId("status-chip")).toHaveTextContent("paid");
    });

    it("renders as a button", () => {
        renderOrderCardItem();

        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("calls onSelectOrder when clicked", () => {
        const onSelectOrder = vi.fn();
        renderOrderCardItem(undefined, onSelectOrder);

        fireEvent.click(screen.getByRole("button"));

        expect(onSelectOrder).toHaveBeenCalledTimes(1);
        expect(onSelectOrder).toHaveBeenCalledWith(baseOrder);
    });

    it("does not call onSelectOrder when isPendingOrder is true", () => {
        const onSelectOrder = vi.fn();
        renderOrderCardItem(undefined, onSelectOrder, true);

        fireEvent.click(screen.getByRole("button"));

        expect(onSelectOrder).not.toHaveBeenCalled();
    });

    it("calls onSelectOrder when isPendingOrder is false", () => {
        const onSelectOrder = vi.fn();
        renderOrderCardItem(undefined, onSelectOrder, false);

        fireEvent.click(screen.getByRole("button"));

        expect(onSelectOrder).toHaveBeenCalledTimes(1);
    });
});
