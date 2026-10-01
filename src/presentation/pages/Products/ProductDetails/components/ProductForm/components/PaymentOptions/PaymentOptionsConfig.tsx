import { PaymentMethod } from "@/domain/entity/Payment/payment";
import { formatMiles } from "@/presentation/helpers/quantities";

export const GET_PAYMENT_OPTIONS = (points: number, hasCopayment: boolean) => [
    {
        value: PaymentMethod.POINTS,
        label: `Solo con millas: ${formatMiles(points)} millas`,
    },
    ...(hasCopayment ? [{ value: PaymentMethod.COPAYMENT, label: "Con millas + Tarjeta de crédito" }] : [])
];