import { describe, expect, it } from "vitest";
import TransactionsFromIndex from "@/presentation/pages/Profile/Transactions";
import TransactionsDirect from "@/presentation/pages/Profile/Transactions/Transactions";

describe("Transactions index", () => {
    it("re-exports the Transactions page component", () => {
        expect(TransactionsFromIndex).toBe(TransactionsDirect);
    });
});
