import React from 'react';
import TransactionListFilters
    from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionListFilters";
import TransactionsListGrid
    from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid";

const TransactionsList = () => {
    return (
        <div className="md:bg-neutral-50 py-3 md:px-4 md:pb-6 md:pt-4 md:rounded-lg">
            <TransactionListFilters />
            <TransactionsListGrid/>
        </div>
    );
};

export default TransactionsList;
