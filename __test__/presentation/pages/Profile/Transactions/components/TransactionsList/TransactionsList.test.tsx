import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TransactionsList from "@/presentation/pages/Profile/Transactions/components/TransactionsList/TransactionsList";

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionListFilters", () => ({
    default: () => <div data-testid="transaction-list-filters" />,
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid", () => ({
    default: () => <div data-testid="transactions-list-grid" />,
}));

describe("TransactionsList", () => {
    it("renders filters and the grid container", () => {
        render(<TransactionsList />);

        expect(screen.getByTestId("transaction-list-filters")).toBeInTheDocument();
        expect(screen.getByTestId("transactions-list-grid")).toBeInTheDocument();
    });
});
