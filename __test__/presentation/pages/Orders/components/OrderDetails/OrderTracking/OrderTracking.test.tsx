import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import OrderTrackingComponent from "@/presentation/pages/Orders/components/OrderDetails/OrderTracking/OrderTracking";
import { ShippingDetail, ShippingStatus, ShippingTracking } from "@/domain/entity/Order/order";
import { TrackingStep } from "@/presentation/pages/Orders/components/OrderDetails/OrderTracking/types";

vi.mock("@/presentation/components/icons/Icon", () => ({
    default: ({ name }: { name: string }) => <span data-testid="icon" data-name={name}>{name}</span>,
}));

vi.mock("@heroui/react", () => ({
    cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
    Divider: () => <hr data-testid="divider" />,
}));

vi.mock("@/presentation/pages/Orders/components/OrderDetails/OrderProductCard/ShippingStatusChip", () => ({
    default: ({ status }: { status: ShippingStatus }) => <span data-testid="shipping-status-chip">{status}</span>,
}));

vi.mock("@/presentation/components/Alert", () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="alert">{children}</div>,
}));

describe("OrderTracking", () => {
    const createTracking = (status: ShippingStatus, date: Date): ShippingTracking => ({
        status,
        trackingDate: date,
    });

    const createShipping = (status: ShippingStatus, tracking: ShippingTracking[]): ShippingDetail => ({
        guidNumber: "GUID-001",
        isOwnDelivery: true,
        shippingStatus: status,
        orderLines: [],
        tracking,
    });

    const baseSteps: TrackingStep[] = [
        { status: ShippingStatus.ASSIGNED, label: "Asignado" },
        { status: ShippingStatus.WAIT_TO_SEND, label: "Esperando courier" },
        { status: ShippingStatus.ARRIVED_AT_THE_LOCAL, label: "En ruta" },
        { status: ShippingStatus.DELIVERED, label: "Entregado" },
    ];

    const noveltyStep: TrackingStep = { status: ShippingStatus.NOVELTY, label: "Con novedad" };

    it("renders tracking title", () => {
        const shipping = createShipping(ShippingStatus.DELIVERED, []);

        render(
            <OrderTrackingComponent
                selectedShipping={shipping}
                hasNoveltyTracking={false}
                getStepsToRender={() => []}
            />
        );

        expect(screen.getByText("Estado del pedido")).toBeInTheDocument();
    });

    it("renders shipping status chip when selectedShipping is provided", () => {
        const shipping = createShipping(ShippingStatus.DELIVERED, []);

        render(
            <OrderTrackingComponent
                selectedShipping={shipping}
                hasNoveltyTracking={false}
                getStepsToRender={() => []}
            />
        );

        expect(screen.getByTestId("shipping-status-chip")).toBeInTheDocument();
    });

    it("renders steps with index numbers when not completed", () => {
        const getStepsToRender = () =>
            baseSteps.map((step) => ({ step, trackingEntry: undefined }));

        render(
            <OrderTrackingComponent
                selectedShipping={createShipping(ShippingStatus.ASSIGNED, [])}
                hasNoveltyTracking={false}
                getStepsToRender={getStepsToRender}
            />
        );

        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("renders check icon for completed non-novelty steps", () => {
        const getStepsToRender = () => [
            { step: baseSteps[0], trackingEntry: createTracking(ShippingStatus.ASSIGNED, new Date("2024-01-10")) },
        ];

        render(
            <OrderTrackingComponent
                selectedShipping={createShipping(ShippingStatus.ASSIGNED, [])}
                hasNoveltyTracking={false}
                getStepsToRender={getStepsToRender}
            />
        );

        const icon = screen.getByTestId("icon");
        expect(icon).toHaveAttribute("data-name", "icon-check");
    });

    it("renders priority icon for novelty steps", () => {
        const getStepsToRender = () => [
            { step: noveltyStep, trackingEntry: createTracking(ShippingStatus.NOVELTY, new Date("2024-01-10")) },
        ];

        render(
            <OrderTrackingComponent
                selectedShipping={createShipping(ShippingStatus.NOVELTY, [])}
                hasNoveltyTracking={true}
                getStepsToRender={getStepsToRender}
            />
        );

        const icon = screen.getByTestId("icon");
        expect(icon).toHaveAttribute("data-name", "icon-priority-high");
    });

    it("renders tracking date for completed steps", () => {
        const getStepsToRender = () => [
            { step: baseSteps[0], trackingEntry: createTracking(ShippingStatus.ASSIGNED, new Date(2024, 0, 10)) },
        ];

        render(
            <OrderTrackingComponent
                selectedShipping={createShipping(ShippingStatus.ASSIGNED, [])}
                hasNoveltyTracking={false}
                getStepsToRender={getStepsToRender}
            />
        );

        expect(screen.getByText(/10 de enero de 2024/)).toBeInTheDocument();
    });

    it("renders vertical line between steps except for the last one", () => {
        const getStepsToRender = () =>
            baseSteps.map((step) => ({ step, trackingEntry: undefined }));

        const { container } = render(
            <OrderTrackingComponent
                selectedShipping={createShipping(ShippingStatus.ASSIGNED, [])}
                hasNoveltyTracking={false}
                getStepsToRender={getStepsToRender}
            />
        );

        const lines = container.querySelectorAll(".bg-grayscale-300");
        expect(lines).toHaveLength(baseSteps.length - 1);
    });

    it("renders novelty alert when hasNoveltyTracking is true", () => {
        render(
            <OrderTrackingComponent
                selectedShipping={createShipping(ShippingStatus.NOVELTY, [])}
                hasNoveltyTracking={true}
                getStepsToRender={() => []}
            />
        );

        expect(screen.getByTestId("alert")).toBeInTheDocument();
        expect(screen.getByText(/Nos comunicaremos contigo/)).toBeInTheDocument();
    });

    it("does not render novelty alert when hasNoveltyTracking is false", () => {
        render(
            <OrderTrackingComponent
                selectedShipping={createShipping(ShippingStatus.DELIVERED, [])}
                hasNoveltyTracking={false}
                getStepsToRender={() => []}
            />
        );

        expect(screen.queryByTestId("alert")).not.toBeInTheDocument();
    });
});
