"use client";

import React, {useContext, useEffect} from 'react';
import {useSearchParams} from "next/navigation";
import ExportTransactionsForm from "@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm";
import TransactionsList from "@/presentation/pages/Profile/Transactions/components/TransactionsList";
import TransactionDetailModal from "@/presentation/pages/Profile/Transactions/components/TransactionDetailModal";
import TransactionsContext from "@/presentation/pages/Profile/Transactions/context/TransactionsContext";
import TransactionsListEmptyState
    from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/TransactionsListEmptyState";
import useTransactionsListQuery
    from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/useTransactionsListQuery";
import {RANGE_QUERY_PARAM} from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionListFilters/transactionListFilters.utils";

const TransactionsDetailSection = () => {
    const { data: transactionList } = useTransactionsListQuery();
    const { clearTransaction } = useContext(TransactionsContext);
    const searchParams = useSearchParams();
    const hasRangeFilter = searchParams.has(RANGE_QUERY_PARAM);
    const hasNoTransactions = transactionList?.data.length === 0 && transactionList.pagination.total === 0;

    useEffect(() => {
        if (transactionList) {
            clearTransaction();
        }
    }, [transactionList]);

    if (hasNoTransactions && !hasRangeFilter) {
        return <TransactionsListEmptyState />;
    }

    return (
        <>
            <h6 className="typo-main-headline-3-prelo-semi-bold font-slab font-normal text-blue-500 my-3">
                Detalle de transacciones
            </h6>
            <div className="flex gap-6">
                <div className="w-full">
                    <ExportTransactionsForm/>
                    <TransactionsList />
                </div>
                <TransactionDetailModal/>
            </div>
        </>
    );
};

export default TransactionsDetailSection;
