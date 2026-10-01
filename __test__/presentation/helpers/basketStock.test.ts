import { describe, expect, it } from "vitest";
import { PaymentMethod } from "@/domain/entity/Payment/payment";
import { ProductType } from "@/domain/entity/Product/product";
import { BasketItem } from "@/domain/entity/Basket/structure/basket";
import {
    applyConsolidatedStockLimits,
    clampBasketItemQuantity,
    exceedsConsolidatedStock,
    getConsolidatedQuantity,
    getMaxQuantityForBasketItem,
} from "@/presentation/helpers/basketStock";

const createItem = (overrides: Partial<BasketItem> = {}): BasketItem =>
    ({
        id: "1",
        storeId: "store",
        supplierId: "supplier",
        productId: "product-a",
        variationId: "variation-gray",
        categoryId: "cat",
        quantity: 1,
        brandName: "Brand",
        categoryName: "Cat",
        paymentMethod: PaymentMethod.POINTS,
        productType: ProductType.PHYSICAL_PRODUCT,
        description: "desc",
        slug: "slug",
        isAvailability: true,
        options: [],
        variationInfo: {
            productName: "Producto A",
            productSlug: "producto-a",
            stock: 6,
            price: 10,
            pointsPrice: 1000,
            taxes: 0,
            assets: [],
            features: [],
        },
        paymentTypes: {
            points: { currencyId: "pts", amount: 1000 },
        },
        ...overrides,
    }) as BasketItem;

describe("basketStock", () => {
    it("should sum quantities across payment methods for the same product and variation", () => {
        const items = [
            createItem({ id: "1", quantity: 4, paymentMethod: PaymentMethod.POINTS }),
            createItem({
                id: "2",
                quantity: 2,
                paymentMethod: PaymentMethod.COPAYMENT,
                paymentTypes: {
                    points: { currencyId: "pts", amount: 500 },
                    coin: { currencyId: "usd", amount: 5 },
                },
            }),
        ];

        expect(getConsolidatedQuantity(items, "product-a", "variation-gray")).toBe(6);
        expect(getMaxQuantityForBasketItem(items, items[0])).toBe(4);
        expect(getMaxQuantityForBasketItem(items, items[1])).toBe(2);
        expect(exceedsConsolidatedStock(items, items[0])).toBe(false);
    });

    it("should keep stock independent for different variations", () => {
        const items = [
            createItem({ id: "1", quantity: 4, variationId: "variation-gray" }),
            createItem({ id: "2", quantity: 4, variationId: "variation-black" }),
        ];

        expect(getMaxQuantityForBasketItem(items, items[0])).toBe(6);
        expect(getMaxQuantityForBasketItem(items, items[1])).toBe(6);
    });

    it("should clamp quantity using consolidated stock", () => {
        const items = [
            createItem({ id: "1", quantity: 4 }),
            createItem({ id: "2", quantity: 2, paymentMethod: PaymentMethod.COPAYMENT }),
        ];

        expect(clampBasketItemQuantity(items, "1", 5)).toBe(4);
        expect(clampBasketItemQuantity(items, "2", 3)).toBe(2);
    });

    it("should reduce later lines when consolidated quantity exceeds stock", () => {
        const items = [
            createItem({
                id: "1",
                quantity: 4,
                paymentTypes: { points: { currencyId: "pts", amount: 4000 } },
            }),
            createItem({
                id: "2",
                quantity: 3,
                paymentMethod: PaymentMethod.COPAYMENT,
                paymentTypes: { points: { currencyId: "pts", amount: 3000 } },
            }),
        ];

        expect(exceedsConsolidatedStock(items, items[0])).toBe(true);

        const normalized = applyConsolidatedStockLimits(items);

        expect(normalized).toHaveLength(2);
        expect(normalized[0].quantity).toBe(4);
        expect(normalized[1].quantity).toBe(2);
        expect(normalized[1].paymentTypes.points.amount).toBe(2000);
    });
});
