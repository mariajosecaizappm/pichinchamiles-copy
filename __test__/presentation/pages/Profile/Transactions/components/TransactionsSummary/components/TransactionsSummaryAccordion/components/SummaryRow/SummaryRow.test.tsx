import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SummaryRow from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionsSummaryAccordion/components/SummaryRow/SummaryRow";

vi.mock("@/presentation/components/icons/Icon", () => ({
    default: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />,
}));

describe("SummaryRow", () => {
    it("renders the label, formatted value and optional icon", () => {
        render(
            <SummaryRow
                label="Consumos"
                value={2300}
                icon="icon-credit-card"
            />,
        );

        expect(screen.getByTestId("icon-icon-credit-card")).toBeInTheDocument();
        expect(screen.getByText("Consumos")).toBeInTheDocument();
        expect(screen.getByText("2.300 millas")).toBeInTheDocument();
    });
});
