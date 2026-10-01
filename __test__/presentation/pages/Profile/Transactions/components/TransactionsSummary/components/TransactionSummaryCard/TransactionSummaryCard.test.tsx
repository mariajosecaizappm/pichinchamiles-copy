import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TransactionSummaryCard from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionSummaryCard/TransactionSummaryCard";

describe("TransactionSummaryCard", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-07-16T12:00:00.000Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("renders the current balance using the current date", () => {
        render(
            <TransactionSummaryCard
                bankStatement={{
                    balance: 12345,
                } as any}
            />,
        );

        expect(screen.getByText(/Saldo disponible al/)).toBeInTheDocument();
        expect(screen.getByText("12.345 millas")).toBeInTheDocument();
    });
});
