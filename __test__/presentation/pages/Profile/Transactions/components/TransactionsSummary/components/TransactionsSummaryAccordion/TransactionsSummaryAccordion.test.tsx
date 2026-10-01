import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TransactionsSummaryAccordion from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionsSummaryAccordion/TransactionsSummaryAccordion";

vi.mock("@/presentation/components/icons/Icon", () => ({
    default: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionsSummaryAccordion/components/TransactionAccordionSection", () => ({
    default: ({ title }: { title: string }) => <div data-testid="accordion-section">{title}</div>,
}));

describe("TransactionsSummaryAccordion", () => {
    it("toggles the mobile summary sections", () => {
        render(
            <TransactionsSummaryAccordion
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

        const toggle = screen.getByRole("button", { name: /Resumen historico de millas/i });
        expect(toggle).toHaveAttribute("aria-expanded", "false");

        fireEvent.click(toggle);

        expect(toggle).toHaveAttribute("aria-expanded", "true");
        expect(screen.getAllByTestId("accordion-section")).toHaveLength(3);
        expect(screen.getByTestId("icon-icon-arrow-down")).toBeInTheDocument();
    });
});
