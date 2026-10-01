import React, { useContext } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TransactionsProvider from "@/presentation/pages/Profile/Transactions/context/TransactionsProvider";
import TransactionsContext from "@/presentation/pages/Profile/Transactions/context/TransactionsContext";
import { TransactionStatus, TransactionTypes } from "@/domain/entity/Transaction/transaction";

const firstTransaction = {
    number: 1,
    pointsAmount: -100,
    balanceAfterOperation: 900,
    transactionType: TransactionTypes.ProductRedemption,
    status: TransactionStatus.APPROVED,
    createAt: "2026-07-16T10:00:00",
};

const secondTransaction = {
    number: 2,
    pointsAmount: 50,
    balanceAfterOperation: 950,
    transactionType: TransactionTypes.Accreditation,
    status: TransactionStatus.APPROVED,
    createAt: "2026-07-17T10:00:00",
};

const transferWithSameNumber = {
    number: 1,
    pointsAmount: -500,
    balanceAfterOperation: 400,
    transactionType: TransactionTypes.TransferSend,
    status: TransactionStatus.APPROVED,
    createAt: "2026-07-16T11:00:00",
};

const Consumer = () => {
    const { transaction, selectTransaction, clearTransaction } = useContext(TransactionsContext);

    return (
        <div>
            <span data-testid="selected-transaction">{transaction?.number ?? "none"}</span>
            <span data-testid="selected-type">{transaction?.transactionType ?? "none"}</span>
            <button onClick={() => selectTransaction(firstTransaction as any)}>select-first</button>
            <button onClick={() => selectTransaction(firstTransaction as any)}>toggle-first</button>
            <button onClick={() => selectTransaction(secondTransaction as any)}>select-second</button>
            <button onClick={() => selectTransaction(transferWithSameNumber as any)}>select-transfer-same-number</button>
            <button onClick={clearTransaction}>clear</button>
        </div>
    );
};

describe("TransactionsProvider", () => {
    it("selects, toggles and clears the current transaction", () => {
        render(
            <TransactionsProvider>
                <Consumer />
            </TransactionsProvider>,
        );

        expect(screen.getByTestId("selected-transaction")).toHaveTextContent("none");

        fireEvent.click(screen.getByText("select-first"));
        expect(screen.getByTestId("selected-transaction")).toHaveTextContent("1");

        fireEvent.click(screen.getByText("toggle-first"));
        expect(screen.getByTestId("selected-transaction")).toHaveTextContent("none");

        fireEvent.click(screen.getByText("select-second"));
        expect(screen.getByTestId("selected-transaction")).toHaveTextContent("2");

        fireEvent.click(screen.getByText("clear"));
        expect(screen.getByTestId("selected-transaction")).toHaveTextContent("none");
    });

    it("switches to another transaction that shares the same number", () => {
        render(
            <TransactionsProvider>
                <Consumer />
            </TransactionsProvider>,
        );

        fireEvent.click(screen.getByText("select-first"));
        expect(screen.getByTestId("selected-type")).toHaveTextContent(TransactionTypes.ProductRedemption);

        fireEvent.click(screen.getByText("select-transfer-same-number"));
        expect(screen.getByTestId("selected-transaction")).toHaveTextContent("1");
        expect(screen.getByTestId("selected-type")).toHaveTextContent(TransactionTypes.TransferSend);
    });
});
