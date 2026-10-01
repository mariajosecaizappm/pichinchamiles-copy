import { describe, expect, it } from "vitest";
import { TransactionStatus, TransactionTypes } from "@/domain/entity/Transaction/transaction";
import { getTransactionsAdapter } from "@/data/adapters/Transaction/transactionAdapter";

describe("transactionAdapter", () => {
    it("maps transaction entities and normalizes pagination to one-based pages", () => {
        const result = getTransactionsAdapter({
            entities: [
                {
                    number: 123,
                    pointsAmount: -1200,
                    balanceAfterOperation: 800,
                    transactionType: TransactionTypes.ProductRedemption,
                    status: TransactionStatus.APPROVED,
                    createAt: "2026-07-15T10:00:00",
                    details: [
                        {
                            name: "Producto 1",
                            quantity: 2,
                            totalPoints: 1000,
                            totalCoins: 10,
                        },
                    ],
                },
                {
                    number: 124,
                    pointsAmount: 300,
                    balanceAfterOperation: 1100,
                    transactionType: TransactionTypes.Accreditation,
                    status: TransactionStatus.PENDING,
                    createAt: "2026-07-16T09:00:00",
                },
            ],
            pagination: {
                page: 0,
                total: 31,
                pageSize: 15,
            },
        });

        expect(result).toEqual({
            data: [
                {
                    number: 123,
                    pointsAmount: -1200,
                    balanceAfterOperation: 800,
                    transactionType: TransactionTypes.ProductRedemption,
                    status: TransactionStatus.APPROVED,
                    createAt: "2026-07-15T10:00:00",
                    details: [
                        {
                            name: "Producto 1",
                            quantity: 2,
                            totalPoints: 1000,
                            totalCoins: 10,
                        },
                    ],
                },
                {
                    number: 124,
                    pointsAmount: 300,
                    balanceAfterOperation: 1100,
                    transactionType: TransactionTypes.Accreditation,
                    status: TransactionStatus.PENDING,
                    createAt: "2026-07-16T09:00:00",
                    details: undefined,
                },
            ],
            pagination: {
                page: 1,
                total: 31,
                pageSize: 15,
                totalPages: 3,
            },
        });
    });
});
