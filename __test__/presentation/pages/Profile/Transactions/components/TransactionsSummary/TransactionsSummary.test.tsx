import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TransactionsSummary from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary/TransactionsSummary";

const mocks = vi.hoisted(() => ({
    useIsDesktop: vi.fn(),
}));

vi.mock("@/presentation/hooks/useIsDesktop", () => ({
    default: () => mocks.useIsDesktop(),
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionSummaryCard", () => ({
    default: () => <div data-testid="summary-card" />,
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionsSection", () => ({
    default: () => <div data-testid="desktop-summary" />,
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionsSummaryAccordion", () => ({
    default: () => <div data-testid="mobile-summary" />,
}));

describe("TransactionsSummary", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the desktop section when the screen is desktop", () => {
        mocks.useIsDesktop.mockReturnValue({ isDesktop: true });

        render(<TransactionsSummary bankStatement={{} as any} />);

        expect(screen.getByTestId("summary-card")).toBeInTheDocument();
        expect(screen.getByTestId("desktop-summary")).toBeInTheDocument();
        expect(screen.queryByTestId("mobile-summary")).not.toBeInTheDocument();
    });

    it("renders the accordion on smaller screens", () => {
        mocks.useIsDesktop.mockReturnValue({ isDesktop: false });

        render(<TransactionsSummary bankStatement={{} as any} />);

        expect(screen.getByTestId("mobile-summary")).toBeInTheDocument();
        expect(screen.queryByTestId("desktop-summary")).not.toBeInTheDocument();
    });
});
