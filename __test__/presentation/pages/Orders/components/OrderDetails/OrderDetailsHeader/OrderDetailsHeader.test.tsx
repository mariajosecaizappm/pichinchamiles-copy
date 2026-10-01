import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Order, OrderStatus, ShippingAddress, ShippingDetail, ShippingStatus } from "@/domain/entity/Order/order";
import OrderDetailsHeader from "@/presentation/pages/Orders/components/OrderDetails/OrderDetailsHeader/OrderDetailsHeader";

describe("OrderDetailsHeader", () => {
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
        country: "Ecuador",
        state: "Pichincha",
        city: "Quito",
        zone: "Centro",
        alias: "Home",
        sector: null,
        isThirdPartyAddress: false,
    };

    const createOrder = (overrides?: Partial<Order>): Order => ({
        orderNumber: "123456",
        orderStatus: OrderStatus.DELIVERED,
        estimatedDeliveredDate: new Date("2024-01-15"),
        orderCreatedAt: new Date("2024-01-10T10:30:00"),
        totalCoins: 50,
        totalPoints: 1000,
        shippingDetails: [],
        shippingAddress: mockShippingAddress,
        ...overrides,
    });

    const createShipping = (guidNumber: string): ShippingDetail => ({
        guidNumber,
        isOwnDelivery: true,
        shippingStatus: ShippingStatus.DELIVERED,
        orderLines: [],
        tracking: [],
    });

    it("renders order number", () => {
        render(<OrderDetailsHeader order={createOrder()} />);

        expect(screen.getByText(/Pedido: 123456/)).toBeInTheDocument();
    });

    it("renders formatted order creation date", () => {
        render(<OrderDetailsHeader order={createOrder()} />);

        expect(screen.getByText(/10 de enero de 2024/)).toBeInTheDocument();
    });

    it("renders total points and coins", () => {
        render(<OrderDetailsHeader order={createOrder({ totalPoints: 2500, totalCoins: 75 })} />);

        expect(screen.getByText(/2\.500 Millas/)).toBeInTheDocument();
        expect(screen.getByText(/\$75/)).toBeInTheDocument();
    });

    it("renders points only when no coins", () => {
        render(<OrderDetailsHeader order={createOrder({ totalPoints: 1000, totalCoins: 0 })} />);

        expect(screen.getByText(/1\.000 Millas/)).toBeInTheDocument();
        expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
    });

    it("renders own delivery message with singular product", () => {
        render(<OrderDetailsHeader order={createOrder({ shippingDetails: [createShipping("GUID-1")] })} />);

        expect(screen.getByText("Tú recibes 1 producto")).toBeInTheDocument();
    });

    it("renders own delivery message with plural products", () => {
        render(
            <OrderDetailsHeader
                order={createOrder({ shippingDetails: [createShipping("GUID-1"), createShipping("GUID-2")] })}
            />
        );

        expect(screen.getByText("Tú recibes 2 productos")).toBeInTheDocument();
    });

    it("renders third party delivery message", () => {
        render(
            <OrderDetailsHeader
                order={createOrder({
                    shippingDetails: [createShipping("GUID-1")],
                    shippingAddress: { ...mockShippingAddress, isThirdPartyAddress: true },
                })}
            />
        );

        expect(screen.getByText("Un tercero recibe 1 producto")).toBeInTheDocument();
    });
});
