import { describe, expect, it } from "vitest";
import { TransactionStatus, TransactionTypes } from "@/domain/entity/Transaction/transaction";
import {
    formatTransactionDate,
    getStatusTexColor,
    getTransactionDateKey,
    getTransactionOperation,
    groupTransactionsByDate,
    isSameTransaction,
    transactionsLabel,
} from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/helpers";

describe("transactions list grid helpers", () => {
    it("resolves labels and operations for known transaction slugs", () => {
        expect(transactionsLabel.product_redemption).toBe("Canje de productos");
        expect(getTransactionOperation(TransactionTypes.Accreditation)).toBe("increment");
        expect(getTransactionOperation(TransactionTypes.ProductRedemption)).toBe("decrement");
        expect(getTransactionOperation(undefined)).toBeUndefined();
    });

    it("formats and normalizes transaction dates", () => {
        expect(getTransactionDateKey("2026-07-16T09:30:00")).toBe("2026-07-16");
        expect(getTransactionDateKey(undefined)).toBe("unknown");
        expect(formatTransactionDate("2026-07-16T09:30:00")).toContain("16 de julio de 2026");
        expect(formatTransactionDate("invalid-date")).toBe("Sin fecha");
    });

    it("groups transactions by date while preserving insertion order", () => {
        const transactions = [
            {
                number: 1,
                pointsAmount: -10,
                balanceAfterOperation: 100,
                transactionType: TransactionTypes.ProductRedemption,
                status: TransactionStatus.APPROVED,
                createAt: "2026-07-16T09:30:00",
            },
            {
                number: 2,
                pointsAmount: -20,
                balanceAfterOperation: 80,
                transactionType: TransactionTypes.ProductRedemption,
                status: TransactionStatus.PENDING,
                createAt: "2026-07-16T12:30:00",
            },
            {
                number: 3,
                pointsAmount: 15,
                balanceAfterOperation: 95,
                transactionType: TransactionTypes.Accreditation,
                status: TransactionStatus.APPROVED,
                createAt: "2026-07-15T08:00:00",
            },
        ] as any;

        const result = groupTransactionsByDate(transactions);

        expect(result).toHaveLength(2);
        expect(result[0]).toMatchObject({
            dateKey: "2026-07-16",
            transactions: [transactions[0], transactions[1]],
        });
        expect(result[1]).toMatchObject({
            dateKey: "2026-07-15",
            transactions: [transactions[2]],
        });
    });

    it("identifies the same transaction by number, type and date", () => {
        const transaction = {
            number: 1,
            transactionType: TransactionTypes.ProductRedemption,
            createAt: "2026-07-16T09:30:00",
        } as any;

        expect(isSameTransaction(transaction, { ...transaction })).toBe(true);
        expect(isSameTransaction(transaction, {
            ...transaction,
            transactionType: TransactionTypes.TransferSend,
        })).toBe(false);
        expect(isSameTransaction(null, transaction)).toBe(false);
    });

    it("returns the correct text color based on status and operation", () => {
        expect(
            getStatusTexColor({
                transactionType: TransactionTypes.ProductRedemption,
                status: TransactionStatus.APPROVED,
            } as any),
        ).toBe("text-neutral-950");

        expect(
            getStatusTexColor({
                transactionType: TransactionTypes.Accreditation,
                status: TransactionStatus.APPROVED,
            } as any),
        ).toBe("text-success-500");

        expect(
            getStatusTexColor({
                transactionType: TransactionTypes.Accreditation,
                status: TransactionStatus.REJECTED,
            } as any),
        ).toBe("text-error-500");
    });
});
