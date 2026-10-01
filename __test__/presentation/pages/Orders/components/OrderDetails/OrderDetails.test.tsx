import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";
import { Order, OrderLine, OrderStatus, ShippingAddress, ShippingDetail, ShippingStatus } from "@/domain/entity/Order/order";

vi.mock("@/presentation/pages/Orders/components/OrderDetails/OrderProductCard", () => ({
    default: ({ shipping, selected, onSelectOrderProduct }: { shipping: ShippingDetail; selected: boolean; onSelectOrderProduct?: () => void }) => (
        <div data-testid="order-product-card" data-shipping={shipping.guidNumber} data-selected={selected}>
            <button data-testid={`select-shipping-${shipping.guidNumber}`} onClick={() => onSelectOrderProduct?.()}>
                Select {shipping.guidNumber}
            </button>
        </div>
    ),
}));

vi.mock("@heroui/react", () => ({
    Divider: () => <hr data-testid="divider" />,
    cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
}));

vi.mock("@/presentation/pages/Orders/components/OrderDetails/OrderProductDetailsCard", () => ({
    default: () => <div data-testid="order-product-details-card" />,
}));

vi.mock("@/presentation/pages/Orders/components/OrderDetails/OrderTracking/OrderTracking", () => ({
    default: () => <div data-testid="order-tracking" />,
}));

vi.mock("@/presentation/components/Modal", () => ({
    default: ({ isOpen, children }: { isOpen: boolean; children: ReactNode }) => (
        isOpen ? <div data-testid="mock-modal">{children}</div> : null
    ),
}));

// Mock window.matchMedia for useIsDesktop hook (defaults to desktop viewport)
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

import OrderDetails from "@/presentation/pages/Orders/components/OrderDetails/OrderDetails";
import { getShippingKey } from "@/presentation/pages/Orders/components/OrderDetails/OrderDetailsConfig";

const createOrder = (shippingDetails: ShippingDetail[], totalCoins = 50, totalPoints = 1000, isThirdPartyAddress = false): Order => ({
    orderNumber: "123456",
    orderStatus: OrderStatus.DELIVERED,
    estimatedDeliveredDate: new Date("2024-01-15"),
    orderCreatedAt: new Date("2024-01-10T10:30:00"),
    totalCoins,
    totalPoints,
    shippingDetails,
    shippingAddress: { isThirdPartyAddress } as unknown as ShippingAddress,
});

const createShipping = (guidNumber: string, isOwnDelivery: boolean, orderLines: OrderLine[] = []): ShippingDetail => ({
    guidNumber,
    shippingStatus: ShippingStatus.DELIVERED,
    isOwnDelivery,
    orderLines,
    tracking: [],
});

const createOrderLine = (productName: string): OrderLine => ({
    image: { desktopUrl: "https://example.com/desktop.jpg", mobileUrl: "https://example.com/mobile.jpg" },
    productName,
    quantity: 1,
    totalCoins: 50,
    totalPoints: 500,
});

type RenderOverrides = {
    isDesktop?: boolean
    selectedShippingKey?: string
    setSelectedShippingKey?: (shippingKey: string | undefined) => void
    product?: OrderLine
    selectedShipping?: ShippingDetail
}

const renderOrderDetails = (order: Order, onPressBack = vi.fn(), overrides?: RenderOverrides) =>
    render(
        <OrderDetails
            order={order}
            onPressBack={onPressBack}
            isDesktop={overrides?.isDesktop ?? true}
            selectedShippingKey={overrides?.selectedShippingKey}
            setSelectedShippingKey={overrides?.setSelectedShippingKey ?? vi.fn()}
            product={overrides?.product}
            selectedShipping={overrides?.selectedShipping}
        />
    );

describe("OrderDetails", () => {
    it("renders back button and title", () => {
        renderOrderDetails(createOrder([]));

        expect(screen.getByText("Regresar")).toBeInTheDocument();
        expect(screen.getByText("Detalle del pedido")).toBeInTheDocument();
    });

    it("calls onPressBack when back button is clicked", () => {
        const onPressBack = vi.fn();
        renderOrderDetails(createOrder([]), onPressBack);

        fireEvent.click(screen.getByText("Regresar"));
        expect(onPressBack).toHaveBeenCalledTimes(1);
    });

    it("renders order number and created date", () => {
        renderOrderDetails(createOrder([]));

        expect(screen.getByText("Pedido: 123456")).toBeInTheDocument();
        expect(screen.getByText(/10 de enero de 2024/)).toBeInTheDocument();
    });

    it("renders total points and coins", () => {
        renderOrderDetails(createOrder([], 50, 1000));

        expect(
            screen.getByText((_, element) =>
                element?.tagName?.toLowerCase() === "p" &&
                element?.textContent?.trim() === "1.000 Millas + $50,00"
            )
        ).toBeInTheDocument();
    });

    it("hides coin amount when totalCoins is zero", () => {
        renderOrderDetails(createOrder([], 0, 1000));

        expect(screen.getByText("1.000 Millas")).toBeInTheDocument();
        expect(screen.queryByText(/\$0/)).not.toBeInTheDocument();
    });

    it("renders own delivery message with singular product", () => {
        const order = createOrder([createShipping("GUID-1", true, [createOrderLine("Product A")])], 50, 1000, false);
        renderOrderDetails(order);

        expect(screen.getByText("Tú recibes 1 producto")).toBeInTheDocument();
    });

    it("renders own delivery message with plural products", () => {
        const order = createOrder([
            createShipping("GUID-1", true, [createOrderLine("Product A")]),
            createShipping("GUID-2", true, [createOrderLine("Product B")]),
        ], 50, 1000, false);
        renderOrderDetails(order);

        expect(screen.getByText("Tú recibes 2 productos")).toBeInTheDocument();
    });

    it("renders third party delivery message with singular product", () => {
        const order = createOrder([createShipping("GUID-1", false, [createOrderLine("Product A")])], 50, 1000, true);
        renderOrderDetails(order);

        expect(screen.getByText("Un tercero recibe 1 producto")).toBeInTheDocument();
    });

    it("renders third party delivery message with plural products", () => {
        const order = createOrder([
            createShipping("GUID-1", false, [createOrderLine("Product A")]),
            createShipping("GUID-2", false, [createOrderLine("Product B")]),
        ], 50, 1000, true);
        renderOrderDetails(order);

        expect(screen.getByText("Un tercero recibe 2 productos")).toBeInTheDocument();
    });

    it("renders delivery message with zero products when there are no shipping details", () => {
        renderOrderDetails(createOrder([]));

        expect(screen.getByText("Tú recibes 0 producto")).toBeInTheDocument();
    });

    it("renders an OrderProductCard for each shipping detail", () => {
        const order = createOrder([
            createShipping("GUID-1", true, [createOrderLine("Product A")]),
            createShipping("GUID-2", false, [createOrderLine("Product B")]),
        ]);
        renderOrderDetails(order);

        const cards = screen.getAllByTestId("order-product-card");
        expect(cards).toHaveLength(2);
        expect(cards[0]).toHaveAttribute("data-shipping", "GUID-1");
        expect(cards[1]).toHaveAttribute("data-shipping", "GUID-2");
    });

    it("renders dividers between product cards except after the last one", () => {
        const order = createOrder([
            createShipping("GUID-1", true, [createOrderLine("Product A")]),
            createShipping("GUID-2", false, [createOrderLine("Product B")]),
            createShipping("GUID-3", true, [createOrderLine("Product C")]),
        ]);
        renderOrderDetails(order);

        expect(screen.getAllByTestId("divider")).toHaveLength(2);
    });

    it("marks the shipping detail matching selectedShippingKey as selected", () => {
        const shippingA = createShipping("GUID-1", true, [createOrderLine("Product A")]);
        const shippingB = createShipping("GUID-2", false, [createOrderLine("Product B")]);
        const order = createOrder([shippingA, shippingB]);
        renderOrderDetails(order, vi.fn(), { selectedShippingKey: getShippingKey(shippingA, 0) });

        const cards = screen.getAllByTestId("order-product-card");
        expect(cards[0]).toHaveAttribute("data-selected", "true");
        expect(cards[1]).toHaveAttribute("data-selected", "false");
    });

    it("calls setSelectedShippingKey with the clicked shipping key", () => {
        const shippingA = createShipping("GUID-1", true, [createOrderLine("Product A")]);
        const shippingB = createShipping("GUID-2", false, [createOrderLine("Product B")]);
        const order = createOrder([shippingA, shippingB]);
        const setSelectedShippingKey = vi.fn();
        renderOrderDetails(order, vi.fn(), { setSelectedShippingKey });

        fireEvent.click(screen.getByTestId("select-shipping-GUID-2"));

        expect(setSelectedShippingKey).toHaveBeenCalledTimes(1);
        expect(setSelectedShippingKey).toHaveBeenCalledWith(getShippingKey(shippingB, 1));
    });
});
