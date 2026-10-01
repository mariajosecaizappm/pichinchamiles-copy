import {useMemo} from 'react';
import {useQuery} from "@tanstack/react-query";
import {useSearchParams} from "next/navigation";
import container from "@/presentation/config/inversify.config";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetTransactionsUseCase from "@/domain/interactors/Transactions/GetTransactionsUseCase";
import {
    parseRangeParam,
    RANGE_QUERY_PARAM
} from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionListFilters/transactionListFilters.utils";

const PAGE_QUERY_PARAM = "page";
const PAGE_SIZE = 15;

const getPageParam = (value: string | null): number => {
    const parsedPage = Number(value);
    return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
};

const toStartOfDay = (year: number, month: number, day: number): Date => {
    return new Date(year, month - 1, day, 0, 0, 0, 0);
};

const toEndOfDay = (year: number, month: number, day: number): Date => {
    return new Date(year, month - 1, day, 23, 59, 59, 999);
};

const useTransactionsListQuery = () => {
    const getTransactionsUseCase = container.get<GetTransactionsUseCase>(UseCaseTypes.GetTransactionsUseCase);
    const searchParams = useSearchParams();
    const pageParam = searchParams.get(PAGE_QUERY_PARAM);
    const rangeParam = searchParams.get(RANGE_QUERY_PARAM);
    const page = useMemo(() => getPageParam(pageParam), [pageParam]);
    const range = useMemo(() => parseRangeParam(rangeParam), [rangeParam]);

    return useQuery({
        queryKey: ["transactions", page, rangeParam],
        queryFn: () => getTransactionsUseCase.getTransactions({
            page,
            pageSize: PAGE_SIZE,
            startDate: range?.start
                ? toStartOfDay(range.start.year, range.start.month, range.start.day)
                : undefined,
            endDate: range?.end
                ? toEndOfDay(range.end.year, range.end.month, range.end.day)
                : undefined,
        }),
        refetchOnWindowFocus: false
    });
};

export default useTransactionsListQuery;
