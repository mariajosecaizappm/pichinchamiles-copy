import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Order, OrderLine, OrderStatus, ShippingAddress, ShippingDetail, ShippingStatus } from "@/domain/entity/Order/order";
import OrderProductModal from "@/presentation/pages/Orders/components/OrderDetails/OrderProductModal/OrderProductModal";

vi.mock("@/presentation/components/Modal", () => ({
    default: ({ isOpen, children, headerButton }: { isOpen: boolean; children: React.ReactNode; headerButton: React.ReactNode }) => (
        isOpen ? (
            <div data-testid="modal">
                <div data-testid="modal-header">{headerButton}</div>
                <div data-testid="modal-body">{children}</div>
            </div>
        ) : null
    ),
}));

vi.mock("@/presentation/pages/Orders/components/OrderDetails/OrderProductDetailsCard", () => ({
    default: () => <div data-testid="order-product-details-card">OrderProductDetailsCard</div>,
}));

vi.mock("@/presentation/pages/Orders/components/OrderDetails/OrderTracking", () => ({
    default: () => <div data-testid="order-tracking">OrderTracking</div>,
}));

describe("OrderProductModal", () => {
    const createOrder = (): Order => ({
        orderNumber: "123456",
        orderStatus: OrderStatus.DELIVERED,
        estimatedDeliveredDate: new Date("2024-01-15"),
        orderCreatedAt: new Date("2024-01-10"),
        totalCoins: 50,
        totalPoints: 1000,
        shippingDetails: [],
        shippingAddress: {} as unknown as ShippingAddress,
    });

    const createShipping = (): ShippingDetail => ({
        guidNumber: "GUID-001",
        isOwnDelivery: true,
        shippingStatus: ShippingStatus.DELIVERED,
        orderLines: [],
        tracking: [],
    });

    const createProduct = (): OrderLine => ({
        image: { desktopUrl: "https://example.com/desktop.jpg", mobileUrl: "https://example.com/mobile.jpg" },
        productName: "Product A",
        quantity: 1,
        totalCoins: 50,
        totalPoints: 500,
    });

    it("renders modal when isOpen is true", () => {
        render(
            <OrderProductModal
                order={createOrder()}
                selectedShipping={createShipping()}
                product={createProduct()}
                isOpen={true}
                onClose={vi.fn()}
            />
        );

        expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("does not render modal when isOpen is false", () => {
        render(
            <OrderProductModal
                order={createOrder()}
                selectedShipping={createShipping()}
                product={createProduct()}
                isOpen={false}
                onClose={vi.fn()}
            />
        );

        expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("renders header with back button", () => {
        render(
            <OrderProductModal
                order={createOrder()}
                selectedShipping={createShipping()}
                product={createProduct()}
                isOpen={true}
                onClose={vi.fn()}
            />
        );

        expect(screen.getByTestId("backStepModal")).toBeInTheDocument();
        expect(screen.getByText("Detalle de pedido")).toBeInTheDocument();
    });

    it("calls onClose when back button is clicked", () => {
        const onClose = vi.fn();
        render(
            <OrderProductModal
                order={createOrder()}
                selectedShipping={createShipping()}
                product={createProduct()}
                isOpen={true}
                onClose={onClose}
            />
        );

        fireEvent.click(screen.getByTestId("backStepModal"));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("renders OrderProductDetailsCard", () => {
        render(
            <OrderProductModal
                order={createOrder()}
                selectedShipping={createShipping()}
                product={createProduct()}
                isOpen={true}
                onClose={vi.fn()}
            />
        );

        expect(screen.getByTestId("order-product-details-card")).toBeInTheDocument();
    });

    it("renders OrderTracking when selectedShipping is provided", () => {
        render(
            <OrderProductModal
                order={createOrder()}
                selectedShipping={createShipping()}
                product={createProduct()}
                isOpen={true}
                onClose={vi.fn()}
            />
        );

        expect(screen.getByTestId("order-tracking")).toBeInTheDocument();
    });

    it("does not render OrderTracking when selectedShipping is undefined", () => {
        render(
            <OrderProductModal
                order={createOrder()}
                selectedShipping={undefined}
                product={createProduct()}
                isOpen={true}
                onClose={vi.fn()}
            />
        );

        expect(screen.queryByTestId("order-tracking")).not.toBeInTheDocument();
    });
});
