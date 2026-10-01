import React, {FC, useContext} from 'react';
import {List} from "@/domain/entity/List/list";
import {Transaction, TransactionStatus} from "@/domain/entity/Transaction/transaction";
import {formatMiles} from "@/presentation/helpers/quantities";
import Icon from "@/presentation/components/icons/Icon";
import {
    getStatusTexColor,
    getTransactionOperation,
    groupTransactionsByDate,
    isSameTransaction,
    transactionsLabel
} from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/helpers";
import TransactionsGridPagination
    from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/components/TransactionsGridPagination";
import TransactionsContext from "@/presentation/pages/Profile/Transactions/context/TransactionsContext";

type TransactionsListGridProps = {
    transactionList: List<Transaction>;
}

const TransactionsListGrid: FC<TransactionsListGridProps> = ({transactionList}) => {
    const {transaction: selectedTransaction, selectTransaction} = useContext(TransactionsContext);
    const groupedTransactions = groupTransactionsByDate(transactionList.data);

    return (
        <div className="order-3 flex flex-col gap-3 mt-2">
            <p className="typo-main-caption-medium text-grayscale-500">
                Mostrando {transactionList.data.length} registros
            </p>

            {groupedTransactions.map(group => (
                <div key={group.dateKey} className="flex flex-col gap-3">
                    <p className="typo-main-caption-book font-semibold text-grayscale-500">
                        {group.dateLabel}
                    </p>
                    <div
                        className="flex flex-col gap-3 md:gap-0 md:overflow-hidden md:rounded-lg md:border md:border-darkGrayishBlue-300 md:bg-white">
                        {group.transactions.map((transaction) => {
                            const operation = getTransactionOperation(transaction.transactionType);
                            const isSelected = isSameTransaction(selectedTransaction, transaction);

                            return (
                                <button
                                    key={`${transaction.number}-${transaction.transactionType}-${transaction.createAt}`}
                                    type="button"
                                    onClick={() => selectTransaction(transaction)}
                                    aria-pressed={isSelected}
                                    className={`border border-darkGrayishBlue-300 rounded-lg py-[14px] px-3 flex items-center gap-2 typo-main-caption-book cursor-pointer transition-colors ${
                                        isSelected
                                            ? "md:mx-1 md:my-1 md:rounded-lg md:border-none md:bg-darkGrayishBlue-100 md:px-5 md:py-5"
                                            : "md:rounded-none md:border-0 md:border-b md:border-darkGrayishBlue-300 md:px-6 md:py-6 md:last:border-b-0"
                                    } md:text-body`}
                                >
                                    <p className="flex-1 text-left lowercase first-letter:uppercase">
                                        {transaction.status === TransactionStatus.REJECTED ? "Rechazo " : ""}{transactionsLabel[transaction.transactionType]}
                                    </p>
                                    <p className={`font-semibold ${getStatusTexColor(transaction)}`}>
                                        {operation === "increment" ? "+" : "-"} {formatMiles(transaction.pointsAmount)} millas
                                    </p>
                                    <Icon name="icon-arrow-right" className="shrink-0 text-grayscale-400"/>
                                </button>
                            )
                        })}
                    </div>
                </div>
            ))}

            <TransactionsGridPagination pagination={transactionList.pagination}/>
        </div>
    );
};

export default TransactionsListGrid;
