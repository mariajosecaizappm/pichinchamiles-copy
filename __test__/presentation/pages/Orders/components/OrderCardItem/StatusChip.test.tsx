import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OrderStatus } from "@/domain/entity/Order/order";

vi.mock("@/presentation/pages/Orders/components/OrderCardItem/components/OrderStatusChip/StatusChipWrapper", () => ({
    default: ({ children, className }: { children: React.ReactNode; className: string }) => (
        <div data-testid="status-chip-wrapper" className={className}>
            {children}
        </div>
    ),
}));

vi.mock("@/presentation/pages/Orders/components/OrderCardItem/components/OrderStatusChip/Icons", () => ({
    PendingIcon: () => <div data-testid="pending-icon">Pending Icon</div>,
    NoveltyIcon: () => <div data-testid="novelty-icon">Novelty Icon</div>,
    PaidIcon: () => <div data-testid="paid-icon">Paid Icon</div>,
    DeliveredIcon: () => <div data-testid="delivered-icon">Delivered Icon</div>,
}));

import OrderStatusChip from "@/presentation/pages/Orders/components/OrderCardItem/components/OrderStatusChip/StatusChip";

describe("OrderStatusChip", () => {
    it("renders pending status for CREATED", () => {
        render(<OrderStatusChip status={OrderStatus.CREATED} />);

        expect(screen.getByTestId("pending-icon")).toBeInTheDocument();
        expect(screen.getByText("Pendiente")).toBeInTheDocument();
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("border-darkGrayishBlue-300");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("bg-darkGrayishBlue-100");
    });

    it("renders pending status for PAY_PENDING", () => {
        render(<OrderStatusChip status={OrderStatus.PAY_PENDING} />);

        expect(screen.getByTestId("pending-icon")).toBeInTheDocument();
        expect(screen.getByText("Pendiente")).toBeInTheDocument();
    });

    it("renders pending status for APPROVED", () => {
        render(<OrderStatusChip status={OrderStatus.APPROVED} />);

        expect(screen.getByTestId("pending-icon")).toBeInTheDocument();
        expect(screen.getByText("Pendiente")).toBeInTheDocument();
    });

    it("renders pending status for PENDING", () => {
        render(<OrderStatusChip status={OrderStatus.PENDING} />);

        expect(screen.getByTestId("pending-icon")).toBeInTheDocument();
        expect(screen.getByText("Pendiente")).toBeInTheDocument();
    });

    it("renders novelty status for CANCELED", () => {
        render(<OrderStatusChip status={OrderStatus.CANCELED} />);

        expect(screen.getByTestId("novelty-icon")).toBeInTheDocument();
        expect(screen.getByText("Con novedad")).toBeInTheDocument();
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("border-warning-200");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("bg-warning-50");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("text-warning-500");
    });

    it("renders novelty status for REJECTED", () => {
        render(<OrderStatusChip status={OrderStatus.REJECTED} />);

        expect(screen.getByTestId("novelty-icon")).toBeInTheDocument();
        expect(screen.getByText("Con novedad")).toBeInTheDocument();
    });

    it("renders novelty status for NOVELTY", () => {
        render(<OrderStatusChip status={OrderStatus.NOVELTY} />);

        expect(screen.getByTestId("novelty-icon")).toBeInTheDocument();
        expect(screen.getByText("Con novedad")).toBeInTheDocument();
    });

    it("renders paid status for PAID", () => {
        render(<OrderStatusChip status={OrderStatus.PAID} />);

        expect(screen.getByTestId("paid-icon")).toBeInTheDocument();
        expect(screen.getByText("Por entregar")).toBeInTheDocument();
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("border-information-200");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("bg-information-50");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("text-information-500");
    });

    it("renders delivered status for DELIVERED", () => {
        render(<OrderStatusChip status={OrderStatus.DELIVERED} />);

        expect(screen.getByTestId("delivered-icon")).toBeInTheDocument();
        expect(screen.getByText("Entregado")).toBeInTheDocument();
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("bg-success-50");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("border-success-200");
        expect(screen.getByTestId("status-chip-wrapper")).toHaveClass("text-success-500");
    });

    it("renders default pending status for unknown status", () => {
        render(<OrderStatusChip status={"unknown" as OrderStatus} />);

        expect(screen.getByTestId("pending-icon")).toBeInTheDocument();
        expect(screen.getByText("Pendiente")).toBeInTheDocument();
    });
});
