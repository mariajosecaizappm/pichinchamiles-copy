import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TransactionListFilters from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionListFilters/TransactionListFilters";

const mocks = vi.hoisted(() => ({
    push: vi.fn(),
    get: vi.fn(),
    toString: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mocks.push,
    }),
    useSearchParams: () => ({
        get: mocks.get,
        toString: mocks.toString,
    }),
}));

vi.mock("@/presentation/components/Form/components/DateRangePicker", () => ({
    DateRangePicker: ({
        value,
        onChange,
        testId,
    }: {
        value: { start?: { year: number }; end?: { year: number } } | null;
        onChange: (value: unknown) => void;
        testId: string;
    }) => (
        <div>
            <div data-testid={testId}>{value ? `${value.start?.year}-${value.end?.year}` : "empty"}</div>
            <button
                type="button"
                onClick={() =>
                    onChange({
                        start: { year: 2026, month: 7, day: 1 },
                        end: { year: 2026, month: 7, day: 16 },
                    })
                }
            >
                set-complete-range
            </button>
            <button
                type="button"
                onClick={() =>
                    onChange({
                        start: { year: 2026, month: 7, day: 1 },
                    })
                }
            >
                set-incomplete-range
            </button>
            <button type="button" onClick={() => onChange(null)}>
                clear-range
            </button>
        </div>
    ),
}));

describe("TransactionListFilters", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.toString.mockReturnValue("page=3&foo=bar");
    });

    it("hydrates the date range from the URL", () => {
        mocks.get.mockImplementation((key: string) =>
            key === "range" ? "2026-07-01,2026-07-16" : null,
        );

        render(<TransactionListFilters />);

        expect(screen.getByTestId("transactionsListDateRangeFilter")).toHaveTextContent("2026-2026");
    });

    it("pushes the serialized range and resets the page when the range is complete", () => {
        mocks.get.mockReturnValue(null);

        render(<TransactionListFilters />);
        fireEvent.click(screen.getByText("set-complete-range"));

        expect(mocks.push).toHaveBeenCalledWith(
            "/mi-perfil/transacciones?foo=bar&range=2026-07-01%2C2026-07-16",
        );
    });

    it("does not push when the user selects an incomplete range", () => {
        mocks.get.mockReturnValue(null);

        render(<TransactionListFilters />);
        fireEvent.click(screen.getByText("set-incomplete-range"));

        expect(mocks.push).not.toHaveBeenCalled();
    });

    it("removes the range and page params when the filter is cleared", () => {
        mocks.get.mockImplementation((key: string) =>
            key === "range" ? "2026-07-01,2026-07-16" : null,
        );

        render(<TransactionListFilters />);
        fireEvent.click(screen.getByText("clear-range"));

        expect(mocks.push).toHaveBeenCalledWith("/mi-perfil/transacciones?foo=bar");
    });
});
