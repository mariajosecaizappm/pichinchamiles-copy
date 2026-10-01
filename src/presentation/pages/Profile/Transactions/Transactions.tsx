import React from 'react';
import TransactionsSummary
    from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary";
import TransactionsProvider from "@/presentation/pages/Profile/Transactions/context/TransactionsProvider";
import TransactionsDetailSection
    from "@/presentation/pages/Profile/Transactions/components/TransactionsDetailSection";

const Transactions = () => {
    return (
        <div className="pt-4 pb-6 px-6 w-full flex flex-col md:max-w-[1056px] md:mx-auto">
            <TransactionsSummary/>
            <TransactionsProvider>
                <TransactionsDetailSection/>
            </TransactionsProvider>
        </div>
    );
};

export default Transactions;
