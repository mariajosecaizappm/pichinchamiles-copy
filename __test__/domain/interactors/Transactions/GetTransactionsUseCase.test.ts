import { describe, expect, it, vi } from "vitest";
import GetTransactionsUseCase from "@/domain/interactors/Transactions/GetTransactionsUseCase";

describe("GetTransactionsUseCase", () => {
    it("delegates getTransactions to the repository", async () => {
        const params = {
            page: 2,
            pageSize: 15,
            startDate: new Date("2026-07-01T00:00:00.000Z"),
            endDate: new Date("2026-07-16T00:00:00.000Z"),
        };
        const transactions = {
            data: [],
            pagination: {
                page: 2,
                pageSize: 15,
                total: 0,
                totalPages: 0,
            },
        };

        const repository = {
            getBankStatement: vi.fn(),
            exportTransactions: vi.fn(),
            getTransactions: vi.fn().mockResolvedValueOnce(transactions),
        };

        const useCase = new GetTransactionsUseCase(repository as any);
        const result = await useCase.getTransactions(params);

        expect(result).toEqual(transactions);
        expect(repository.getTransactions).toHaveBeenCalledWith(params);
    });
});
