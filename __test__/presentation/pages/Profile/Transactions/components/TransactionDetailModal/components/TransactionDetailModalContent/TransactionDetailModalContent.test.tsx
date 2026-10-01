import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PaymentMethod } from "@/domain/entity/Payment/payment";
import { TransactionStatus, TransactionTypes } from "@/domain/entity/Transaction/transaction";
import TransactionDetailModalContent from "@/presentation/pages/Profile/Transactions/components/TransactionDetailModal/components/TransactionDetailModalContent/TransactionDetailModalContent";

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionDetailModal/components/TransactionDetailModalSection", () => ({
    default: () => <div data-testid="transaction-detail-section" />,
}));

describe("TransactionDetailModalContent", () => {
    it("renders the selected transaction summary and embeds the detail section", () => {
        render(
            <TransactionDetailModalContent
                transaction={{
                    number: 1001,
                    pointsAmount: 1500,
                    balanceAfterOperation: 3500,
                    paymentMethod: PaymentMethod.POINTS,
                    transactionType: TransactionTypes.Accreditation,
                    status: TransactionStatus.APPROVED,
                    createAt: "2026-07-16T09:30:00",
                } as any}
            />,
        );

        expect(screen.getByText(/\+ 1.500 millas/)).toBeInTheDocument();
        expect(screen.getByText("Acreditación de millas")).toBeInTheDocument();
        expect(screen.getByText("No. de transacción")).toBeInTheDocument();
        expect(screen.getByText("1001")).toBeInTheDocument();
        expect(screen.getByTestId("transaction-detail-section")).toBeInTheDocument();
    });

    it("renders originalNumber when number is missing", () => {
        render(
            <TransactionDetailModalContent
                transaction={{
                    number: undefined,
                    originalNumber: 441022,
                    pointsAmount: 750,
                    balanceAfterOperation: 5750,
                    transactionType: TransactionTypes.TransferReceive,
                    status: TransactionStatus.APPROVED,
                    createAt: "2026-07-14T14:30:00",
                } as any}
            />,
        );

        expect(screen.getByText("441022")).toBeInTheDocument();
    });
});
