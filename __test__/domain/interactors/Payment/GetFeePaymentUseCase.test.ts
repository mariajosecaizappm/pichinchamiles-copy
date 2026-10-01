import { describe, expect, it, vi } from "vitest";
import GetFeePaymentUseCase from "@/domain/interactors/Payment/GetFeePaymentUseCase";
import { PaymentStatus } from "@/domain/entity/Payment/payment";

describe("GetFeePaymentUseCase", () => {
    it("delegates fee payment detail lookup to the payment repository", async () => {
        const paymentRepository = {
            getFeePaymentDetail: vi.fn().mockResolvedValue({
                reference: "FEE123",
                status: PaymentStatus.SUCCESS,
                totalAmount: 25.5,
            }),
        } as any;

        const useCase = new GetFeePaymentUseCase(paymentRepository);

        await expect(useCase.getFeePaymentDetail("FEE123")).resolves.toEqual({
            reference: "FEE123",
            status: PaymentStatus.SUCCESS,
            totalAmount: 25.5,
        });
        expect(paymentRepository.getFeePaymentDetail).toHaveBeenCalledWith("FEE123");
    });

    it("returns fee payment detail with null status when transaction is not found", async () => {
        const paymentRepository = {
            getFeePaymentDetail: vi.fn().mockResolvedValue({
                reference: "FEE456",
                status: null,
                totalAmount: 0,
            }),
        } as any;

        const useCase = new GetFeePaymentUseCase(paymentRepository);

        const result = await useCase.getFeePaymentDetail("FEE456");
        expect(result.status).toBeNull();
        expect(result.reference).toBe("FEE456");
    });

    it("passes reference parameter directly to repository", async () => {
        const paymentRepository = {
            getFeePaymentDetail: vi.fn().mockResolvedValue({
                reference: "REF789",
                status: PaymentStatus.PENDING,
                totalAmount: 10.0,
            }),
        } as any;

        const useCase = new GetFeePaymentUseCase(paymentRepository);
        await useCase.getFeePaymentDetail("REF789");

        expect(paymentRepository.getFeePaymentDetail).toHaveBeenCalledTimes(1);
        expect(paymentRepository.getFeePaymentDetail).toHaveBeenCalledWith("REF789");
    });
});
