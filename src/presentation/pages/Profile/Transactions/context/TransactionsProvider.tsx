import React, {FC, PropsWithChildren, useCallback, useMemo, useState} from 'react';
import TransactionsContext, {
    TransactionsContextValues
} from "@/presentation/pages/Profile/Transactions/context/TransactionsContext";
import {Transaction} from "@/domain/entity/Transaction/transaction";
import {
    isSameTransaction
} from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/helpers";

type TransactionsProviderProps = PropsWithChildren

const TransactionsProvider: FC<TransactionsProviderProps> = ({children}) => {
    const [transaction, setTransaction] = useState<Transaction | null>(null);

    const handleSelectTransaction = useCallback((selectedTransaction: Transaction) => {
        setTransaction(current =>
            isSameTransaction(current, selectedTransaction) ? null : selectedTransaction
        );
    }, []);

    const values: TransactionsContextValues = useMemo(() => {
        return {
            transaction,
            selectTransaction: handleSelectTransaction,
            clearTransaction: () => setTransaction(null)
        }
    }, [transaction, handleSelectTransaction])

    return (
        <TransactionsContext.Provider value={values}>
            {children}
        </TransactionsContext.Provider>
    );
};

export default TransactionsProvider;