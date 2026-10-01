import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TransactionStatus, TransactionTypes } from "@/domain/entity/Transaction/transaction";
import TransactionDetailModal from "@/presentation/pages/Profile/Transactions/components/TransactionDetailModal/TransactionDetailModal";
import TransactionsContext from "@/presentation/pages/Profile/Transactions/context/TransactionsContext";

const mocks = vi.hoisted(() => ({
    useIsDesktop: vi.fn(),
}));

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: () => mocks.useIsDesktop(),
}));

vi.mock("@/presentation/components/Modal", () => ({
    default: ({
        children,
        headerButton,
        onClose,
    }: {
        children: React.ReactNode;
        headerButton: React.ReactNode;
        onClose: (isOpen: boolean) => void;
    }) => (
        <div data-testid="transaction-detail-modal">
            <button type="button" onClick={() => onClose(false)}>
                close-modal
            </button>
            {headerButton}
            {children}
        </div>
    ),
}));

vi.mock("@/presentation/components/icons/Icon", () => ({
    default: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionDetailModal/components/TransactionDetailModalContent", () => ({
    default: ({ transaction }: { transaction: { number: number } }) => (
        <div data-testid="transaction-detail-content">{transaction.number}</div>
    ),
}));

const transaction = {
    number: 22,
    pointsAmount: 100,
    balanceAfterOperation: 200,
    transactionType: TransactionTypes.ProductRedemption,
    status: TransactionStatus.APPROVED,
    createAt: "2026-07-16T09:30:00",
};

describe("TransactionDetailModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns null when no transaction is selected", () => {
        mocks.useIsDesktop.mockReturnValue({ isDesktop: true });

        const { container } = render(
            <TransactionsContext.Provider
                value={{
                    transaction: null,
                    selectTransaction: vi.fn(),
                    clearTransaction: vi.fn(),
                }}
            >
                <TransactionDetailModal />
            </TransactionsContext.Provider>,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it("renders the sticky desktop detail panel", () => {
        mocks.useIsDesktop.mockReturnValue({ isDesktop: true });

        render(
            <TransactionsContext.Provider
                value={{
                    transaction: transaction as any,
                    selectTransaction: vi.fn(),
                    clearTransaction: vi.fn(),
                }}
            >
                <TransactionDetailModal />
            </TransactionsContext.Provider>,
        );

        expect(screen.getByTestId("transaction-detail-content")).toHaveTextContent("22");
        expect(screen.queryByTestId("transaction-detail-modal")).not.toBeInTheDocument();
    });

    it("renders the mobile modal and clears the selection on back or close", () => {
        const clearTransaction = vi.fn();
        mocks.useIsDesktop.mockReturnValue({ isDesktop: false });

        render(
            <TransactionsContext.Provider
                value={{
                    transaction: transaction as any,
                    selectTransaction: vi.fn(),
                    clearTransaction,
                }}
            >
                <TransactionDetailModal />
            </TransactionsContext.Provider>,
        );

        expect(screen.getByText("Detalle de canje")).toBeInTheDocument();
        expect(screen.getByTestId("icon-icon-back")).toBeInTheDocument();

        fireEvent.click(screen.getByLabelText("Regresar"));
        fireEvent.click(screen.getByText("close-modal"));

        expect(clearTransaction).toHaveBeenCalledTimes(2);
    });
});
