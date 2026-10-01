import React, {FC} from 'react';
import {Transaction} from "@/domain/entity/Transaction/transaction";
import {formatMiles} from "@/presentation/helpers/quantities";
import {
    getTransactionDetails
} from "@/presentation/pages/Profile/Transactions/components/TransactionDetailModal/components/TransactionDetailModalSection/helpers";
import TransactionStatusChip
    from "@/presentation/pages/Profile/Transactions/components/TransactionDetailModal/components/TransactionDetailModalSection/components/TransactionStatusChip";

type TransactionDetailModalSectionProps = {
    transaction: Transaction
}

const TransactionDetailModalSection: FC<TransactionDetailModalSectionProps> = ({transaction}) => {

    const transactionDetails = getTransactionDetails(transaction);
    const details = [
        {label: "Saldo en millas", value: formatMiles(transaction.balanceAfterOperation)},
        ...transactionDetails,
    ]

    return (
        <div className="mx-[-24px] mt-6 bg-white p-6 h-full md:h-fit md:mt-0">
            <p className="typo-main-body-semi-bold text-grayscale-500 border-b border-grayscale-200 mb-4 pb-4">
                Más detalles
            </p>
            <ul className="px-3">
                <li className="mb-4 flex items-center justify-between border-b border-grayscale-200 pb-4 last:mb-0 last:border-b-0 last:pb-0">
                    <span className="typo-main-caption-book text-grayscale-400">Estado</span>
                    <TransactionStatusChip status={transaction.status}/>
                </li>
                {details.map(detail => (
                    <li
                        className="mb-4 flex justify-between border-b border-grayscale-200 pb-4 last:mb-0 last:border-b-0 last:pb-0"
                        key={detail.label + detail.value}
                    >
                        <span className="text-grayscale-400">{detail.label}</span>
                        <span className="text-grayscale-500 font-medium">{detail.value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionDetailModalSection;
