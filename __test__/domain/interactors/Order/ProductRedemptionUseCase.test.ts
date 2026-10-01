import { describe, expect, it, vi } from "vitest";
import ProductRedemptionUseCase from "@/domain/interactors/Order/ProductRedemptionUseCase";
import RecaptchaService from "@/domain/services/RecaptchaService";

describe("ProductRedemptionUseCase", () => {
    it("requests otp using the expected recaptcha action", async () => {
        const orderRepository = {
            getProductRedemptionOtp: vi.fn().mockResolvedValue({ mfaToken: "token-1" }),
            productRedemption: vi.fn(),
        } as any;
        const getTokenSpy = vi
            .spyOn(RecaptchaService, "getToken")
            .mockResolvedValueOnce("recaptcha-token");

        const useCase = new ProductRedemptionUseCase(orderRepository);
        const result = await useCase.getProductOrderOtp();

        expect(getTokenSpy).toHaveBeenCalledWith("GetNameUserIdentification");
        expect(orderRepository.getProductRedemptionOtp).toHaveBeenCalledWith(
            "GetNameUserIdentification",
            "recaptcha-token"
        );
        expect(result).toEqual({ mfaToken: "token-1" });

        getTokenSpy.mockRestore();
    });

    it("delegates product redemption to the repository", async () => {
        const processedOrder = {
            paymentGatewayReference: "REF-1",
            balanceAfterOperation: 10,
            placeToPayUrl: "",
        };
        const orderRepository = {
            getProductRedemptionOtp: vi.fn(),
            productRedemption: vi.fn().mockResolvedValue(processedOrder),
        } as any;
        const useCase = new ProductRedemptionUseCase(orderRepository);
        const order = { basket: { items: [] } } as any;

        await expect(useCase.productRedemption(order, "session-1")).resolves.toEqual(
            processedOrder
        );
        expect(orderRepository.productRedemption).toHaveBeenCalledWith(order, "session-1");
    });
});
