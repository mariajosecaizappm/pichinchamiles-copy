"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { formatPriceQuantities } from "@/presentation/helpers/quantities";

type ShoppingCartCopaymentAccordionProps = {
    subtotal: number;
    taxes: number;
    total: number;
};

const ShoppingCartCopaymentAccordion = ({
    subtotal,
    taxes,
    total,
}: ShoppingCartCopaymentAccordionProps) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="w-full overflow-hidden rounded-sm p-5 border border-blue-500">
            <button
                type="button"
                className="cursor-pointer flex w-full items-center justify-between gap-3 text-left"
                onClick={() => setIsOpen(prev => !prev)}
                aria-expanded={isOpen}
            >
                <span className="text-[22px] font-semibold leading-7 text-blue-500">Copago</span>
                <span className="ml-auto text-[22px] font-semibold leading-7 text-blue-500">
                    ${formatPriceQuantities(total)}
                </span>
                <Icon
                    icon="mdi:chevron-up"
                    className={`size-6 shrink-0 text-blue-500 transition-transform ${isOpen ? "" : "rotate-180"}`}
                />
            </button>
            {isOpen && (
                <div className="mt-1 space-y-1">
                    <div className="flex items-center justify-between text-base font-medium leading-6 text-blue-500">
                        <span>Subtotal copago</span>
                        <strong className="font-medium">${formatPriceQuantities(subtotal)}</strong>
                    </div>
                    <div className="flex items-center justify-between text-base font-medium leading-6 text-blue-500">
                        <span>IVA</span>
                        <strong className="font-medium">${formatPriceQuantities(taxes)}</strong>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShoppingCartCopaymentAccordion;
