import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ExportTransactionsForm from "@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/ExportTransactionsForm";

const mocks = vi.hoisted(() => ({
    form: vi.fn(),
}));

vi.mock("@/presentation/components/Form/context/Form", () => ({
    default: (props: Record<string, unknown>) => {
        mocks.form(props);
        return <div data-testid="form">{props.children as React.ReactNode}</div>;
    },
}));

vi.mock("@/presentation/components/Form/components/Checkbox", () => ({
    Checkbox: ({
        label,
        isSelected,
        onValueChange,
        testId,
    }: {
        label: string;
        isSelected: boolean;
        onValueChange: (value: boolean) => void;
        testId: string;
    }) => (
        <button
            data-testid={testId}
            type="button"
            onClick={() => onValueChange(!isSelected)}
        >
            {label}
        </button>
    ),
}));

vi.mock("@/presentation/components/Form/controls/FormDateRangePicker", () => ({
    FormDateRangePicker: ({ testId, label }: { testId: string; label: string }) => (
        <div data-testid={testId}>{label}</div>
    ),
}));

vi.mock("@/presentation/components/Form/controls/FormButton", () => ({
    default: ({ children, testId }: { children: React.ReactNode; testId: string }) => (
        <button data-testid={testId} type="button">
            {children}
        </button>
    ),
}));

describe("ExportTransactionsForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the export checkbox and hides the extended form by default", () => {
        render(
            <ExportTransactionsForm
                onExportTransactions={vi.fn()}
                alert={vi.fn()}
            />,
        );

        expect(screen.getByTestId("exportTransactions")).toBeInTheDocument();
        expect(screen.queryByTestId("exportTransactionsDateRangePicker")).not.toBeInTheDocument();
        expect(screen.queryByTestId("exportTransactionsButton")).not.toBeInTheDocument();
    });

    it("shows the date range picker and download button after enabling export", () => {
        render(
            <ExportTransactionsForm
                onExportTransactions={vi.fn()}
                alert={vi.fn()}
            />,
        );

        fireEvent.click(screen.getByTestId("exportTransactions"));

        expect(screen.getByText("Transacciones disponibles hasta el 1 de marzo de 2024.")).toBeInTheDocument();
        expect(screen.getByTestId("exportTransactionsDateRangePicker")).toBeInTheDocument();
        expect(screen.getByTestId("exportTransactionsButton")).toHaveTextContent("Descargar");
    });

    it("passes initial values and handlers to the shared Form component", () => {
        const onExportTransactions = vi.fn();
        const alert = vi.fn();

        render(
            <ExportTransactionsForm
                onExportTransactions={onExportTransactions}
                alert={alert}
            />,
        );

        expect(mocks.form).toHaveBeenCalledWith(
            expect.objectContaining({
                initialValues: {
                    startDate: null,
                    endDate: null,
                },
                onSubmit: onExportTransactions,
                onError: expect.any(Function),
            }),
        );
    });
});
