import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    axGet: vi.fn(),
    getPendingTransaction: vi.fn(),
    getPaymentDetailAdapter: vi.fn(),
    getFeePaymentDetailAdapter: vi.fn(),
}));

vi.mock("@/data/adapters/Payment/paymentAdapter", () => ({
    getPendingTransaction: mocks.getPendingTransaction,
    getPaymentDetailAdapter: mocks.getPaymentDetailAdapter,
    getFeePaymentDetailAdapter: mocks.getFeePaymentDetailAdapter,
}));

vi.mock("@/data/provider/axios/axiosPrivate", () => ({
    default: {
        get: mocks.axGet,
    },
}));

describe("PaymentRepository", () => {
    beforeEach(() => {
        mocks.axGet.mockReset();
        mocks.getPendingTransaction.mockReset();
        mocks.getPaymentDetailAdapter.mockReset();
        mocks.getFeePaymentDetailAdapter.mockReset();
        process.env.NEXT_PUBLIC_PROGRAM_ID = "test-program-id";
        vi.clearAllMocks();
    });

    it("requests pending transaction endpoint and adapts response", async () => {
        vi.resetModules();
        mocks.getPendingTransaction.mockReturnValueOnce("ABC123");
        mocks.axGet.mockResolvedValueOnce({ data: { reference: "ABC123" } });

        const { default: PaymentRepository } = await import("@/data/repository/Payment/PaymentRepository");
        const repository = new PaymentRepository();
        const result = await repository.getPendingTransaction();

        const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id";
        expect(mocks.axGet).toHaveBeenCalledWith(
            `/payments-api/placetopay/${programId}/transactions/pending`
        );
        expect(mocks.getPendingTransaction).toHaveBeenCalledWith({ reference: "ABC123" });
        expect(result).toBe("ABC123");
    });

    it("requests payment detail endpoint and adapts response", async () => {
        vi.resetModules();
        mocks.getPaymentDetailAdapter.mockReturnValueOnce({
            reference: "ABC123",
            status: "APPROVED",
            totalAmount: 12,
        });
        mocks.axGet.mockResolvedValueOnce({
            data: { reference: "ABC123", status: "APPROVED", totalAmount: 12 },
        });

        const { default: PaymentRepository } = await import("@/data/repository/Payment/PaymentRepository");
        const repository = new PaymentRepository();
        const result = await repository.getPaymentDetail("ABC123");

        const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id";
        expect(mocks.axGet).toHaveBeenCalledWith(
            `/payments-api/placetopay/${programId}/transactions/lightbox/ABC123`
        );
        expect(mocks.getPaymentDetailAdapter).toHaveBeenCalledWith({
            reference: "ABC123",
            status: "APPROVED",
            totalAmount: 12,
        });
        expect(result).toEqual({
            reference: "ABC123",
            status: "APPROVED",
            totalAmount: 12,
        });
    });

    it("requests fee payment detail endpoint (v2) and adapts response", async () => {
        vi.resetModules();
        mocks.getFeePaymentDetailAdapter.mockReturnValueOnce({
            reference: "FEE123",
            status: "APPROVED",
            totalAmount: 25.5,
        });
        mocks.axGet.mockResolvedValueOnce({
            data: { reference: "FEE123", status: "APPROVED", totalAmount: 25.5 },
        });

        const { default: PaymentRepository } = await import("@/data/repository/Payment/PaymentRepository");
        const repository = new PaymentRepository();
        const result = await repository.getFeePaymentDetail("FEE123");

        const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || "test-program-id";
        expect(mocks.axGet).toHaveBeenCalledWith(
            `/payments-api/placetopay/${programId}/v2/transactions/lightbox/FEE123`
        );
        expect(mocks.getFeePaymentDetailAdapter).toHaveBeenCalledWith({
            reference: "FEE123",
            status: "APPROVED",
            totalAmount: 25.5,
        });
        expect(result).toEqual({
            reference: "FEE123",
            status: "APPROVED",
            totalAmount: 25.5,
        });
    });
});
