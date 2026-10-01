import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    axPost: vi.fn(),
    productRedemptionAdapter: vi.fn(),
    generateIdempotencyHash: vi.fn(),
    getOtp: vi.fn(),
}));

vi.mock("@/data/adapters/Order/orderAdapter", () => ({
    productRedemptionAdapter: mocks.productRedemptionAdapter,
    generateIdempotencyHash: mocks.generateIdempotencyHash,
}));

vi.mock("@/data/adapters/Auth/authAdapters", () => ({
    getOtp: mocks.getOtp,
}));

vi.mock("@/data/provider/axios/axiosPrivate", () => ({
    default: {
        post: mocks.axPost,
    },
}));

describe("OrderRepository", () => {
    beforeEach(() => {
        process.env.NEXT_PUBLIC_PROGRAM_ID = "test-program-id";
        mocks.axPost.mockReset();
        mocks.productRedemptionAdapter.mockReset();
        mocks.generateIdempotencyHash.mockReset();
        mocks.getOtp.mockReset();
        vi.clearAllMocks();
    });

    it("posts checkout payload with idempotency key", async () => {
        vi.resetModules();
        mocks.productRedemptionAdapter.mockReturnValueOnce({ items: [{ id: "1" }] });
        mocks.generateIdempotencyHash.mockReturnValueOnce("hash-123");
        mocks.axPost.mockResolvedValueOnce({
            data: {
                paymentGatewayReference: "REF-1",
                balanceAfterOperation: 50,
                placeToPayUrl: "",
            },
        });

        const { default: OrderRepository } = await import("@/data/repository/Order/OrderRepository");
        const repository = new OrderRepository();
        const order = { basket: { buyerId: "buyer-1", items: [] } } as any;

        const result = await repository.productRedemption(order, "session-1");

        expect(mocks.productRedemptionAdapter).toHaveBeenCalledWith(
            order,
            "session-1",
            "test-program-id"
        );
        expect(mocks.generateIdempotencyHash).toHaveBeenCalledWith(
            { items: [{ id: "1" }] },
            "test-program-id"
        );
        expect(mocks.axPost).toHaveBeenCalledWith(
            "/baskets-api/test-program-id/baskets/v3/checkout",
            {
                items: [{ id: "1" }],
                idempotencyKey: "hash-123",
            }
        );
        expect(result).toEqual({
            paymentGatewayReference: "REF-1",
            balanceAfterOperation: 50,
            placeToPayUrl: "",
        });
    });

    it("requests product redemption otp with recaptcha headers", async () => {
        vi.resetModules();
        mocks.axPost.mockResolvedValueOnce({ data: { otp: "raw-otp" } });
        mocks.getOtp.mockReturnValueOnce({ mfaToken: "mfa-token" });

        const { default: OrderRepository } = await import("@/data/repository/Order/OrderRepository");
        const repository = new OrderRepository();

        const result = await repository.getProductRedemptionOtp(
            "GetNameUserIdentification",
            "recaptcha-token"
        );

        expect(mocks.axPost).toHaveBeenCalledWith(
            "/identity-api/test-program-id/users/members/transactions/generate-otp",
            {
                otpOperationType: "PRODUCT_REDEMPTION_TRANSACTION",
            },
            {
                headers: {
                    Recaptchaaction: "GetNameUserIdentification",
                    Recaptchatoken: "recaptcha-token",
                },
            }
        );
        expect(mocks.getOtp).toHaveBeenCalledWith({ otp: "raw-otp" });
        expect(result).toEqual({ mfaToken: "mfa-token" });
    });
});
