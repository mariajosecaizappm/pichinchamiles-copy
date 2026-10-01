import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ShippingStatus } from "@/domain/entity/Order/order";

vi.mock("@/presentation/pages/Orders/components/OrderCardItem/components/OrderStatusChip/StatusChipWrapper", () => ({
    default: ({ children, className }: { children: React.ReactNode; className: string }) => (
        <div data-testid="status-chip-wrapper" className={className}>
            {children}
        </div>
    ),
}));

vi.mock("@/presentation/pages/Orders/components/OrderCardItem/components/OrderStatusChip/Icons", () => ({
    PendingIcon: () => <div data-testid="pending-icon">Pending Icon</div>,
    PaidIcon: () => <div data-testid="paid-icon">Paid Icon</div>,
    DeliveredIcon: () => <div data-testid="delivered-icon">Delivered Icon</div>,
    NoveltyIcon: () => <div data-testid="novelty-icon">Novelty Icon</div>,
}));

vi.mock("@/presentation/pages/Orders/components/OrderCardItem/components/OrderStatusChip/Icons/ErrorIcon", () => ({
    default: () => <div data-testid="error-icon">Error Icon</div>,
}));

import ShippingStatusChip from "@/presentation/pages/Orders/components/OrderDetails/OrderProductCard/ShippingStatusChip/ShippingStatusChip";

describe("ShippingStatusChip", () => {
    it("renders pending status", () => {
        render(<ShippingStatusChip status={ShippingStatus.PENDING} />);

        expect(screen.getByTestId("pending-icon")).toBeInTheDocument();
        expect(screen.getByText("Pendiente")).toBeInTheDocument();
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("border-darkGrayishBlue-300");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("bg-darkGrayishBlue-100");
    });

    it("renders assigned status", () => {
        render(<ShippingStatusChip status={ShippingStatus.ASSIGNED} />);

        expect(screen.getByTestId("paid-icon")).toBeInTheDocument();
        expect(screen.getByText("Asignado")).toBeInTheDocument();
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("border-information-200");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("bg-information-50");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("text-information-500");
    });

    it("renders waiting to send status", () => {
        render(<ShippingStatusChip status={ShippingStatus.WAIT_TO_SEND} />);

        expect(screen.getByTestId("paid-icon")).toBeInTheDocument();
        expect(screen.getByText("Esperando courier")).toBeInTheDocument();
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("border-information-200");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("bg-information-50");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("text-information-500");
    });

    it("renders arrived at the local status", () => {
        render(<ShippingStatusChip status={ShippingStatus.ARRIVED_AT_THE_LOCAL} />);

        expect(screen.getByTestId("paid-icon")).toBeInTheDocument();
        expect(screen.getByText("En ruta")).toBeInTheDocument();
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("border-information-200");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("bg-information-50");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("text-information-500");
    });

    it("renders delivered status", () => {
        render(<ShippingStatusChip status={ShippingStatus.DELIVERED} />);

        expect(screen.getByTestId("delivered-icon")).toBeInTheDocument();
        expect(screen.getByText("Entregado")).toBeInTheDocument();
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("bg-success-50");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("border-success-200");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("text-success-500");
    });

    it("renders novelty status", () => {
        render(<ShippingStatusChip status={ShippingStatus.NOVELTY} />);

        expect(screen.getByTestId("novelty-icon")).toBeInTheDocument();
        expect(screen.getByText("Con novedad")).toBeInTheDocument();
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("border-warning-200");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("bg-warning-50");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("text-warning-500");
    });

    it("renders canceled status", () => {
        render(<ShippingStatusChip status={ShippingStatus.CANCELED} />);

        expect(screen.getByTestId("error-icon")).toBeInTheDocument();
        expect(screen.getByText("Cancelado")).toBeInTheDocument();
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("border-error-200");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("bg-error-50");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("text-error-500");
    });

    it("renders withdrawn status", () => {
        render(<ShippingStatusChip status={ShippingStatus.WITH_DRAWN} />);

        expect(screen.getByTestId("novelty-icon")).toBeInTheDocument();
        expect(screen.getByText("Devuelto")).toBeInTheDocument();
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("border-warning-200");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("bg-warning-50");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("text-warning-500");
    });
});
