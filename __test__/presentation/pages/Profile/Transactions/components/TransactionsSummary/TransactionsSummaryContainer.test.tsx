import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TransactionsSummaryContainer from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary/TransactionsSummaryContainer";

const mocks = vi.hoisted(() => ({
    containerGet: vi.fn(),
    useQuery: vi.fn(),
    getBankStatement: vi.fn(),
}));

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}));

vi.mock("@tanstack/react-query", () => ({
    useQuery: (options: unknown) => mocks.useQuery(options),
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsSummary/TransactionsSummary", () => ({
    default: () => <div data-testid="transactions-summary" />,
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsSummary/TransactionsSummarySkeleton", () => ({
    default: () => <div data-testid="transactions-summary-skeleton" />,
}));

describe("TransactionsSummaryContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.containerGet.mockReturnValue({
            getBankStatement: mocks.getBankStatement,
        });
    });

    it("renders the skeleton while loading", () => {
        mocks.useQuery.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
        });

        render(<TransactionsSummaryContainer />);

        expect(screen.getByTestId("transactions-summary-skeleton")).toBeInTheDocument();
    });

    it("renders the skeleton when the query fails", () => {
        mocks.useQuery.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
        });

        render(<TransactionsSummaryContainer />);

        expect(screen.getByTestId("transactions-summary-skeleton")).toBeInTheDocument();
    });

    it("renders the summary when the bank statement is available", () => {
        mocks.useQuery.mockReturnValue({
            data: { balance: 1000 },
            isLoading: false,
            isError: false,
        });

        render(<TransactionsSummaryContainer />);

        expect(screen.getByTestId("transactions-summary")).toBeInTheDocument();
    });
});
