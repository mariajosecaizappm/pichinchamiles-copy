import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import links from "@/presentation/config/links";
import TransactionsListGridContainer from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/TransactionsListGridContainer";

const mocks = vi.hoisted(() => ({
    useTransactionsListQuery: vi.fn(),
    useSearchParams: vi.fn(),
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/useTransactionsListQuery", () => ({
    default: () => mocks.useTransactionsListQuery(),
}));

vi.mock("next/navigation", () => ({
    useSearchParams: () => mocks.useSearchParams(),
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/TransactionsListGrid", () => ({
    default: () => <div data-testid="transactions-grid" />,
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/TransactionsListGridSkeleton", () => ({
    default: () => <div data-testid="transactions-grid-skeleton" />,
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/TransactionsListEmptyState", () => ({
    default: ({
        buttonLabel,
        buttonHref,
        withWhiteBackground,
    }: {
        buttonLabel?: string;
        buttonHref?: string;
        withWhiteBackground?: boolean;
    }) => (
        <div data-testid="transactions-grid-empty">
            {buttonLabel ?? "Ir al catálogo de productos"}|{buttonHref ?? links.products}|{String(withWhiteBackground ?? true)}
        </div>
    ),
}));

describe("TransactionsListGridContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.useSearchParams.mockReturnValue(new URLSearchParams());
    });

    it("renders the skeleton while loading", () => {
        mocks.useTransactionsListQuery.mockReturnValue({
            data: undefined,
            isLoading: true,
        });

        render(<TransactionsListGridContainer />);

        expect(screen.getByTestId("transactions-grid-skeleton")).toBeInTheDocument();
    });

    it("renders the empty state when there are no results", () => {
        mocks.useTransactionsListQuery.mockReturnValue({
            data: {
                data: [],
                pagination: {
                    total: 0,
                },
            },
            isLoading: false,
        });

        render(<TransactionsListGridContainer />);

        expect(screen.getByTestId("transactions-grid-empty")).toBeInTheDocument();
    });

    it("renders the grid when transaction data exists", () => {
        mocks.useTransactionsListQuery.mockReturnValue({
            data: {
                data: [{ number: 1 }],
                pagination: {
                    total: 1,
                },
            },
            isLoading: false,
        });

        render(<TransactionsListGridContainer />);

        expect(screen.getByTestId("transactions-grid")).toBeInTheDocument();
    });

    it("renders the filtered empty state variant when a range filter is active", () => {
        mocks.useTransactionsListQuery.mockReturnValue({
            data: {
                data: [],
                pagination: {
                    total: 0,
                },
            },
            isLoading: false,
        });
        mocks.useSearchParams.mockReturnValue(
            new URLSearchParams("range=2026-07-01,2026-07-31"),
        );

        render(<TransactionsListGridContainer />);

        expect(screen.getByTestId("transactions-grid-empty")).toHaveTextContent(`Ir al inicio|${links.products}|false`);
    });
});
