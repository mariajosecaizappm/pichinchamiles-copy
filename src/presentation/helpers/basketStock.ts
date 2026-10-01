import { BasketItem } from "@/domain/entity/Basket/structure/basket";
import { formatPaymentMethodPrice } from "@/presentation/helpers/formatPaymentMethod";

export const getBasketItemStockKey = (
    item: Pick<BasketItem, "productId" | "variationId">
): string => `${item.productId}::${item.variationId}`;

export const getConsolidatedQuantity = (
    items: BasketItem[],
    productId: string,
    variationId: string
): number =>
    items
        .filter(item => item.productId === productId && item.variationId === variationId)
        .reduce((sum, item) => sum + item.quantity, 0);

export const getMaxQuantityForBasketItem = (
    items: BasketItem[],
    item: BasketItem
): number => {
    const otherItemsQuantity =
        getConsolidatedQuantity(items, item.productId, item.variationId) - item.quantity;

    return Math.max(0, item.variationInfo.stock - otherItemsQuantity);
};

export const clampBasketItemQuantity = (
    items: BasketItem[],
    itemId: string,
    quantity: number
): number => {
    const item = items.find(basketItem => basketItem.id === itemId);
    if (!item) return quantity;

    const maxQuantity = getMaxQuantityForBasketItem(items, item);
    return Math.max(1, Math.min(quantity, maxQuantity));
};

export const exceedsConsolidatedStock = (items: BasketItem[], item: BasketItem): boolean =>
    getConsolidatedQuantity(items, item.productId, item.variationId) > item.variationInfo.stock;

export const applyConsolidatedStockLimits = (items: BasketItem[]): BasketItem[] => {
    const remainingStock = new Map<string, number>();

    return items
        .map(item => {
            const key = getBasketItemStockKey(item);
            if (!remainingStock.has(key)) {
                remainingStock.set(key, item.variationInfo.stock);
            }

            const available = remainingStock.get(key) ?? 0;
            const quantity = Math.min(item.quantity, available);
            remainingStock.set(key, Math.max(0, available - quantity));

            if (quantity === item.quantity) {
                return item;
            }

            if (quantity <= 0) {
                return {
                    ...item,
                    quantity: 0,
                };
            }

            const nextItem: BasketItem = {
                ...item,
                quantity,
            };

            return {
                ...nextItem,
                paymentTypes: {
                    ...nextItem.paymentTypes,
                    ...formatPaymentMethodPrice(nextItem),
                },
            };
        })
        .filter(item => item.quantity > 0);
};
