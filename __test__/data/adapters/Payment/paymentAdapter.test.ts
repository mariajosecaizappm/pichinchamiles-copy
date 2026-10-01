import { describe, expect, it } from "vitest";
import {
    getFeePaymentDetailAdapter,
    getPaymentDetailAdapter,
    getPendingTransaction,
} from "@/data/adapters/Payment/paymentAdapter";

describe("paymentAdapter", () => {
    it("returns reference when present", () => {
        expect(getPendingTransaction({ reference: "ABC123" })).toBe("ABC123");
    });

    it("returns empty string when reference is missing", () => {
        expect(getPendingTransaction({})).toBe("");
        expect(getPendingTransaction(null)).toBe("");
    });

    it("adapts payment detail fields", () => {
        expect(
            getPaymentDetailAdapter({
                reference: "ABC123",
                status: "APPROVED",
                totalAmount: 45.9,
                ignored: true,
            })
        ).toEqual({
            reference: "ABC123",
            status: "APPROVED",
            totalAmount: 45.9,
        });
    });

    it("keeps decimal payment amounts returned as strings", () => {
        expect(
            getPaymentDetailAdapter({
                reference: "ABC123",
                status: "APPROVED",
                totalAmount: "10.39",
            })
        ).toEqual({
            reference: "ABC123",
            status: "APPROVED",
            totalAmount: 10.39,
        });
    });

    it("adapts fee payment detail fields with status", () => {
        expect(
            getFeePaymentDetailAdapter({
                reference: "FEE123",
                status: "APPROVED",
                totalAmount: 25.5,
                ignored: "field",
            })
        ).toEqual({
            reference: "FEE123",
            status: "APPROVED",
            totalAmount: 25.5,
        });
    });

    it("adapts fee payment detail fields with null status when missing", () => {
        expect(
            getFeePaymentDetailAdapter({
                reference: "FEE456",
                totalAmount: 15.0,
            })
        ).toEqual({
            reference: "FEE456",
            status: null,
            totalAmount: 15.0,
        });
    });
});
