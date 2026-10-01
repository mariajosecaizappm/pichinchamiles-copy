import React from 'react';
import Link from "next/link";
import Button from "@/presentation/components/Form/components/Button/Button";
import links from "@/presentation/config/links";

type TransactionsListEmptyStateProps = {
    buttonLabel?: string;
    buttonHref?: string;
    withWhiteBackground?: boolean;
    showActionButton?: boolean;
}

const TransactionsListEmptyState = ({
    buttonLabel = "Ir al catálogo de productos",
    buttonHref = links.products,
    withWhiteBackground = true,
    showActionButton = true,
}: TransactionsListEmptyStateProps) => {
    return (
        <section
            className={`order-3 mt-2 rounded-lg px-6 py-10 md:px-10 md:py-12 ${
                withWhiteBackground ? "bg-white" : ""
            }`}
            data-testid="transactions-list-empty-state"
        >
            <div className="mx-auto flex w-full max-w-[312px] flex-col items-center gap-4 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-darkGrayishBlue-100">
                    <div className="flex size-9 items-center justify-center rounded-full bg-information-500 text-2xl font-semibold leading-none text-white">
                        i
                    </div>
                </div>

                <output
                    className="max-w-[260px] font-slab font-normal text-[22px] leading-[28px] text-blue-500"
                    aria-live="polite"
                >
                    No hay transacciones registradas
                </output>
                {showActionButton && (
                    <Button as={Link} href={buttonHref} color="primary">
                        {buttonLabel}
                    </Button>
                )}
            </div>
        </section>
    );
};

export default TransactionsListEmptyState;
