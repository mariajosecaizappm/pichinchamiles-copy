import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TransactionsDetailSection from "@/presentation/pages/Profile/Transactions/components/TransactionsDetailSection/TransactionsDetailSection";
import TransactionsContext from "@/presentation/pages/Profile/Transactions/context/TransactionsContext";

const mocks = vi.hoisted(() => ({
    useTransactionsListQuery: vi.fn(),
    clearTransaction: vi.fn(),
    useSearchParams: vi.fn(),
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/useTransactionsListQuery", () => ({
    default: () => mocks.useTransactionsListQuery(),
}));

vi.mock("next/navigation", () => ({
    useSearchParams: () => mocks.useSearchParams(),
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm", () => ({
    default: () => <div data-testid="export-transactions-form" />,
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsList", () => ({
    default: () => <div data-testid="transactions-list" />,
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionDetailModal", () => ({
    default: () => <div data-testid="transaction-detail-modal" />,
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/TransactionsListEmptyState", () => ({
    default: () => <div data-testid="transactions-empty-state" />,
}));

describe("TransactionsDetailSection", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.useSearchParams.mockReturnValue(new URLSearchParams());
    });

    it("renders the empty state when there are no transactions", () => {
        mocks.useTransactionsListQuery.mockReturnValue({
            data: {
                data: [],
                pagination: {
                    total: 0,
                },
            },
        });

        render(
            <TransactionsContext.Provider
                value={{
                    transaction: null,
                    selectTransaction: vi.fn(),
                    clearTransaction: mocks.clearTransaction,
                }}
            >
                <TransactionsDetailSection />
            </TransactionsContext.Provider>,
        );

        expect(screen.getByTestId("transactions-empty-state")).toBeInTheDocument();
        expect(screen.queryByTestId("transactions-list")).not.toBeInTheDocument();
        expect(mocks.clearTransaction).toHaveBeenCalledTimes(1);
    });

    it("renders the detail layout when transactions exist", () => {
        mocks.useTransactionsListQuery.mockReturnValue({
            data: {
                data: [{ number: 1 }],
                pagination: {
                    total: 1,
                },
            },
        });

        render(
            <TransactionsContext.Provider
                value={{
                    transaction: null,
                    selectTransaction: vi.fn(),
                    clearTransaction: mocks.clearTransaction,
                }}
            >
                <TransactionsDetailSection />
            </TransactionsContext.Provider>,
        );

        expect(screen.getByText("Detalle de transacciones")).toBeInTheDocument();
        expect(screen.getByTestId("export-transactions-form")).toBeInTheDocument();
        expect(screen.getByTestId("transactions-list")).toBeInTheDocument();
        expect(screen.getByTestId("transaction-detail-modal")).toBeInTheDocument();
        expect(mocks.clearTransaction).toHaveBeenCalledTimes(1);
    });

    it("keeps the detail layout and active range filters when there are no filtered results", () => {
        mocks.useTransactionsListQuery.mockReturnValue({
            data: {
                data: [],
                pagination: {
                    total: 0,
                },
            },
        });
        mocks.useSearchParams.mockReturnValue(
            new URLSearchParams("range=2026-07-01,2026-07-31"),
        );

        render(
            <TransactionsContext.Provider
                value={{
                    transaction: null,
                    selectTransaction: vi.fn(),
                    clearTransaction: mocks.clearTransaction,
                }}
            >
                <TransactionsDetailSection />
            </TransactionsContext.Provider>,
        );

        expect(screen.queryByTestId("transactions-empty-state")).not.toBeInTheDocument();
        expect(screen.getByText("Detalle de transacciones")).toBeInTheDocument();
        expect(screen.getByTestId("transactions-list")).toBeInTheDocument();
        expect(screen.getByTestId("transaction-detail-modal")).toBeInTheDocument();
    });
});
