import { describe, expect, it, vi } from "vitest";
import ExportTransactionsUseCase from "@/domain/interactors/Transactions/ExportTransactionsUseCase";

describe("ExportTransactionsUseCase", () => {
    it("delegates exportTransactions to the repository", async () => {
        const startDate = new Date("2026-01-01T00:00:00.000Z");
        const endDate = new Date("2026-06-01T00:00:00.000Z");

        const repository = {
            getBankStatement: vi.fn(),
            exportTransactions: vi.fn().mockResolvedValueOnce("file-content"),
            getTransactions: vi.fn(),
        };

        const useCase = new ExportTransactionsUseCase(repository as any);
        const result = await useCase.exportTransactions(startDate, endDate);

        expect(result).toBe("file-content");
        expect(repository.exportTransactions).toHaveBeenCalledWith(startDate, endDate);
    });
});
