import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Order, OrderLine, OrderStatus, ShippingAddress, ShippingDetail, ShippingStatus } from "@/domain/entity/Order/order";
import OrderProductsList from "@/presentation/pages/Orders/components/OrderDetails/OrderProductsList/OrderProductsList";
import { getShippingKey } from "@/presentation/pages/Orders/components/OrderDetails/OrderDetailsConfig";

vi.mock("@/presentation/pages/Orders/components/OrderDetails", () => ({
    OrderProductCard: ({
        shipping,
        selected,
        onSelectOrderProduct,
    }: {
        shipping: ShippingDetail;
        selected: boolean;
        onSelectOrderProduct: () => void;
    }) => (
        <button data-testid="order-product-card" data-shipping={shipping.guidNumber} data-selected={selected} onClick={onSelectOrderProduct}>
            {shipping.guidNumber}
        </button>
    ),
}));

describe("OrderProductsList", () => {
    const createOrderLine = (): OrderLine => ({
        image: { desktopUrl: "https://example.com/desktop.jpg", mobileUrl: "https://example.com/mobile.jpg" },
        productName: "Product A",
        quantity: 1,
        totalCoins: 50,
        totalPoints: 500,
    });

    const createShipping = (guidNumber: string): ShippingDetail => ({
        guidNumber,
        isOwnDelivery: true,
        shippingStatus: ShippingStatus.DELIVERED,
        orderLines: [createOrderLine()],
        tracking: [],
    });

    const createOrder = (shippingDetails: ShippingDetail[]): Order => ({
        orderNumber: "123456",
        orderStatus: OrderStatus.DELIVERED,
        estimatedDeliveredDate: new Date("2024-01-15"),
        orderCreatedAt: new Date("2024-01-10"),
        totalCoins: 50,
        totalPoints: 1000,
        shippingDetails,
        shippingAddress: {} as unknown as ShippingAddress,
    });

    it("returns null when no shipping details", () => {
        const { container } = render(
            <OrderProductsList order={createOrder([])} setSelectedShippingKey={vi.fn()} isSelected={() => false} />
        );

        expect(container.firstChild).toBeNull();
    });

    it("renders an OrderProductCard for each shipping detail", () => {
        render(
            <OrderProductsList
                order={createOrder([createShipping("GUID-1"), createShipping("GUID-2")])}
                setSelectedShippingKey={vi.fn()}
                isSelected={() => false}
            />
        );

        const cards = screen.getAllByTestId("order-product-card");
        expect(cards).toHaveLength(2);
        expect(cards[0]).toHaveAttribute("data-shipping", "GUID-1");
        expect(cards[1]).toHaveAttribute("data-shipping", "GUID-2");
    });

    it("passes selected prop based on isSelected", () => {
        const shippings = [createShipping("GUID-1"), createShipping("GUID-2")];
        render(
            <OrderProductsList
                order={createOrder(shippings)}
                setSelectedShippingKey={vi.fn()}
                isSelected={(key) => key === getShippingKey(shippings[0], 0)}
            />
        );

        const cards = screen.getAllByTestId("order-product-card");
        expect(cards[0]).toHaveAttribute("data-selected", "true");
        expect(cards[1]).toHaveAttribute("data-selected", "false");
    });

    it("calls setSelectedShippingKey when a card is clicked", () => {
        const setSelectedShippingKey = vi.fn();
        render(
            <OrderProductsList
                order={createOrder([createShipping("GUID-1")])}
                setSelectedShippingKey={setSelectedShippingKey}
                isSelected={() => false}
            />
        );

        fireEvent.click(screen.getByTestId("order-product-card"));
        expect(setSelectedShippingKey).toHaveBeenCalledTimes(1);
    });
});
