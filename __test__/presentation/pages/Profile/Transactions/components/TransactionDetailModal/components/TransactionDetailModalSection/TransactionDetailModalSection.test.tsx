import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TransactionStatus, TransactionTypes } from "@/domain/entity/Transaction/transaction";
import TransactionDetailModalSection from "@/presentation/pages/Profile/Transactions/components/TransactionDetailModal/components/TransactionDetailModalSection/TransactionDetailModalSection";

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionDetailModal/components/TransactionDetailModalSection/helpers", () => ({
    getTransactionDetails: () => [
        { label: "Cantidad", value: 2 },
        { label: "Método de redención", value: "Millas" },
    ],
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionDetailModal/components/TransactionDetailModalSection/components/TransactionStatusChip", () => ({
    default: ({ status }: { status: string }) => <div data-testid="status-chip">{status}</div>,
}));

describe("TransactionDetailModalSection", () => {
    it("renders the base details and helper-generated rows", () => {
        render(
            <TransactionDetailModalSection
                transaction={{
                    balanceAfterOperation: 1500,
                    status: TransactionStatus.APPROVED,
                    transactionType: TransactionTypes.ProductRedemption,
                } as any}
            />,
        );

        expect(screen.getByText("Más detalles")).toBeInTheDocument();
        expect(screen.getByText("Estado")).toBeInTheDocument();
        expect(screen.getByTestId("status-chip")).toHaveTextContent(TransactionStatus.APPROVED);
        expect(screen.getByText("Saldo en millas")).toBeInTheDocument();
        expect(screen.getByText("1.500")).toBeInTheDocument();
        expect(screen.getByText("Cantidad")).toBeInTheDocument();
        expect(screen.getByText("Método de redención")).toBeInTheDocument();
    });
});
