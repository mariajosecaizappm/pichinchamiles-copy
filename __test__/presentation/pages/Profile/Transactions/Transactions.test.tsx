import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Transactions from "@/presentation/pages/Profile/Transactions/Transactions";

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsSummary", () => ({
    default: () => <div data-testid="transactions-summary" />,
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsDetailSection", () => ({
    default: () => <div data-testid="transactions-detail-section" />,
}));

vi.mock("@/presentation/pages/Profile/Transactions/context/TransactionsProvider", () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="transactions-provider">{children}</div>
    ),
}));

describe("Transactions", () => {
    it("renders the summary and wraps the detail section with the provider", () => {
        const { container } = render(<Transactions />);

        expect(screen.getByTestId("transactions-summary")).toBeInTheDocument();
        expect(screen.getByTestId("transactions-provider")).toBeInTheDocument();
        expect(screen.getByTestId("transactions-detail-section")).toBeInTheDocument();

        const wrapper = container.firstChild as HTMLDivElement;
        expect(wrapper).toHaveClass("pt-4", "pb-6", "px-6", "w-full", "flex", "flex-col");
    });
});
