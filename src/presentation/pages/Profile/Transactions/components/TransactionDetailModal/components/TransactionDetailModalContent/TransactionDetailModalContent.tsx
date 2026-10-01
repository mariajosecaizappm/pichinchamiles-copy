import React, {FC} from 'react';
import {
    formatTransactionDate, getStatusTexColor,
    getTransactionOperation,
    transactionsLabel
} from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/helpers";
import {formatMiles} from "@/presentation/helpers/quantities";
import {Transaction, TransactionStatus} from "@/domain/entity/Transaction/transaction";
import TransactionDetailModalSection
    from "@/presentation/pages/Profile/Transactions/components/TransactionDetailModal/components/TransactionDetailModalSection";

type TransactionDetailModalProps = {
    transaction: Transaction
}

const TransactionDetailModalContent: FC<TransactionDetailModalProps> = ({transaction}) => {
    const operation = getTransactionOperation(transaction.transactionType);
    const title = transactionsLabel[transaction.transactionType];

    return(
        <div className="w-full h-full md:h-fit">
            <div className="border border-darkGrayishBlue-300 rounded-lg py-6 px-4 bg-white">
                <p className={`typo-main-headline-2-prelo-semi-bold font-semibold ${getStatusTexColor(transaction)}`}>
                    {operation === "increment" ? "+" : "-"} {formatMiles(transaction.pointsAmount)} millas
                </p>
                <div className="w-full h-px bg-darkGrayishBlue-200 my-4"/>
                <p className="typo-main-legal-medium text-grayscale-400">
                    {formatTransactionDate(transaction.createAt)}
                </p>
                <p className="mt-1 typo-main-subtitle-semi-bold text-grayscale-500 lowercase first-letter:uppercase">
                    {transaction.status === TransactionStatus.REJECTED ? "Rechazo " : ""}{title}
                </p>
                <div className="w-full h-px bg-darkGrayishBlue-200 my-4"/>
                <div className="flex justify-between items-center gap-1 typo-main-legal-medium">
                    <p className="text-grayscale-400">No. de transacción</p>
                    <p className="text-neutral-950 wrap-break-word">{transaction.number ?? transaction.originalNumber}</p>
                </div>
            </div>
            <TransactionDetailModalSection transaction={transaction}/>
        </div>
    )
};

export default TransactionDetailModalContent;