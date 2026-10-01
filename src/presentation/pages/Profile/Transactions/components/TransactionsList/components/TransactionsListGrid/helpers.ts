import {Transaction, TransactionStatus} from "@/domain/entity/Transaction/transaction";

export const transactionsLabel = Object.freeze({
    ultraviajes_activity_redemption: 'Canje de actividad',
    reversed_ultraviajes_activity_redemption: 'Reverso canje actividad',
    ultraviajes_hotel_redemption: 'Canje de hotel',
    reversed_ultraviajes_hotel_redemption: 'Reverso canje hotel',
    ultraviajes_flight_redemption: 'Canje vuelo',
    reversed_ultraviajes_flight_redemption: 'Reverso canje vuelo',
    ultraviajes_disney_redemption: 'Canje tickets Disney',
    reversed_ultraviajes_disney_redemption: 'Reverso canje tickets Disney',
    ultraviajes_car_redemption: 'Alquiler de auto',
    reversed_ultraviajes_car_redemption: 'Reverso alquiler de auto',
    ultraviajes_travelpackage_redemption: 'Canje paquete de viajes',
    reversed_ultraviajes_travelpackage_redemption:
        'Reverso canje paquete de viajes',
    national_hotel_redemption: 'Canje hotel nacional',
    reversed_national_hotel_redemption: 'Reverso canje hotel nacional',
    national_activity_redemption: 'Canje actividad nacional',
    reversed_national_activity_redemption: 'Reverso canje actividad nacional',
    accreditation: 'Acreditación de millas',
    reversed_accreditation: 'Reverso acreditación de millas',
    transfer_receive: 'Transferencia recibida',
    reversed_transfer_receive: 'Reverso transferencia recibida',
    program_transfer_receive: 'Transferencia recibida',
    reversed_program_transfer_receive: 'Reverso transferencia recibida',
    saving_plan: 'Plan ahorro de millas',
    transfer_send: 'Transferencia emitida',
    reversed_transfer_send: 'Reverso transferencia emitida',
    avios_transfer: 'Transferencia AVIOS',
    points_purchase: 'Compra de millas',
    reversed_points_purchase: 'Reverso compra de millas',
    product_redemption: 'Canje de productos',
    reversed_product_redemption: 'Reverso canje de productos',
    program_transfer_send: 'Transferencia emitida',
    reversed_program_transfer_send: 'Reverso transferencia emitida',
    donation: 'Donación',
    pay_card: 'Pago de tarjeta',
    expiration: 'Expiración de millas',
    pay_debt: 'Pago de deuda',
    reversed_pay_debt: 'Reverso pago de deuda',
    giftcard_redemption: 'Canje tarjeta regalo',
    reversed_giftcard_redemption: 'Reverso canje tarjeta regalo',
    rewards_web_redemption: 'Canje Amazon',
    reverse_rewards_web_redemption: 'Reverso canje Amazon',
    nullity_miles: 'Millas anuladas',
    reversed_nullity_miles: 'Reverso millas anuladas',
    balance_adjustment: 'Deuda de saldo pendiente',
    reversed_balance_adjustment: 'Reverso de deuda de saldo pendiente',
    rejected_ultraviajes_flight_redemption: 'Reverso de vuelo',
    rejected_ultraviajes_disney_redemption: 'Reverso tickets Disney',
    rejected_ultraviajes_hotel_redemption: 'Reverso de hotel',
    rejected_ultraviajes_car_redemption: 'Reverso de autos',
    rejected_product_redemption: 'Reverso de productos'
})

export type TransactionOperation = 'increment' | 'decrement';

const incrementTransactionSlugs = new Set([
    'reversed_ultraviajes_activity_redemption',
    'reversed_ultraviajes_hotel_redemption',
    'reversed_ultraviajes_flight_redemption',
    'reversed_ultraviajes_disney_redemption',
    'reversed_ultraviajes_car_redemption',
    'reversed_ultraviajes_travelpackage_redemption',
    'reversed_national_hotel_redemption',
    'reversed_national_activity_redemption',
    'accreditation',
    'transfer_receive',
    'program_transfer_receive',
    'saving_plan',
    'reversed_transfer_send',
    'points_purchase',
    'reversed_product_redemption',
    'reversed_program_transfer_send',
    'reversed_pay_debt',
    'reversed_giftcard_redemption',
    'reverse_rewards_web_redemption',
    'reversed_nullity_miles',
    'reversed_balance_adjustment',
    'rejected_ultraviajes_flight_redemption',
    'rejected_ultraviajes_disney_redemption',
    'rejected_ultraviajes_hotel_redemption',
    'rejected_ultraviajes_car_redemption',
    'rejected_product_redemption'
]);

const decrementTransactionSlugs = new Set([
    'ultraviajes_activity_redemption',
    'ultraviajes_hotel_redemption',
    'ultraviajes_flight_redemption',
    'ultraviajes_disney_redemption',
    'ultraviajes_car_redemption',
    'ultraviajes_travelpackage_redemption',
    'national_hotel_redemption',
    'national_activity_redemption',
    'reversed_accreditation',
    'reversed_transfer_receive',
    'reversed_program_transfer_receive',
    'transfer_send',
    'avios_transfer',
    'reversed_points_purchase',
    'product_redemption',
    'program_transfer_send',
    'donation',
    'pay_card',
    'expiration',
    'pay_debt',
    'giftcard_redemption',
    'rewards_web_redemption',
    'nullity_miles',
    'balance_adjustment'
]);

export const getTransactionOperation = (
    slug?: string
): TransactionOperation | undefined => {
    if (!slug) return undefined;

    if (incrementTransactionSlugs.has(slug)) return 'increment';
    if (decrementTransactionSlugs.has(slug)) return 'decrement';

    return undefined;
}

export type TransactionGroup = {
    dateKey: string;
    dateLabel: string;
    transactions: Transaction[];
}

export const isSameTransaction = (
    a: Transaction | null | undefined,
    b: Transaction | null | undefined,
): boolean =>
    !!a &&
    !!b &&
    a.number === b.number &&
    a.transactionType === b.transactionType &&
    a.createAt === b.createAt;

const transactionDateFormatter = new Intl.DateTimeFormat('es-EC', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

const capitalize = (value: string): string => {
    if (!value) return value;

    return value.charAt(0).toUpperCase() + value.slice(1);
}

const getValidTransactionDate = (date: string | undefined): Date | null => {
    if (!date) return null;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return null;

    return parsedDate;
}

export const getTransactionDateKey = (date: string | undefined): string => {
    const parsedDate = getValidTransactionDate(date);

    if (!parsedDate) return 'unknown';

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export const formatTransactionDate = (date: string | undefined): string => {
    const parsedDate = getValidTransactionDate(date);

    if (!parsedDate) return 'Sin fecha';

    return capitalize(transactionDateFormatter.format(parsedDate));
}

export const groupTransactionsByDate = (transactions: Transaction[]): TransactionGroup[] => {
    const groupedTransactions = new Map<string, TransactionGroup>();

    transactions.forEach(transaction => {
        const dateKey = getTransactionDateKey(transaction.createAt);
        const currentGroup = groupedTransactions.get(dateKey);

        if (currentGroup) {
            currentGroup.transactions.push(transaction);
            return;
        }

        groupedTransactions.set(dateKey, {
            dateKey,
            dateLabel: formatTransactionDate(transaction.createAt),
            transactions: [transaction]
        });
    });

    return Array.from(groupedTransactions.values());
}

export const getStatusTexColor = (transaction: Transaction) =>{
    const operation = getTransactionOperation(transaction.transactionType);
    if(transaction.status === TransactionStatus.REJECTED){
        return "text-error-500"
    }else if(operation === 'increment'){
        return "text-success-500"
    }else{
        return "text-neutral-950"
    }
}
