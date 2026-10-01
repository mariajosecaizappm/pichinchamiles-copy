import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/domain/entity/Error/models/ApiError";
import { ErrorCode } from "@/domain/entity/Error/structure/error";
import {
    EXPORT_TRANSACTIONS_MAX_DATE,
    exportTransactionsFormSchema,
    getExportInitialTransactionsFormValues,
    onExportTransactionsFormError,
} from "@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/ExportTransactionsFormConfig";

describe("exportTransactionsFormConfig", () => {
    it("returns empty initial values", () => {
        expect(getExportInitialTransactionsFormValues()).toEqual({
            startDate: null,
            endDate: null,
        });
    });

    it("accepts a valid date range within the allowed max date", async () => {
        await expect(
            exportTransactionsFormSchema.validate({
                startDate: new Date("2024-02-01T00:00:00.000Z"),
                endDate: new Date("2024-03-01T00:00:00.000Z"),
            }),
        ).resolves.toEqual({
            startDate: new Date("2024-02-01T00:00:00.000Z"),
            endDate: new Date("2024-03-01T00:00:00.000Z"),
        });
    });

    it("rejects end dates earlier than the start date", async () => {
        await expect(
            exportTransactionsFormSchema.validate({
                startDate: new Date("2024-02-10T00:00:00.000Z"),
                endDate: new Date("2024-02-01T00:00:00.000Z"),
            }),
        ).rejects.toThrow("La fecha final debe ser posterior a la fecha inicial");
    });

    it("rejects dates after the allowed max export date", async () => {
        await expect(
            exportTransactionsFormSchema.validate({
                startDate: new Date("2024-03-03T00:00:00.000Z"),
                endDate: new Date("2024-03-04T00:00:00.000Z"),
            }),
        ).rejects.toThrow("Solo puedes seleccionar fechas hasta el 1 de marzo de 2024.");
    });

    it("opens the review dates alert for max-range errors", () => {
        const alert = vi.fn();

        onExportTransactionsFormError(
            new ApiError(ErrorCode.EXPORT_TRANSACTION_MAX_RANGE),
            alert,
        );

        expect(alert).toHaveBeenCalledWith("review-dates");
    });

    it("opens the reports not found alert for missing report errors", () => {
        const alert = vi.fn();

        onExportTransactionsFormError(
            new ApiError(ErrorCode.EXPORT_TRANSACTIONS_NOT_FOUND),
            alert,
        );

        expect(alert).toHaveBeenCalledWith("reports-not-found");
    });

    it("ignores unrelated errors", () => {
        const alert = vi.fn();

        onExportTransactionsFormError(new ApiError(ErrorCode.UNKNOWN), alert);

        expect(alert).not.toHaveBeenCalled();
    });
});
