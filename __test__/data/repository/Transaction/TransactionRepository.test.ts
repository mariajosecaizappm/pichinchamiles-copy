import { beforeAll, afterEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../../../../__mocks__/server";
import { ErrorCode } from "@/domain/entity/Error/structure/error";
import { TransactionStatus, TransactionTypes } from "@/domain/entity/Transaction/transaction";

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: vi.fn(),
        bind: vi.fn().mockReturnThis(),
        to: vi.fn(),
    },
}));

import TransactionRepository from "@/data/repository/Transaction/TransactionRepository";

describe("TransactionRepository", () => {
    const baseUrl = "http://localhost:3000";
    const programId = "test-program-id";
    const pointsTransactionsPrefix = "/points-transactions-api";
    const historyPrefix = "/history-api";

    let repository: TransactionRepository;

    beforeAll(() => {
        repository = new TransactionRepository();
    });

    afterEach(() => {
        server.resetHandlers();
        localStorage.clear();
    });

    it("gets and adapts the bank statement summary", async () => {
        const url = `${baseUrl}${pointsTransactionsPrefix}/${programId}/users/members/balance/summary`;

        server.use(
            http.get(url, () =>
                HttpResponse.json({
                    memberUserTotalBalance: 900,
                    createdAt: "2026-07-16T12:00:00",
                    accreditationSummary: [
                        { transactionType: "Consumptions", pointsAmount: 400 },
                        { transactionType: "Promotions", pointsAmount: 100 },
                        { transactionType: "Receive", pointsAmount: 50 },
                    ],
                    debitSummary: [
                        { transactionType: "Travels", pointsAmount: -300 },
                        { transactionType: "Products", pointsAmount: -100 },
                        { transactionType: "Others", pointsAmount: -25 },
                    ],
                }),
            ),
        );

        const result = await repository.getBankStatement();

        expect(result).toEqual({
            balance: 900,
            createdAt: new Date("2026-07-16T12:00:00"),
            accreditations: {
                totalPoints: 500,
                consumptions: 400,
                promos: 100,
                receivedTransfers: 50,
            },
            debits: {
                totalPoints: 425,
                travels: 300,
                products: 100,
                donations: 0,
                others: 25,
                sentTransfers: 0,
            },
        });
    });

    it("exports transactions when the requested range is valid", async () => {
        const startDate = new Date("2026-01-01T00:00:00.000Z");
        const endDate = new Date("2026-06-01T00:00:00.000Z");
        const url = `${baseUrl}${pointsTransactionsPrefix}/${programId}/transactions/transaction-history`;

        server.use(
            http.get(url, ({ request }) => {
                const requestUrl = new URL(request.url);

                expect(requestUrl.searchParams.get("startDate")).toBe("2026-01-01T00:00:00.000");
                expect(requestUrl.searchParams.get("endDate")).toBe("2026-06-01T00:00:00.000");

                return HttpResponse.text("excel-content");
            }),
        );

        const result = await repository.exportTransactions(startDate, endDate);

        expect(result).toBe("excel-content");
    });

    it("throws EXPORT_TRANSACTION_MAX_RANGE when the requested range exceeds one year", async () => {
        await expect(
            repository.exportTransactions(
                new Date("2024-01-01T00:00:00.000Z"),
                new Date("2025-02-01T00:00:00.000Z"),
            ),
        ).rejects.toMatchObject({
            code: ErrorCode.EXPORT_TRANSACTION_MAX_RANGE,
            message: "EXPORT_TRANSACTION_MAX_RANGE",
        });
    });

    it("throws EXPORT_TRANSACTIONS_NOT_FOUND when the API responds with 204", async () => {
        const startDate = new Date("2026-01-01T00:00:00.000Z");
        const endDate = new Date("2026-06-01T00:00:00.000Z");
        const url = `${baseUrl}${pointsTransactionsPrefix}/${programId}/transactions/transaction-history`;

        server.use(
            http.get(url, () => new HttpResponse(null, { status: 204 })),
        );

        await expect(repository.exportTransactions(startDate, endDate)).rejects.toMatchObject({
            code: ErrorCode.EXPORT_TRANSACTIONS_NOT_FOUND,
            message: "EXPORT_TRANSACTIONS_NOT_FOUND",
        });
    });

    it("gets paginated transactions and sends zero-based page param to the API", async () => {
        const url = `${baseUrl}${historyPrefix}/${programId}/bank-statements/movements`;

        server.use(
            http.get(url, ({ request }) => {
                const requestUrl = new URL(request.url);

                expect(requestUrl.searchParams.get("page")).toBe("1");
                expect(requestUrl.searchParams.get("pageSize")).toBe("15");

                return HttpResponse.json({
                    entities: [
                        {
                            number: 77,
                            pointsAmount: -300,
                            balanceAfterOperation: 700,
                            transactionType: TransactionTypes.ProductRedemption,
                            status: TransactionStatus.APPROVED,
                            createAt: "2026-07-16T09:00:00",
                            details: [
                                {
                                    name: "Producto canjeado",
                                    quantity: 1,
                                    totalPoints: 300,
                                    totalCoins: 0,
                                },
                            ],
                        },
                    ],
                    pagination: {
                        page: 1,
                        total: 16,
                        pageSize: 15,
                    },
                });
            }),
        );

        const result = await repository.getTransactions({
            page: 2,
            pageSize: 15,
        });

        expect(result).toEqual({
            data: [
                {
                    number: 77,
                    pointsAmount: -300,
                    balanceAfterOperation: 700,
                    transactionType: TransactionTypes.ProductRedemption,
                    status: TransactionStatus.APPROVED,
                    createAt: "2026-07-16T09:00:00",
                    details: [
                        {
                            name: "Producto canjeado",
                            quantity: 1,
                            totalPoints: 300,
                            totalCoins: 0,
                        },
                    ],
                },
            ],
            pagination: {
                page: 2,
                total: 16,
                pageSize: 15,
                totalPages: 2,
            },
        });
    });
});
