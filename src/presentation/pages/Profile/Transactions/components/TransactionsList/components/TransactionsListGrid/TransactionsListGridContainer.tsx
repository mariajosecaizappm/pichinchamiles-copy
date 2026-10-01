"use client";

import React from 'react';
import {useSearchParams} from "next/navigation";
import links from "@/presentation/config/links";
import TransactionsListGrid
    from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/TransactionsListGrid";
import TransactionsListGridSkeleton
    from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/TransactionsListGridSkeleton";
import TransactionsListEmptyState
    from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/TransactionsListEmptyState";
import {RANGE_QUERY_PARAM} from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionListFilters/transactionListFilters.utils";
import useTransactionsListQuery
    from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/useTransactionsListQuery";

const TransactionsListGridContainer = () => {
    const { data: transactionList, isLoading } = useTransactionsListQuery();
    const searchParams = useSearchParams();
    const hasRangeFilter = searchParams.has(RANGE_QUERY_PARAM);

    if (isLoading || !transactionList) {
        return <TransactionsListGridSkeleton />;
    }

    if (transactionList.data.length === 0 && transactionList.pagination.total === 0) {
        return hasRangeFilter
            ? (
                <TransactionsListEmptyState
                    buttonLabel="Ir al inicio"
                    buttonHref={links.products}
                    withWhiteBackground={false}
                />
            )
            : <TransactionsListEmptyState />;
    }

    return <TransactionsListGrid transactionList={transactionList}/>
};

export default TransactionsListGridContainer;
