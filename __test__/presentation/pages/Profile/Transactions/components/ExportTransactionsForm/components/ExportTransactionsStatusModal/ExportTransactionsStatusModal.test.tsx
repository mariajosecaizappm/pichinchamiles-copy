import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ExportTransactionsStatusModal, {
    exportTransactionsModalContent,
} from "@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/components/ExportTransactionsStatusModal/ExportTransactionsStatusModal";

vi.mock("@/presentation/components/Modal", () => ({
    default: ({
        children,
        onClose,
    }: {
        children: React.ReactNode;
        onClose: (nextIsOpen: boolean) => void;
    }) => (
        <div data-testid="modal">
            <button type="button" onClick={() => onClose(false)}>
                close-modal
            </button>
            {children}
        </div>
    ),
}));

vi.mock("@/presentation/components/Form/components/Button/Button", () => ({
    default: ({
        children,
        onPress,
    }: {
        children: React.ReactNode;
        onPress: () => void;
    }) => (
        <button type="button" onClick={onPress}>
            {children}
        </button>
    ),
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/StatusIcon/SuccessIcon", () => ({
    default: () => <div data-testid="success-icon" />,
}));

vi.mock("@/presentation/pages/ShoppingCartDetail/components/ShoppingCartStatusModal/components/StatusIcon/ErrorIcon", () => ({
    default: () => <div data-testid="error-icon" />,
}));

describe("ExportTransactionsStatusModal", () => {
    it("renders the success content and closes from the accept button", () => {
        const onClose = vi.fn();

        render(
            <ExportTransactionsStatusModal
                isActive
                onClose={onClose}
                {...exportTransactionsModalContent["report-ready"]}
            />,
        );

        expect(screen.getByTestId("success-icon")).toBeInTheDocument();
        expect(screen.getByText("Tu reporte está listo")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Aceptar"));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("renders the error content and closes when the modal requests closing", () => {
        const onClose = vi.fn();

        render(
            <ExportTransactionsStatusModal
                isActive
                onClose={onClose}
                {...exportTransactionsModalContent["review-dates"]}
            />,
        );

        expect(screen.getByTestId("error-icon")).toBeInTheDocument();
        expect(screen.getByText("Revisa las fechas")).toBeInTheDocument();
        fireEvent.click(screen.getByText("close-modal"));

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
