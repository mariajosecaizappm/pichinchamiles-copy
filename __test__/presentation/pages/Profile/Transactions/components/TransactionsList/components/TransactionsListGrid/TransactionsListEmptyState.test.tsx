import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import links from "@/presentation/config/links";
import TransactionsListEmptyState from "@/presentation/pages/Profile/Transactions/components/TransactionsList/components/TransactionsListGrid/TransactionsListEmptyState";

vi.mock("next/link", () => ({
    default: ({
        children,
        href,
        className,
    }: {
        children: React.ReactNode;
        href: string;
        className?: string;
    }) => (
        <a href={href} className={className}>
            {children}
        </a>
    ),
}));

vi.mock("@/presentation/components/Form/components/Button/Button", () => ({
    default: ({
        as: Component = "button",
        children,
        ...props
    }: {
        as?: React.ElementType;
        children: React.ReactNode;
        href?: string;
    }) => <Component {...props}>{children}</Component>,
}));

describe("TransactionsListEmptyState", () => {
    it("renders the empty state with a link to the products catalog", () => {
        render(<TransactionsListEmptyState />);

        expect(screen.getByTestId("transactions-list-empty-state")).toBeInTheDocument();
        expect(screen.getByText("No hay transacciones registradas")).toBeInTheDocument();
        expect(screen.getByText("Ir al catálogo de productos").closest("a")).toHaveAttribute(
            "href",
            links.products,
        );
    });

    it("hides the action button when requested", () => {
        render(
            <TransactionsListEmptyState
                withWhiteBackground={false}
                showActionButton={false}
            />,
        );

        expect(screen.getByTestId("transactions-list-empty-state")).not.toHaveClass("bg-white");
        expect(screen.queryByText("Ir al catálogo de productos")).not.toBeInTheDocument();
    });
});
