import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Order, OrderLine, OrderStatus, ShippingAddress, ShippingDetail, ShippingStatus } from "@/domain/entity/Order/order";
import OrderProductDetailsCard from "@/presentation/pages/Orders/components/OrderDetails/OrderProductDetailsCard/OrderProductDetailsCard";

vi.mock("@/presentation/components/AssetImage", () => ({
    default: ({ asset, alt }: { asset: { desktopUrl: string; mobileUrl: string }; alt: string }) => (
        <div data-testid="asset-image" data-asset={JSON.stringify(asset)} data-alt={alt} />
    ),
}));

const mockUseIsDesktop = vi.fn(() => ({ isDesktop: true }));
vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: () => mockUseIsDesktop(),
}));

describe("OrderProductDetailsCard", () => {
    const mockShippingAddress: ShippingAddress = {
        customerReceivingFirstName: "John",
        customerReceivingLastName: "Doe",
        customerReceivingEmail: "john@example.com",
        customerReceivingPhone: "0999999999",
        customerReceivingIdentificationNumber: "123",
        customerReceivingIdentificationType: "CC",
        reference: "Near park",
        street1: "Main St",
        street2: "Oak Ave",
        number: "123",
        companyName: "",
        secondPhone: "",
        postalCode: "170101",
        country: "ECUADOR",
        state: "PICHINCHA",
        city: "QUITO",
        zone: "Centro",
        alias: "Home",
        sector: null,
        isThirdPartyAddress: false,
    };

    const createOrderLine = (overrides?: Partial<OrderLine>): OrderLine => ({
        image: { desktopUrl: "https://example.com/desktop.jpg", mobileUrl: "https://example.com/mobile.jpg" },
        productName: "Product A, Extra",
        quantity: 1,
        totalCoins: 50,
        totalPoints: 500,
        ...overrides,
    });

    const createOrder = (overrides?: Partial<Order>): Order => ({
        orderNumber: "123456",
        orderStatus: OrderStatus.DELIVERED,
        estimatedDeliveredDate: new Date(2024, 0, 15),
        orderCreatedAt: new Date("2024-01-10"),
        totalCoins: 50,
        totalPoints: 1000,
        shippingDetails: [],
        shippingAddress: mockShippingAddress,
        ...overrides,
    });

    const createShipping = (overrides?: Partial<ShippingDetail>): ShippingDetail => ({
        guidNumber: "GUID-001",
        isOwnDelivery: true,
        shippingStatus: ShippingStatus.DELIVERED,
        orderLines: [],
        tracking: [],
        ...overrides,
    });

    beforeEach(() => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: true });
    });

    it("renders product image when product has an image", () => {
        const product = createOrderLine();
        render(<OrderProductDetailsCard product={product} order={createOrder()} selectedShipping={createShipping()} />);

        const image = screen.getByTestId("asset-image");
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute("data-alt", "map");
    });

    it("does not render product image when product image is missing", () => {
        render(<OrderProductDetailsCard product={undefined} order={createOrder()} selectedShipping={createShipping()} />);

        expect(screen.queryByTestId("asset-image")).not.toBeInTheDocument();
    });

    it("renders estimated delivery date", () => {
        const product = createOrderLine();
        render(<OrderProductDetailsCard product={product} order={createOrder()} selectedShipping={createShipping()} />);

        expect(screen.getByText(/Fecha estimada de entrega: 15 de enero de 2024/)).toBeInTheDocument();
    });

    it("renders product name with comma removed", () => {
        const product = createOrderLine();
        render(<OrderProductDetailsCard product={product} order={createOrder()} selectedShipping={createShipping()} />);

        expect(screen.getByText("Product A Extra")).toBeInTheDocument();
    });

    it("renders guid number when selected shipping has one", () => {
        const product = createOrderLine();
        const shipping = createShipping({ guidNumber: "TRACK-123" });

        render(<OrderProductDetailsCard product={product} order={createOrder()} selectedShipping={shipping} />);

        expect(screen.getByText(/Número de guía: TRACK-123/)).toBeInTheDocument();
    });

    it("does not render guid number when missing", () => {
        const product = createOrderLine();
        const shipping = createShipping({ guidNumber: "" });

        render(<OrderProductDetailsCard product={product} order={createOrder()} selectedShipping={shipping} />);

        expect(screen.queryByText(/Número de guía/)).not.toBeInTheDocument();
    });

    it("renders copayment format when totalCoins is greater than zero", () => {
        const product = createOrderLine({ totalCoins: 100 });
        render(<OrderProductDetailsCard product={product} order={createOrder()} selectedShipping={createShipping()} />);

        expect(screen.getByText(/Copago:/)).toBeInTheDocument();
        expect(screen.getByText(/100 millas/)).toBeInTheDocument();
    });

    it("renders points-only format when totalCoins is zero", () => {
        const product = createOrderLine({ totalCoins: 0 });
        render(<OrderProductDetailsCard product={product} order={createOrder()} selectedShipping={createShipping()} />);

        expect(screen.getByText(/Canje con millas:/)).toBeInTheDocument();
    });

    it("renders shipping address with formatted city and country", () => {
        const product = createOrderLine();
        render(<OrderProductDetailsCard product={product} order={createOrder()} selectedShipping={createShipping()} />);

        expect(screen.getByText(/Dirección:/)).toBeInTheDocument();
        expect(screen.getByText(/Quito - Ecuador/)).toBeInTheDocument();
    });
});
