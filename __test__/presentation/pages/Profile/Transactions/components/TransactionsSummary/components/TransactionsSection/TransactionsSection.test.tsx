import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TransactionsSection from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionsSection/TransactionsSection";

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionsSummaryAccordion/components/TransactionAccordionSection", () => ({
    default: ({
        title,
        total,
        details,
    }: {
        title: string;
        total?: number;
        details: Array<{ label: string; value: number }>;
    }) => (
        <div data-testid="accordion-section">
            <span>{title}:{total ?? "no-total"}</span>
            {details.map((detail) => (
                <span key={detail.label}>{detail.label}:{detail.value}</span>
            ))}
        </div>
    ),
}));

describe("TransactionsSection", () => {
    it("renders the desktop summary sections", () => {
        render(
            <TransactionsSection
                bankStatement={{
                    accreditations: {
                        totalPoints: 1000,
                        consumptions: 600,
                        promos: 400,
                        receivedTransfers: 50,
                    },
                    debits: {
                        totalPoints: 300,
                        travels: 100,
                        products: 80,
                        donations: 60,
                        others: 60,
                        sentTransfers: 20,
                    },
                } as any}
            />,
        );

        expect(screen.getByText("Acumulaciones:1000")).toBeInTheDocument();
        expect(screen.getByText("Consumos:600")).toBeInTheDocument();
        expect(screen.getByText("Promociones:400")).toBeInTheDocument();
        expect(screen.getByText("Redenciones:300")).toBeInTheDocument();
        expect(screen.getByText("Transferencias:no-total")).toBeInTheDocument();
    });
});
