import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TransactionsSummarySkeleton from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary/TransactionsSummarySkeleton";

vi.mock("@heroui/react", () => ({
    Skeleton: ({ className }: { className?: string }) => <div data-testid="skeleton" className={className} />,
}));

describe("TransactionsSummarySkeleton", () => {
    it("renders multiple placeholders for the summary layout", () => {
        render(<TransactionsSummarySkeleton />);

        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(10);
    });
});
