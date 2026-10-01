import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TransactionsListGridSkeleton from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/TransactionsListGridSkeleton";

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => <div data-testid="skeleton" className={className} />,
}));

describe("TransactionsListGridSkeleton", () => {
    it("renders a placeholder layout for groups, rows and pagination", () => {
        render(<TransactionsListGridSkeleton />);

        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(5);
    });
});
