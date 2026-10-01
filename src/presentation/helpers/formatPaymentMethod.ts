import { BasketItem } from "@/domain/entity/Basket/structure/basket";
import { PaymentMethod } from "@/domain/entity/Payment/payment";
import CopaymentCalculatorService from "@/domain/services/CopaymentCalculatorService";

export function formatPaymentMethodStock(item: BasketItem) {
    if (item.paymentMethod === PaymentMethod.COPAYMENT && item.paymentTypes.coin) {
        const pointsPerItem = item.paymentTypes.points.amount / item.quantity;
        const coinsPerItem = item.paymentTypes.coin.amount / item.quantity;

        return {
            points: {
                ...item.paymentTypes.points,
                amount: item.variationInfo.stock * pointsPerItem,
            },
            coin: {
                ...item.paymentTypes.coin,
                amount: Number.parseFloat((item.variationInfo.stock * coinsPerItem).toFixed(2)),
            },
        };
    }

    return {
        points: {
            ...item.paymentTypes.points,
            amount: item.variationInfo.stock * item.variationInfo.pointsPrice,
        },
    };
}

export function formatPaymentMethodPrice(item: BasketItem) {
    if (item.paymentMethod === PaymentMethod.COPAYMENT && item.paymentTypes.coin) {
        if (item.variationInfo.copayment) {
            const calculator = new CopaymentCalculatorService(
                item.quantity,
                item.variationInfo.pointsPrice,
                item.variationInfo.price,
                item.variationInfo.copayment
            );
            const { points, coins } = calculator.getCopaymentInitialValues();
            return {
                points: {
                    ...item.paymentTypes.points,
                    amount: points,
                },
                coin: {
                    ...item.paymentTypes.coin,
                    amount: coins,
                },
            };
        }
    }

    return {
        points: {
            ...item.paymentTypes.points,
            amount: item.variationInfo.pointsPrice * item.quantity,
        },
    };
}
