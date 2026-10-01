import { describe, expect, it } from "vitest";
import { getBankStatementAdapter } from "@/data/adapters/Transaction/bankStatementAdapter";

describe("bankStatementAdapter", () => {
    it("maps summary groups into bank statement totals", () => {
        const createdAt = "2026-07-16T12:00:00";

        const result = getBankStatementAdapter({
            memberUserTotalBalance: 1450,
            createdAt,
            accreditationSummary: [
                { transactionType: "Consumptions", pointsAmount: 500 },
                { transactionType: "Promotions", pointsAmount: 250 },
                { transactionType: "Receive", pointsAmount: 100 },
            ],
            debitSummary: [
                { transactionType: "Travels", pointsAmount: -200 },
                { transactionType: "Products", pointsAmount: -150 },
                { transactionType: "Donations", pointsAmount: -50 },
                { transactionType: "Others", pointsAmount: -25 },
                { transactionType: "Send", pointsAmount: -75 },
            ],
        });

        expect(result).toEqual({
            balance: 1450,
            createdAt: new Date(createdAt),
            accreditations: {
                totalPoints: 750,
                consumptions: 500,
                promos: 250,
                receivedTransfers: 100,
            },
            debits: {
                totalPoints: 425,
                travels: 200,
                products: 150,
                donations: 50,
                others: 25,
                sentTransfers: 75,
            },
        });
    });

    it("defaults missing transaction groups to zero", () => {
        const result = getBankStatementAdapter({
            memberUserTotalBalance: 0,
            createdAt: "2026-07-16T12:00:00",
            accreditationSummary: [],
            debitSummary: [],
        });

        expect(result.accreditations).toEqual({
            totalPoints: 0,
            consumptions: 0,
            promos: 0,
            receivedTransfers: 0,
        });
        expect(result.debits).toEqual({
            totalPoints: 0,
            travels: 0,
            products: 0,
            donations: 0,
            others: 0,
            sentTransfers: 0,
        });
    });
});
