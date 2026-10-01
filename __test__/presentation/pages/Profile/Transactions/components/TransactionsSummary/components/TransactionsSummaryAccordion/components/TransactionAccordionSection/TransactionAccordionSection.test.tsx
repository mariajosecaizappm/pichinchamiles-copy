import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TransactionAccordionSection from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionsSummaryAccordion/components/TransactionAccordionSection/TransactionAccordionSection";

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionsSummaryAccordion/components/SummaryRow", () => ({
    default: ({
        label,
        value,
    }: {
        label: string;
        value: number;
    }) => <div data-testid="summary-row">{`${label}:${value}`}</div>,
}));

describe("TransactionAccordionSection", () => {
    it("renders the total and detail rows for increment sections", () => {
        render(
            <TransactionAccordionSection
                title="Acumulaciones"
                total={1200}
                type="increment"
                details={[
                    { label: "Consumos", value: 1000, icon: "icon-credit-card" },
                    { label: "Promociones", value: 200, icon: "icon-local-offer" },
                ]}
            />,
        );

        expect(screen.getByText("Acumulaciones")).toBeInTheDocument();
        expect(screen.getByText("+ 1.200 millas")).toBeInTheDocument();
        expect(screen.getAllByTestId("summary-row")).toHaveLength(2);
    });

    it("renders sections without total when none is provided", () => {
        render(
            <TransactionAccordionSection
                title="Transferencias"
                details={[{ label: "Millas recibidas", value: 50 }]}
            />,
        );

        expect(screen.getByText("Transferencias")).toBeInTheDocument();
        expect(screen.getByText("Millas recibidas:50")).toBeInTheDocument();
        expect(screen.queryByText(/^[-+]\s/)).not.toBeInTheDocument();
    });
});
