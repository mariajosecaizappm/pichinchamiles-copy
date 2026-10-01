import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    exportTransactionsModalContent,
} from "@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/components/ExportTransactionsStatusModal/ExportTransactionsStatusModal";
import ExportTransactionsFormContainer from "@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/ExportTransactionsFormContainer";

const mocks = vi.hoisted(() => ({
    containerGet: vi.fn(),
    exportTransactions: vi.fn(),
    download: vi.fn(),
    openModal: vi.fn(),
}));

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/hooks/useDownload", () => ({
    default: () => ({
        download: mocks.download,
    }),
}));

vi.mock("@/presentation/components/Modal", () => ({
    useModal: () => ({
        openModal: mocks.openModal,
    }),
}));

vi.mock("@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/ExportTransactionsForm", () => ({
    default: ({
        onExportTransactions,
        alert,
    }: {
        onExportTransactions: (values: { startDate: Date | null; endDate: Date | null }) => Promise<void>;
        alert: (type: string) => void;
    }) => (
        <div>
            <button
                type="button"
                onClick={() =>
                    onExportTransactions({
                        startDate: new Date("2024-01-01T00:00:00.000Z"),
                        endDate: new Date("2024-02-01T00:00:00.000Z"),
                    })
                }
            >
                export-valid
            </button>
            <button
                type="button"
                onClick={() =>
                    onExportTransactions({
                        startDate: null,
                        endDate: null,
                    })
                }
            >
                export-empty
            </button>
            <button type="button" onClick={() => alert("review-dates")}>
                alert-review
            </button>
        </div>
    ),
}));

describe("ExportTransactionsFormContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.containerGet.mockReturnValue({
            exportTransactions: mocks.exportTransactions,
        });
    });

    it("does nothing when the export form does not provide both dates", async () => {
        render(<ExportTransactionsFormContainer />);

        fireEvent.click(screen.getByText("export-empty"));

        expect(mocks.exportTransactions).not.toHaveBeenCalled();
        expect(mocks.download).not.toHaveBeenCalled();
        expect(mocks.openModal).not.toHaveBeenCalled();
    });

    it("downloads the exported file and opens the ready modal when data is returned", async () => {
        mocks.exportTransactions.mockResolvedValueOnce("xls-content");
        render(<ExportTransactionsFormContainer />);

        fireEvent.click(screen.getByText("export-valid"));

        expect(mocks.exportTransactions).toHaveBeenCalledWith(
            new Date("2024-01-01T00:00:00.000Z"),
            new Date("2024-02-01T00:00:00.000Z"),
        );

        await waitFor(() => {
            expect(mocks.download).toHaveBeenCalledWith("xls-content");
            expect(mocks.openModal).toHaveBeenCalledWith(
                expect.any(Function),
                exportTransactionsModalContent["report-ready"],
                "exportTransactionsStatusModal",
            );
        });
    });

    it("opens the sent modal when the use case does not return downloadable content", async () => {
        mocks.exportTransactions.mockResolvedValueOnce(undefined);
        render(<ExportTransactionsFormContainer />);

        fireEvent.click(screen.getByText("export-valid"));

        await waitFor(() => {
            expect(mocks.download).not.toHaveBeenCalled();
            expect(mocks.openModal).toHaveBeenCalledWith(
                expect.any(Function),
                exportTransactionsModalContent["report-sent"],
                "exportTransactionsStatusModal",
            );
        });
    });

    it("uses the alert handler to open the matching status modal", () => {
        render(<ExportTransactionsFormContainer />);

        fireEvent.click(screen.getByText("alert-review"));

        expect(mocks.openModal).toHaveBeenCalledWith(
            expect.any(Function),
            exportTransactionsModalContent["review-dates"],
            "exportTransactionsStatusModal",
        );
    });
});
