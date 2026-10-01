import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TransactionsGridPagination from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/components/TransactionsGridPagination/TransactionsGridPagination";

const mocks = vi.hoisted(() => ({
    replace: vi.fn(),
    toString: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        replace: mocks.replace,
    }),
    usePathname: () => "/mi-perfil/transacciones",
    useSearchParams: () => ({
        toString: mocks.toString,
    }),
}));

vi.mock("@/presentation/components/Pagination", () => ({
    default: ({
        onChange,
        page,
        total,
    }: {
        onChange: (page: number) => void;
        page: number;
        total: number;
    }) => (
        <div>
            <div data-testid="pagination-state">{`${page}/${total}`}</div>
            <button type="button" onClick={() => onChange(2)}>
                go-page-2
            </button>
            <button type="button" onClick={() => onChange(1)}>
                go-page-1
            </button>
        </div>
    ),
}));

describe("TransactionsGridPagination", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.toString.mockReturnValue("foo=bar&page=3");
    });

    it("does not render pagination when there is only one page", () => {
        const { container } = render(
            <TransactionsGridPagination
                pagination={{
                    page: 1,
                    pageSize: 15,
                    total: 1,
                    totalPages: 1,
                }}
            />,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it("updates the page query param without scrolling", () => {
        render(
            <TransactionsGridPagination
                pagination={{
                    page: 1,
                    pageSize: 15,
                    total: 30,
                    totalPages: 2,
                }}
            />,
        );

        expect(screen.getByTestId("pagination-state")).toHaveTextContent("1/2");
        fireEvent.click(screen.getByText("go-page-2"));

        expect(mocks.replace).toHaveBeenCalledWith(
            "/mi-perfil/transacciones?foo=bar&page=2",
            { scroll: false },
        );
    });

    it("removes the page param when navigating back to the first page", () => {
        render(
            <TransactionsGridPagination
                pagination={{
                    page: 2,
                    pageSize: 15,
                    total: 30,
                    totalPages: 2,
                }}
            />,
        );

        fireEvent.click(screen.getByText("go-page-1"));

        expect(mocks.replace).toHaveBeenCalledWith(
            "/mi-perfil/transacciones?foo=bar",
            { scroll: false },
        );
    });
});
