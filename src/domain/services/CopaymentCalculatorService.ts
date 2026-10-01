import { CurrencyType } from "@/domain/entity/Currency/currency";
import { CopaymentMaxMin } from "@/domain/entity/Payment/payment";
import { VariationCopayment } from "@/domain/entity/Product/variation";

export default class CopaymentCalculatorService {
    private variationCopayment: VariationCopayment;
    private readonly pointsConversionRate: number;
    private readonly quantity: number;
    private readonly copaymentPercentage: number;
    private readonly pointsTotal: number;
    private readonly priceTotal: number;

    constructor(
        quantity: number,
        productUnitPointsPrice: number,
        productUnitPrice: number,
        variationCopayment: VariationCopayment
    ) {
        this.variationCopayment = {
            ...variationCopayment,
            initialization: {
                ...variationCopayment.initialization,
                coins: parseFloat(variationCopayment.initialization.coins.toFixed(2)),
            },
        };
        this.quantity = quantity;
        this.copaymentPercentage = parseInt(
            ((this.variationCopayment.minimumPointsValue * 100) / productUnitPointsPrice).toFixed(0)
        );
        this.pointsTotal = quantity * productUnitPointsPrice;
        this.priceTotal = quantity * productUnitPrice;
        this.pointsConversionRate = this.unCryptPointsPercent(
            variationCopayment.pointsConversionRatePercentage
        );
    }

    private unCryptPointsPercent(pointsConversionRatePercentage: string) {
        const decryptedTextOne = Buffer.from(pointsConversionRatePercentage, 'base64').toString('ascii');
        const decryptedTextTwo = Buffer.from(decryptedTextOne, 'base64').toString('ascii');
        return Number(decryptedTextTwo.replace(/\0/g, ''));
    }

    getCopaymentCoins(pointsAmount: number): number {
        const remainingPoints = this.pointsTotal - pointsAmount;
        return Math.round(remainingPoints * this.pointsConversionRate * 100) / 100;
    }

    getCopaymentPoints(coinsAmount: number): number {
        const coinsConverted = Math.round(coinsAmount / this.pointsConversionRate);
        return this.pointsTotal - coinsConverted;
    }

    getCopaymentMaxMin(type: CurrencyType): CopaymentMaxMin {
        const initialPoints =
            this.variationCopayment.initialization.points === 0
                ? 1
                : this.variationCopayment.initialization.points;
        const minPoints = parseFloat(initialPoints.toFixed(2)) * this.quantity;
        const maxPoints = Math.round((this.priceTotal - 1) / this.pointsConversionRate);
        const differencePoints = this.pointsTotal - minPoints;

        if (type === CurrencyType.POINTS) {
            return {
                min: minPoints === 0 ? 1 : minPoints,
                max: maxPoints,
            };
        }

        return {
            min: 1,
            max: Math.round(differencePoints * this.pointsConversionRate * 100) / 100,
        };
    }

    getCopaymentPercentage(): number {
        return this.copaymentPercentage;
    }

    getCopaymentInitialValues(): { points: number; coins: number } {
        const pointsMaxMin = this.getCopaymentMaxMin(CurrencyType.POINTS);
        const coinsMaxMin = this.getCopaymentMaxMin(CurrencyType.COINS);

        return {
            points: pointsMaxMin.min,
            coins: coinsMaxMin.max,
        };
    }
}
