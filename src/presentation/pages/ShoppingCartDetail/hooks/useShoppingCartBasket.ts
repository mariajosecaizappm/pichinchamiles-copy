"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Basket, BasketItem } from "@/domain/entity/Basket/structure/basket";
import container from "@/presentation/config/inversify.config";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetBasketUseCase from "@/domain/interactors/Basket/GetBasketUseCase";
import useSession from "@/presentation/hooks/useSession";
import { PaymentMethod } from "@/domain/entity/Payment/payment";
import {
    formatPaymentMethodPrice,
    formatPaymentMethodStock,
} from "@/presentation/helpers/formatPaymentMethod";
import {
    applyConsolidatedStockLimits,
    clampBasketItemQuantity,
    exceedsConsolidatedStock,
    getMaxQuantityForBasketItem,
} from "@/presentation/helpers/basketStock";
import { ChangedBasketItems } from "../types";

const getBasketUseCase = container.get<GetBasketUseCase>(UseCaseTypes.GetBasketUseCase);

export type ShoppingCartBasketState = {
    items: BasketItem[];
    pointsAmountTotal: number;
    copaymentSubtotal: number;
    copaymentTaxes: number;
    copaymentTotal: number;
    hasCopayment: boolean;
    isLoading: boolean;
    isVerifying: boolean;
    hasDisabledProducts: boolean;
    changedBasketItems: ChangedBasketItems | null;
    getMaxQuantity: (basketItemId: string) => number;
    onRemoveItem: (basketItemId: string) => Promise<void>;
    onChangeQuantity: (basketItemId: string, quantity: number) => Promise<void>;
    onUpdateBasketItem: (basketItem: BasketItem) => Promise<void>;
    verifyShoppingCart: (isFirstVerification?: boolean) => Promise<boolean>;
    clearChangedBasketItems: () => void;
};

export const getUpdatedBasketItem = (item: BasketItem, quantity: number): BasketItem => {
    if (quantity > item.variationInfo.stock) {
        return {
            ...item,
            quantity: item.variationInfo.stock,
            paymentTypes: {
                ...item.paymentTypes,
                ...formatPaymentMethodStock(item),
            },
        };
    }

    if (item.paymentMethod === PaymentMethod.COPAYMENT && item.paymentTypes.coin) {
        const pointsPerItem = item.paymentTypes.points.amount / item.quantity;
        const coinsPerItem = item.paymentTypes.coin.amount / item.quantity;

        return {
            ...item,
            quantity,
            paymentTypes: {
                ...item.paymentTypes,
                points: {
                    ...item.paymentTypes.points,
                    amount: pointsPerItem * quantity,
                },
                coin: {
                    ...item.paymentTypes.coin,
                    amount: Number.parseFloat((coinsPerItem * quantity).toFixed(2)),
                },
            },
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
};

export const useShoppingCartBasket = (basket: Basket): ShoppingCartBasketState => {
    const { updateBasket } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [changedBasketItems, setChangedBasketItems] = useState<ChangedBasketItems | null>(null);

    const items = useMemo(() => basket.items ?? [], [basket.items]);
    const pointsAmountTotal = useMemo(
        () => items.reduce((sum, item) => sum + (item.paymentTypes?.points?.amount ?? 0), 0),
        [items]
    );
    const copaymentTotal = useMemo(
        () =>
            items.reduce(
                (sum, item) =>
                    item.paymentTypes.coin ? sum + item.paymentTypes.coin.amount : sum,
                0
            ),
        [items]
    );
    const copaymentSubtotal = useMemo(
        () =>
            Number.parseFloat(
                items
                    .reduce((sum, item) => {
                        if (!item.paymentTypes.coin) return sum;
                        const ivaFactor = 1 + item.variationInfo.taxes / 100;
                        return sum + item.paymentTypes.coin.amount / ivaFactor;
                    }, 0)
                    .toFixed(2)
            ),
        [items]
    );
    const copaymentTaxes = useMemo(
        () =>
            copaymentTotal === 0
                ? 0
                : Number.parseFloat((copaymentTotal - copaymentSubtotal).toFixed(2)),
        [copaymentTotal, copaymentSubtotal]
    );
    const hasCopayment = copaymentTotal > 0;

    const hasDisabledProducts = useMemo(
        () => items.some(item => !item.isAvailability || item.variationInfo.stock <= 0),
        [items]
    );

    const clearChangedBasketItems = useCallback(() => {
        setChangedBasketItems(null);
    }, []);

    const updateShoppingCart = useCallback(
        async (freshBasket: Basket) => {
            const availableItems = freshBasket.items
                .filter(item => item.isAvailability)
                .map(item => {
                    if (item.variationInfo.priceChanged || item.variationInfo.pointsPriceChanged) {
                        return {
                            ...item,
                            paymentTypes: formatPaymentMethodPrice(item),
                        };
                    }

                    return item;
                });

            const nextBasket: Basket = {
                ...freshBasket,
                items: applyConsolidatedStockLimits(availableItems),
            };

            const updatedBasket = await getBasketUseCase.updateBasket(nextBasket);
            updateBasket(updatedBasket ?? nextBasket);
        },
        [updateBasket]
    );

    const verifyShoppingCart = useCallback(
        async (isFirstVerification = false) => {
            setIsVerifying(true);
            try {
                const updatedBasketItems =
                    isFirstVerification && basket ? basket : await getBasketUseCase.getBasket();

                if (!updatedBasketItems) {
                    return false;
                }

                const changedPriceProducts: BasketItem[] = [];
                const changedStockProducts: BasketItem[] = [];
                const disabledProducts: BasketItem[] = [];

                updatedBasketItems.items.forEach(basketItem => {
                    if (!basketItem.isAvailability) {
                        disabledProducts.push(basketItem);
                    }
                    if (
                        (basketItem.variationInfo.stockChanged &&
                            basketItem.quantity > basketItem.variationInfo.stock) ||
                        exceedsConsolidatedStock(updatedBasketItems.items, basketItem)
                    ) {
                        changedStockProducts.push(basketItem);
                    }
                    if (
                        basketItem.variationInfo.priceChanged ||
                        basketItem.variationInfo.pointsPriceChanged
                    ) {
                        changedPriceProducts.push(basketItem);
                    }
                });

                const hasChanges =
                    changedPriceProducts.length > 0 ||
                    changedStockProducts.length > 0 ||
                    disabledProducts.length > 0;

                if (hasChanges) {
                    setChangedBasketItems({
                        changedPriceProducts,
                        changedStockProducts,
                        disabledProducts,
                    });
                    await updateShoppingCart(updatedBasketItems);
                    return false;
                }

                if (!isFirstVerification) {
                    clearChangedBasketItems();
                }
                return true;
            } finally {
                setIsVerifying(false);
            }
        },
        [basket, clearChangedBasketItems, updateShoppingCart]
    );

    useEffect(() => {
        verifyShoppingCart(true).catch(() => undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
    }, []);

    const persistBasket = async (nextBasket: Basket) => {
        setIsLoading(true);
        try {
            const updatedBasket = await getBasketUseCase.updateBasket(nextBasket);
            updateBasket(updatedBasket);
        } finally {
            setIsLoading(false);
        }
    };

    const onRemoveItem = async (basketItemId: string) => {
        setIsLoading(true);
        try {
            const updatedBasket = await getBasketUseCase.removeBasketItem(basketItemId, basket);
            updateBasket(updatedBasket);
        } finally {
            setIsLoading(false);
        }
    };

    const getMaxQuantity = useCallback(
        (basketItemId: string) => {
            const item = items.find(basketItem => basketItem.id === basketItemId);
            if (!item) return 0;
            return getMaxQuantityForBasketItem(items, item);
        },
        [items]
    );

    const onChangeQuantity = async (basketItemId: string, quantity: number) => {
        const item = items.find(basketItem => basketItem.id === basketItemId);
        if (!item) return;

        const safeQuantity = clampBasketItemQuantity(items, basketItemId, quantity);
        const nextBasket: Basket = {
            ...basket,
            items: items.map(basketItem =>
                basketItem.id === basketItemId ? getUpdatedBasketItem(basketItem, safeQuantity) : basketItem
            ),
        };

        await persistBasket(nextBasket);
    };

    const onUpdateBasketItem = async (updatedBasketItem: BasketItem) => {
        const nextBasket: Basket = {
            ...basket,
            items: items.map(basketItem =>
                basketItem.id === updatedBasketItem.id ? updatedBasketItem : basketItem
            ),
        };

        await persistBasket(nextBasket);
    };

    return {
        items,
        pointsAmountTotal,
        copaymentSubtotal,
        copaymentTaxes,
        copaymentTotal,
        hasCopayment,
        isLoading,
        isVerifying,
        hasDisabledProducts,
        changedBasketItems,
        getMaxQuantity,
        onRemoveItem,
        onChangeQuantity,
        onUpdateBasketItem,
        verifyShoppingCart,
        clearChangedBasketItems,
    };
};
