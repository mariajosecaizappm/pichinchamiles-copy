import { describe, expect, it, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import useTransactionsListQuery from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/useTransactionsListQuery";

const mocks = vi.hoisted(() => ({
    containerGet: vi.fn(),
    useQuery: vi.fn(),
    searchParamsGet: vi.fn(),
    getTransactions: vi.fn(),
}));

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}));

vi.mock("next/navigation", () => ({
    useSearchParams: () => ({
        get: mocks.searchParamsGet,
    }),
}));

vi.mock("@tanstack/react-query", () => ({
    useQuery: (options: unknown) => mocks.useQuery(options),
}));

describe("useTransactionsListQuery", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.containerGet.mockReturnValue({
            getTransactions: mocks.getTransactions,
        });
        mocks.useQuery.mockImplementation((options) => options);
    });

    it("uses page and range from search params to build the query", async () => {
        mocks.searchParamsGet.mockImplementation((key: string) => {
            if (key === "page") return "3";
            if (key === "range") return "2026-07-01,2026-07-16";
            return null;
        });
        mocks.getTransactions.mockResolvedValueOnce({ data: [], pagination: {} });

        const { result } = renderHook(() => useTransactionsListQuery());
        const queryOptions = result.current as any;

        expect(queryOptions.queryKey).toEqual(["transactions", 3, "2026-07-01,2026-07-16"]);

        await queryOptions.queryFn();

        expect(mocks.getTransactions).toHaveBeenCalledWith({
            page: 3,
            pageSize: 15,
            startDate: new Date(2026, 6, 1, 0, 0, 0, 0),
            endDate: new Date(2026, 6, 16, 23, 59, 59, 999),
        });
    });

    it("falls back to page one and omits dates when search params are invalid", async () => {
        mocks.searchParamsGet.mockImplementation((key: string) => {
            if (key === "page") return "0";
            if (key === "range") return "invalid-range";
            return null;
        });
        mocks.getTransactions.mockResolvedValueOnce({ data: [], pagination: {} });

        const { result } = renderHook(() => useTransactionsListQuery());
        const queryOptions = result.current as any;

        expect(queryOptions.queryKey).toEqual(["transactions", 1, "invalid-range"]);

        await queryOptions.queryFn();

        expect(mocks.getTransactions).toHaveBeenCalledWith({
            page: 1,
            pageSize: 15,
            startDate: undefined,
            endDate: undefined,
        });
    });
});
