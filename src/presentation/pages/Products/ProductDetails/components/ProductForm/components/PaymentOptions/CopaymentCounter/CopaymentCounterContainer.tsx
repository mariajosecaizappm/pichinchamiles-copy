import React, { useContext, useMemo } from "react";
import FormContext from "@/presentation/components/Form/context/FormContext";
import { CurrencyType } from "@/domain/entity/Currency/currency";
import { VariationCopayment } from "@/domain/entity/Product/variation";
import CopaymentCalculatorService from "@/domain/services/CopaymentCalculatorService";
import Counter from "@/presentation/components/Form/components/Counter";
import useSession from "@/presentation/hooks/useSession";
import { useProductDetailsContext } from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext";
import { formatCopaymentAmount } from "@/presentation/helpers/quantities";

type Props = {
    type: CurrencyType
    productUnitPoinsPrice: number;
    productUnitPrice: number;
    copayment: VariationCopayment;
}

const CopaymentCounterContainer = ({
    productUnitPoinsPrice,
    productUnitPrice,
    copayment,
    type
}: Props) => {
    const { balance } = useSession()
    const { values, setFieldValue } = useContext(FormContext)
    const { isLoading } = useProductDetailsContext()

    const quantity = (values.quantity as number) || 1
    const points = values.points as number
    const coins = values.coins as number | null

    const copaymentCalculator = useMemo(() => new CopaymentCalculatorService(
        quantity,
        productUnitPoinsPrice,
        productUnitPrice,
        copayment,
    ), [quantity, productUnitPoinsPrice, productUnitPrice, copayment]);

    const pointsMaxMin = useMemo(
        () => copaymentCalculator.getCopaymentMaxMin(CurrencyType.POINTS),
        [copaymentCalculator],
    );
    const coinsMaxMin = useMemo(
        () => copaymentCalculator.getCopaymentMaxMin(CurrencyType.COINS),
        [copaymentCalculator],
    );

    const effectiveMax = useMemo(() => {
        if (type === CurrencyType.COINS) {
            return coinsMaxMin.max;
        }

        if (balance) {
            return Math.min(pointsMaxMin.max, balance);
        }

        return pointsMaxMin.max;
    }, [type, balance, pointsMaxMin.max, coinsMaxMin.max]);

    const effectiveMin = useMemo(() => {
        if (type === CurrencyType.COINS) {
            if (balance && coins !== null) {
                const pointsIfCoinsDecremented = copaymentCalculator.getCopaymentPoints(coins - 1);
                if (pointsIfCoinsDecremented > balance) {
                    return coins;
                }
            }
            return coinsMaxMin.min;
        }

        return pointsMaxMin.min;
    }, [type, balance, coins, coinsMaxMin.min, pointsMaxMin.min, copaymentCalculator]);

    const handleChange = (value: number) => {
        if (type === CurrencyType.POINTS) {
            const clampedPoints = Math.min(Math.max(value, pointsMaxMin.min), effectiveMax);
            setFieldValue("points", clampedPoints);
            setFieldValue("coins", copaymentCalculator.getCopaymentCoins(clampedPoints));
            return;
        }

        let clampedCoins = Math.min(
            Math.max(Math.round(value * 100) / 100, effectiveMin),
            coinsMaxMin.max,
        );
        let calculatedPoints = copaymentCalculator.getCopaymentPoints(clampedCoins);

        if (calculatedPoints < pointsMaxMin.min) {
            calculatedPoints = pointsMaxMin.min;
            clampedCoins = copaymentCalculator.getCopaymentCoins(calculatedPoints);
        }

        setFieldValue("points", calculatedPoints);
        setFieldValue("coins", clampedCoins);
    }

    return (
        <Counter
            isReadonly={isLoading}
            min={effectiveMin}
            max={effectiveMax}
            count={type === CurrencyType.POINTS ? points : coins ?? 0}
            onChange={handleChange}
            className="h-12 justify-between"
            countClassName="min-w-15"
            formatValue={type === CurrencyType.COINS ? formatCopaymentAmount : undefined}
        />
    );
};

export default CopaymentCounterContainer;
