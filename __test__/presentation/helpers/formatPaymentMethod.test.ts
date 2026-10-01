import { describe, expect, it } from "vitest";
import { PaymentMethod } from "@/domain/entity/Payment/payment";
import {
    formatPaymentMethodPrice,
    formatPaymentMethodStock,
} from "@/presentation/helpers/formatPaymentMethod";

const baseItem = {
    quantity: 2,
    paymentMethod: PaymentMethod.POINTS,
    paymentTypes: {
        points: {
            currencyId: "points",
            amount: 2000,
        },
    },
    variationInfo: {
        stock: 3,
        pointsPrice: 1000,
        price: 100,
        copayment: {
            initialization: { points: 400, coins: 6 },
            minimumPointsValue: 20,
            pointsConversionRatePercentage: Buffer.from(
                Buffer.from("0.01").toString("base64")
            ).toString("base64"),
        },
    },
} as any;

describe("formatPaymentMethod", () => {
    it("should format stock for points payment", () => {
        expect(formatPaymentMethodStock(baseItem)).toEqual({
            points: {
                currencyId: "points",
                amount: 3000,
            },
        });
    });

    it("should format stock for copayment payment", () => {
        const item = {
            ...baseItem,
            paymentMethod: PaymentMethod.COPAYMENT,
            paymentTypes: {
                points: { currencyId: "points", amount: 1200 },
                coin: { currencyId: "usd", amount: 8 },
            },
        };

        expect(formatPaymentMethodStock(item)).toEqual({
            points: {
                currencyId: "points",
                amount: 1800,
            },
            coin: {
                currencyId: "usd",
                amount: 12,
            },
        });
    });

    it("should calculate copayment values", () => {
        const item = {
            ...baseItem,
            paymentMethod: PaymentMethod.COPAYMENT,
            paymentTypes: {
                points: { currencyId: "points", amount: 1000 },
                coin: { currencyId: "usd", amount: 10 },
            },
        };

        const result = formatPaymentMethodPrice(item);
        expect(result.points.currencyId).toBe("points");
        expect(result.coin?.currencyId).toBe("usd");
        expect(typeof result.points.amount).toBe("number");
        expect(typeof result.coin?.amount).toBe("number");
    });

    it("should fallback to points price when no copayment", () => {
        const item = {
            ...baseItem,
            paymentMethod: PaymentMethod.POINTS,
            variationInfo: { ...baseItem.variationInfo, copayment: undefined },
        };

        expect(formatPaymentMethodPrice(item)).toEqual({
            points: {
                currencyId: "points",
                amount: 2000,
            },
        });
    });
});

