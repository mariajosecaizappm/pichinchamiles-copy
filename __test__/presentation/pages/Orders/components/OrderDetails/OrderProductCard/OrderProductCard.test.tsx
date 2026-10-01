import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Order, OrderLine, OrderStatus, ShippingAddress, ShippingDetail, ShippingStatus } from "@/domain/entity/Order/order";

vi.mock("@/presentation/components/AssetImage", () => ({
    default: ({ asset, alt, className }: { asset: { desktopUrl: string; mobileUrl: string }; alt: string; className: string }) => (
        <div data-testid="asset-image" className={className} aria-label={alt}>
            {JSON.stringify(asset)}
        </div>
    ),
}));

vi.mock("@/presentation/pages/Orders/components/OrderDetails/OrderProductCard/ShippingStatusChip", () => ({
    default: ({ status }: { status: ShippingStatus }) => <div data-testid="shipping-status-chip">{status}</div>,
}));

import OrderProductCard from "@/presentation/pages/Orders/components/OrderDetails/OrderProductCard/OrderProductCard";

const baseOrderLine: OrderLine = {
    image: { desktopUrl: "https://example.com/desktop.jpg", mobileUrl: "https://example.com/mobile.jpg" },
    productName: "Product A",
    quantity: 1,
    totalCoins: 50,
    totalPoints: 1000,
};

const baseShipping: ShippingDetail = {
    guidNumber: "GUID-001",
    shippingStatus: ShippingStatus.DELIVERED,
    isOwnDelivery: true,
    orderLines: [baseOrderLine],
    tracking: [],
};

const baseOrder: Order = {
    orderNumber: "123456",
    orderStatus: OrderStatus.DELIVERED,
    estimatedDeliveredDate: new Date("2024-01-15"),
    orderCreatedAt: new Date("2024-01-10"),
    totalCoins: 50,
    totalPoints: 1000,
    shippingDetails: [baseShipping],
    shippingAddress: {} as unknown as ShippingAddress,
};

const renderSubject = (overrides?: { shipping?: Partial<ShippingDetail>; order?: Partial<Order>; orderProduct?: Partial<OrderLine>; selected?: boolean }) => {
    const order = { ...baseOrder, ...overrides?.order };
    const orderProduct = { ...baseOrderLine, ...overrides?.orderProduct };
    const shipping = { ...baseShipping, ...overrides?.shipping, orderLines: [orderProduct] };
    return {
        onSelectOrderProduct: vi.fn(),
        shipping,
        order,
        orderProduct,
        ...render(
            <OrderProductCard
                order={order}
                shipping={shipping}
                orderProduct={orderProduct}
                selected={overrides?.selected ?? false}
                onSelectOrderProduct={vi.fn()}
            />
        ),
    };
};

describe("OrderProductCard", () => {
    it("renders product name and asset image", () => {
        renderSubject();

        expect(screen.getByText("Product A")).toBeInTheDocument();
        const assetImage = screen.getByTestId("asset-image");
        expect(assetImage).toBeInTheDocument();
        expect(assetImage).toHaveAttribute("aria-label", "Product A");
    });

    it("renders shipping status chip", () => {
        renderSubject();

        const chips = screen.getAllByTestId("shipping-status-chip");
        expect(chips.length).toBeGreaterThan(0);
        chips.forEach(chip => expect(chip).toHaveTextContent("delivered"));
    });

    it("renders total points and coins", () => {
        renderSubject();

        const totalElements = screen.getAllByText((_, element) =>
            element?.tagName?.toLowerCase() === "p" &&
            element?.textContent?.trim() === "1.000 Millas + $50,00"
        );
        expect(totalElements).toHaveLength(2);
    });

    it("hides coin amount when totalCoins is zero", () => {
        renderSubject({ order: { totalCoins: 0, totalPoints: 1000 }, orderProduct: { totalCoins: 0 } });

        const totalElements = screen.getAllByText("1.000 Millas");
        expect(totalElements).toHaveLength(2);
        expect(screen.queryByText(/\$0/)).not.toBeInTheDocument();
    });

    it("renders estimated delivery date", () => {
        renderSubject();

        const formattedDate = baseOrder.estimatedDeliveredDate?.toLocaleDateString('es', { day: '2-digit', month: '2-digit', year: 'numeric' });
        expect(screen.getByText(new RegExp(formattedDate!.replace(/\//g, '\\/')))).toBeInTheDocument();
    });

    it("calls onSelectOrderProduct when clicked", () => {
        const onSelectOrderProduct = vi.fn();
        render(
            <OrderProductCard
                order={baseOrder}
                shipping={baseShipping}
                orderProduct={baseOrderLine}
                onSelectOrderProduct={onSelectOrderProduct}
            />
        );

        fireEvent.click(screen.getByRole("button"));
        expect(onSelectOrderProduct).toHaveBeenCalledTimes(1);
    });

    it("applies selected state", () => {
        renderSubject({ selected: true });

        expect(screen.getByRole("button")).toHaveAttribute("data-selected", "true");
    });

    it("does not apply selected state by default", () => {
        renderSubject();

        expect(screen.getByRole("button")).toHaveAttribute("data-selected", "false");
    });

    it("renders chevron icon", () => {
        const { container } = renderSubject();

        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
    });
});
