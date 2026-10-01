"use client"

import { getLocalTimeZone, today } from "@internationalized/date";
import type { DateValue, RangeValue } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { DateRangePicker } from "@/presentation/components/Form/components/DateRangePicker";
import links from "@/presentation/config/links";
import {
    exceedsMaxRangeDays,
    MAX_RANGE_DAYS,
    parseRangeParam,
    RANGE_QUERY_PARAM,
    serializeRange,
} from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionListFilters/transactionListFilters.utils";

const TransactionListFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const rangeParam = searchParams.get(RANGE_QUERY_PARAM);

    const initialRange = useMemo(() => parseRangeParam(rangeParam), [rangeParam]);
    const [range, setRange] = useState<RangeValue<DateValue> | null>(initialRange);
    const maxValue = useMemo(() => today(getLocalTimeZone()), []);
    const rangeError = useMemo(() => {
        if (!range?.start || !range?.end) return undefined;

        return exceedsMaxRangeDays(range, MAX_RANGE_DAYS)
            ? `El rango seleccionado no puede superar los ${MAX_RANGE_DAYS} dias.`
            : undefined;
    }, [range]);

    useEffect(() => {
        setRange(initialRange);
    }, [initialRange]);

    const handleChange = (nextRange: RangeValue<DateValue> | null) => {
        setRange(nextRange);

        if (nextRange && (!nextRange.start || !nextRange.end)) {
            return;
        }

        if (nextRange?.start && nextRange?.end && exceedsMaxRangeDays(nextRange, MAX_RANGE_DAYS)) {
            return;
        }

        const params = new URLSearchParams(searchParams.toString());

        if (nextRange?.start && nextRange?.end) {
            params.set(RANGE_QUERY_PARAM, serializeRange(nextRange));
        } else {
            params.delete(RANGE_QUERY_PARAM);
        }

        params.delete("page");

        const queryString = params.toString();
        router.push(queryString ? `${links.myTransactions}?${queryString}` : links.myTransactions);
    };

    return (
        <div className="md:max-w-[312px]">
            <DateRangePicker
                aria-label="Filtrar por rango de fechas"
                label="Filtrar por rango de fechas"
                testId="transactionsListDateRangeFilter"
                value={range}
                maxValue={maxValue}
                isClearable
                isInvalid={!!rangeError}
                errorMessage={rangeError}
                onChange={handleChange}
            />
        </div>
    );
};

export default TransactionListFilters;
