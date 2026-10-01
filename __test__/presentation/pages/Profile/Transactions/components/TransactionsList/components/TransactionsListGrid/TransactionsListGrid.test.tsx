import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TransactionStatus, TransactionTypes } from "@/domain/entity/Transaction/transaction";
import TransactionsContext from "@/presentation/pages/Profile/Transactions/context/TransactionsContext";
import TransactionsListGrid from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/TransactionsListGrid";

vi.mock("@/presentation/components/icons/Icon", () => ({
    default: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/components/TransactionsGridPagination", () => ({
    default: ({ pagination }: { pagination: { totalPages: number } }) => (
        <div data-testid="transactions-pagination">{pagination.totalPages}</div>
    ),
}));

const firstTransaction = {
    number: 1,
    pointsAmount: -1200,
    balanceAfterOperation: 5000,
    transactionType: TransactionTypes.ProductRedemption,
    status: TransactionStatus.APPROVED,
    createAt: "2026-07-16T09:00:00",
};

const secondTransaction = {
    number: 2,
    pointsAmount: 300,
    balanceAfterOperation: 5300,
    transactionType: TransactionTypes.Accreditation,
    status: TransactionStatus.APPROVED,
    createAt: "2026-07-16T10:00:00",
};

describe("TransactionsListGrid", () => {
    it("renders grouped transactions and delegates selection to context", () => {
        const selectTransaction = vi.fn();

        render(
            <TransactionsContext.Provider
                value={{
                    transaction: firstTransaction as any,
                    selectTransaction,
                    clearTransaction: vi.fn(),
                }}
            >
                <TransactionsListGrid
                    transactionList={{
                        data: [firstTransaction, secondTransaction] as any,
                        pagination: {
                            page: 1,
                            pageSize: 15,
                            total: 2,
                            totalPages: 2,
                        },
                    }}
                />
            </TransactionsContext.Provider>,
        );

        expect(screen.getByText("Mostrando 2 registros")).toBeInTheDocument();
        expect(screen.getByText("Canje de productos")).toBeInTheDocument();
        expect(screen.getByText("Acreditación de millas")).toBeInTheDocument();
        expect(screen.getByTestId("transactions-pagination")).toHaveTextContent("2");

        const selectedButton = screen.getByRole("button", { name: /Canje de productos/i });
        expect(selectedButton).toHaveAttribute("aria-pressed", "true");

        fireEvent.click(screen.getByRole("button", { name: /Acreditación de millas/i }));
        expect(selectTransaction).toHaveBeenCalledWith(secondTransaction);
    });
});
