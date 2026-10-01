import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from "vitest";
import { Order, OrderLine, OrderStatus, ShippingAddress, ShippingDetail, ShippingStatus } from "@/domain/entity/Order/order";
import OrderDetailsContainer from "@/presentation/pages/Orders/components/OrderDetails/OrderDetailsContainer";

const capturedProps: { selectedShippingKey?: string; isDesktop: boolean; product?: OrderLine; selectedShipping?: ShippingDetail; setSelectedShippingKey?: (shippingKey: string | undefined) => void }[] = [];
const mockUseIsDesktop = vi.fn();

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: () => mockUseIsDesktop(),
}));

vi.mock("@/presentation/pages/Orders/components/OrderDetails/OrderDetails", () => ({
    default: (props: { selectedShippingKey?: string; isDesktop: boolean; product?: OrderLine; selectedShipping?: ShippingDetail; setSelectedShippingKey?: (shippingKey: string | undefined) => void }) => {
        capturedProps.push(props);
        return <div data-testid="order-details">OrderDetails</div>;
    },
}));

describe("OrderDetailsContainer", () => {
    const createOrderLine = (): OrderLine => ({
        image: { desktopUrl: "https://example.com/desktop.jpg", mobileUrl: "https://example.com/mobile.jpg" },
        productName: "Product A",
        quantity: 1,
        totalCoins: 50,
        totalPoints: 500,
    });

    const createShipping = (index: number): ShippingDetail => ({
        guidNumber: `GUID-00${index + 1}`,
        isOwnDelivery: true,
        shippingStatus: ShippingStatus.DELIVERED,
        orderLines: [createOrderLine()],
        tracking: [],
    });

    const createOrder = (shippings: ShippingDetail[]): Order => ({
        orderNumber: "123456",
        orderStatus: OrderStatus.DELIVERED,
        estimatedDeliveredDate: new Date("2024-01-15"),
        orderCreatedAt: new Date("2024-01-10"),
        totalCoins: 50,
        totalPoints: 1000,
        shippingDetails: shippings,
        shippingAddress: {} as unknown as ShippingAddress,
    });

    beforeAll(() => {
        vi.stubGlobal("scrollTo", vi.fn());
    });

    afterAll(() => {
        vi.unstubAllGlobals();
    });

    beforeEach(() => {
        vi.clearAllMocks();
        capturedProps.length = 0;
        mockUseIsDesktop.mockReturnValue({ isDesktop: true });
    });

    it("renders OrderDetails", () => {
        render(<OrderDetailsContainer order={createOrder([createShipping(0)])} onPressBack={vi.fn()} />);

        expect(screen.getByTestId("order-details")).toBeInTheDocument();
    });

    it("selects the first shipping detail by default on desktop", () => {
        render(<OrderDetailsContainer order={createOrder([createShipping(0), createShipping(1)])} onPressBack={vi.fn()} />);

        const props = capturedProps[capturedProps.length - 1];
        expect(props.selectedShippingKey).toBeDefined();
        expect(props.product).toEqual(createOrderLine());
    });

    it("does not auto-select any shipping detail on mobile", () => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: false });
        render(<OrderDetailsContainer order={createOrder([createShipping(0)])} onPressBack={vi.fn()} />);

        const props = capturedProps[capturedProps.length - 1];
        expect(props.selectedShippingKey).toBeUndefined();
        expect(props.product).toBeUndefined();
    });

    it("clears selection when switching from desktop to mobile", () => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: true });
        const { rerender } = render(<OrderDetailsContainer order={createOrder([createShipping(0)])} onPressBack={vi.fn()} />);

        expect(capturedProps[capturedProps.length - 1].selectedShippingKey).toBeDefined();

        mockUseIsDesktop.mockReturnValue({ isDesktop: false });
        rerender(<OrderDetailsContainer order={createOrder([createShipping(0)])} onPressBack={vi.fn()} />);

        expect(capturedProps[capturedProps.length - 1].selectedShippingKey).toBeUndefined();
    });

    it("auto-selects first shipping when switching from mobile to desktop", () => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: false });
        const { rerender } = render(<OrderDetailsContainer order={createOrder([createShipping(0)])} onPressBack={vi.fn()} />);

        expect(capturedProps[capturedProps.length - 1].selectedShippingKey).toBeUndefined();

        mockUseIsDesktop.mockReturnValue({ isDesktop: true });
        rerender(<OrderDetailsContainer order={createOrder([createShipping(0)])} onPressBack={vi.fn()} />);

        expect(capturedProps[capturedProps.length - 1].selectedShippingKey).toBeDefined();
    });

    it("passes isDesktop to OrderDetails", () => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: true });
        render(<OrderDetailsContainer order={createOrder([createShipping(0)])} onPressBack={vi.fn()} />);

        expect(capturedProps[capturedProps.length - 1].isDesktop).toBe(true);
    });

    it("scrolls to the top when selecting a shipping detail on desktop", () => {
        const { getByTestId } = render(<OrderDetailsContainer order={createOrder([createShipping(0), createShipping(1)])} onPressBack={vi.fn()} />);

        getByTestId("order-details");
        const props = capturedProps[capturedProps.length - 1];

        act(() => {
            props.setSelectedShippingKey?.("GUID-002");
        });

        expect(window.scrollTo).toHaveBeenCalledTimes(1);
        expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });

    it("does not scroll when selecting a shipping detail on mobile", () => {
        mockUseIsDesktop.mockReturnValue({ isDesktop: false });
        const { getByTestId } = render(<OrderDetailsContainer order={createOrder([createShipping(0), createShipping(1)])} onPressBack={vi.fn()} />);

        getByTestId("order-details");
        const props = capturedProps[capturedProps.length - 1];

        act(() => {
            props.setSelectedShippingKey?.("GUID-001");
        });

        expect(window.scrollTo).not.toHaveBeenCalled();
    });
});
