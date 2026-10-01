"use client";

import React, {FC, useCallback} from 'react';
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Pagination as TransactionsPagination} from "@/domain/entity/List/list";
import Pagination from "@/presentation/components/Pagination";

const PAGE_QUERY_PARAM = "page";

type TransactionsGridPaginationProps = {
    pagination: TransactionsPagination
}

const TransactionsGridPagination: FC<TransactionsGridPaginationProps> = ({pagination}) => {
    const router = useRouter();
    const pathname = usePathname() ?? "";
    const searchParams = useSearchParams();

    const handleChangePage = useCallback((nextPage: number) => {
        const params = new URLSearchParams(searchParams.toString());

        if (nextPage <= 1) {
            params.delete(PAGE_QUERY_PARAM);
        } else {
            params.set(PAGE_QUERY_PARAM, String(nextPage));
        }

        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, {scroll: false});
    }, [pathname, router, searchParams]);

    if (pagination.totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex justify-center pt-3 md:pb-3 md:pt-6">
            <Pagination
                total={pagination.totalPages}
                page={pagination.page}
                onChange={handleChangePage}
                siblings={2}
                boundaries={1}
                classNames={{
                    base: "w-fit p-0",
                }}
            />
        </div>
    );
};

export default TransactionsGridPagination;
