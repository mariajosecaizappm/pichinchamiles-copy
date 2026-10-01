import { describe, expect, it, vi } from "vitest";
import GetBankStatementUseCase from "@/domain/interactors/Transactions/GetBankStatementUseCase";

describe("GetBankStatementUseCase", () => {
    it("delegates getBankStatement to the repository", async () => {
        const bankStatement = {
            balance: 1200,
            createdAt: new Date("2026-07-16T12:00:00.000Z"),
            accreditations: {
                totalPoints: 700,
                consumptions: 500,
                promos: 200,
                receivedTransfers: 0,
            },
            debits: {
                totalPoints: 300,
                travels: 100,
                products: 100,
                donations: 50,
                others: 50,
                sentTransfers: 0,
            },
        };

        const repository = {
            getBankStatement: vi.fn().mockResolvedValueOnce(bankStatement),
            exportTransactions: vi.fn(),
            getTransactions: vi.fn(),
        };

        const useCase = new GetBankStatementUseCase(repository as any);
        const result = await useCase.getBankStatement();

        expect(result).toEqual(bankStatement);
        expect(repository.getBankStatement).toHaveBeenCalledTimes(1);
    });
});
