"use client";

import { BasketItem } from "@/domain/entity/Basket/structure/basket";
import { CurrencyType } from "@/domain/entity/Currency/currency";
import { VariationCopayment } from "@/domain/entity/Product/variation";
import CopaymentCalculatorService from "@/domain/services/CopaymentCalculatorService";
import CopaymentCounter from "./CopaymentCounter";

type ShoppingCartCopaymentCounterProps = {
    type: CurrencyType;
    copayment: VariationCopayment;
    basketItem: BasketItem;
    disabled?: boolean;
    onUpdateBasketItem: (basketItem: BasketItem) => Promise<void>;
};

const ShoppingCartCopaymentCounter = ({
    type,
    basketItem,
    copayment,
    disabled = false,
    onUpdateBasketItem,
}: ShoppingCartCopaymentCounterProps) => {
    const {
        paymentTypes: { points, coin },
        quantity,
        variationInfo,
    } = basketItem;

    if (!coin) return null;

    const copaymentCalculator = new CopaymentCalculatorService(
        quantity,
        variationInfo.pointsPrice,
        variationInfo.price,
        copayment
    );
    const copaymentMaxMin = copaymentCalculator.getCopaymentMaxMin(type);
    const counterValue = type === CurrencyType.COINS ? coin.amount : points.amount;

    const handleChange = (value: number) => {
        const pointsAmount =
            type === CurrencyType.POINTS
                ? value
                : copaymentCalculator.getCopaymentPoints(value);
        const coinsAmount =
            type === CurrencyType.COINS
                ? value
                : copaymentCalculator.getCopaymentCoins(value);

        void onUpdateBasketItem({
            ...basketItem,
            paymentTypes: {
                ...basketItem.paymentTypes,
                points: {
                    amount: pointsAmount,
                    currencyId: points.currencyId,
                },
                coin: {
                    amount: coinsAmount,
                    currencyId: coin.currencyId,
                },
            },
        });
    };

    return (
        <CopaymentCounter
            type={type}
            label={type === CurrencyType.POINTS ? "Millas a usar" : "Dólares a pagar"}
            max={copaymentMaxMin.max}
            min={type === CurrencyType.POINTS ? copaymentMaxMin.min : 1}
            value={counterValue}
            disabled={disabled}
            onChange={handleChange}
        />
    );
};

export default ShoppingCartCopaymentCounter;
