import {Transaction, TransactionTypes} from "@/domain/entity/Transaction/transaction";
import {formatCopaymentAmount, formatMiles} from "@/presentation/helpers/quantities";
import {PaymentMethod} from "@/domain/entity/Payment/payment";


const shortDateFormatter = new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
});

const formatShortDate = (date: string | undefined): string => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return shortDateFormatter.format(parsedDate);
}

const sumDetailValue = (
    details: Transaction["details"],
    getValue: (detail: NonNullable<Transaction["details"]>[number]) => number | undefined,
): number =>
    details?.reduce((sum, detail) => sum + (getValue(detail) ?? 0), 0) ?? 0;

const getQuantity = (transaction: Transaction): number =>
    sumDetailValue(transaction.details, detail => detail.quantity) || 1;

export const getTransactionDetails = (transaction: Transaction): Array<{label: string, value: string | number}> =>{
    const getPaymentMethod = (paymentMethod: string) => paymentMethod === PaymentMethod.POINTS ? "Millas" : "Millas + Dólares";
    const totalPoints = sumDetailValue(transaction.details, detail => detail.totalPoints);
    const totalCoins = sumDetailValue(transaction.details, detail => detail.totalCoins);
    const quantity = getQuantity(transaction);

    switch (transaction.transactionType){
    case TransactionTypes.Accreditation:
    case TransactionTypes.ReversedAccreditation:
        return [
            {label: "Tipo", value: "Promoción"},
            {label: "Promocion", value: transaction.promo as string},
            {label: "Fecha de corte", value: formatShortDate(transaction.cutOffDate)}
        ];
    case TransactionTypes.TransferSend:
    case TransactionTypes.ReversedTransferSend:
    case TransactionTypes.ProgramTransferSend:
    case TransactionTypes.ReversedProgramTransferSend:
        return [
            {label: "Socio de destino", value: transaction.destinationMemberUser as string},
            {label: "Millas transferidas", value: formatMiles(transaction.pointsAmount)}
        ];
    case TransactionTypes.TransferReceive:
    case TransactionTypes.ReversedTransferReceive:
    case TransactionTypes.ProgramTransferReceive:
    case TransactionTypes.ReversedProgramTransferReceive:
        return [
            {label: "Socio que emite", value: transaction.originalMemberUser as string},
            {label: "Millas transferidas", value: formatMiles(transaction.pointsAmount)}
        ];
    case TransactionTypes.UltraviajesFlightRedemption:
    case TransactionTypes.ReversedUltraviajesFlightRedemption:
    case TransactionTypes.UltraviajesHotelRedemption:
    case TransactionTypes.ReversedUltraviajesHotelRedemption:
    case TransactionTypes.UltraviajesActivityRedemption:
    case TransactionTypes.ReversedUltraviajesActivityRedemption:
    case TransactionTypes.UltraviajesCarRedemption:
    case TransactionTypes.ReversedUltraviajesCarRedemption:
    case TransactionTypes.UltraviajesDisneyRedemption:
    case TransactionTypes.ReversedUltraviajesDisneyRedemption:
    case TransactionTypes.UltraviajesTravelpackageRedemption:
    case TransactionTypes.ReversedUltraviajesTravelpackageRedemption: {
        return [
            {
                label: "Cantidad",
                value: quantity ?? 1,
            },
            {
                label: "Monto en dólares",
                value: totalCoins ? formatCopaymentAmount(totalCoins) : 0
            },
            {
                label: "Monto de redención",
                value: totalPoints ? formatMiles(totalPoints) : 0
            },
            {
                label: "Método de redención",
                value: getPaymentMethod(transaction.paymentMethod as string),
            },
        ];
    }
    case TransactionTypes.ProductRedemption:
    case TransactionTypes.ReversedProductRedemption: {
        return [
            {label: "Cantidad", value: quantity ?? 1},
            {label: "Valor en millas", value: totalPoints ? formatMiles(totalPoints) : 0},
            {label: "Monto de copago", value: totalCoins ? `$${formatCopaymentAmount(totalCoins)}` : 0},
            {label: "Método de redención", value: getPaymentMethod(transaction.paymentMethod as string)},
        ]
    }
    default:
        return [];
    }
}
