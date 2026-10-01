import React, { useContext } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TransactionsContext from "@/presentation/pages/Profile/Transactions/context/TransactionsContext";

const Consumer = () => {
    const { transaction, selectTransaction, clearTransaction } = useContext(TransactionsContext);

    return (
        <div>
            <span data-testid="transaction-value">{transaction ? "selected" : "none"}</span>
            <button type="button" onClick={() => selectTransaction({ number: 1 } as any)}>
                select
            </button>
            <button type="button" onClick={clearTransaction}>
                clear
            </button>
        </div>
    );
};

describe("TransactionsContext", () => {
    it("exposes harmless default values outside a provider", () => {
        render(<Consumer />);

        fireEvent.click(screen.getByText("select"));
        fireEvent.click(screen.getByText("clear"));

        expect(screen.getByTestId("transaction-value")).toHaveTextContent("none");
    });
});
