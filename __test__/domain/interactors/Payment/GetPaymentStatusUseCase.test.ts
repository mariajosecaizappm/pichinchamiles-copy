import { describe, expect, it, vi } from "vitest";
import GetPaymentStatusUseCase from "@/domain/interactors/Payment/GetPaymentStatusUseCase";

describe("GetPaymentStatusUseCase", () => {
    it("loads pending transaction and basket in parallel", async () => {
        const paymentRepository = {
            getPendingTransaction: vi.fn().mockResolvedValue("ABC123"),
            getPaymentDetail: vi.fn(),
        } as any;
        const basketRepository = {
            getBasket: vi.fn().mockResolvedValue({ buyerId: "b", items: [] }),
        } as any;

        const useCase = new GetPaymentStatusUseCase(paymentRepository, basketRepository);
        const result = await useCase.getShoppingCartValues();

        expect(paymentRepository.getPendingTransaction).toHaveBeenCalledTimes(1);
        expect(basketRepository.getBasket).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
            pendingTransaction: "ABC123",
            basket: { buyerId: "b", items: [] },
        });
    });

    it("delegates payment detail lookup to the payment repository", async () => {
        const paymentRepository = {
            getPendingTransaction: vi.fn(),
            getPaymentDetail: vi.fn().mockResolvedValue({
                reference: "ABC123",
                status: "APPROVED",
                totalAmount: 12,
            }),
        } as any;
        const basketRepository = {
            getBasket: vi.fn(),
        } as any;

        const useCase = new GetPaymentStatusUseCase(paymentRepository, basketRepository);

        await expect(useCase.getPaymentDetail("ABC123")).resolves.toEqual({
            reference: "ABC123",
            status: "APPROVED",
            totalAmount: 12,
        });
        expect(paymentRepository.getPaymentDetail).toHaveBeenCalledWith("ABC123");
    });
});
