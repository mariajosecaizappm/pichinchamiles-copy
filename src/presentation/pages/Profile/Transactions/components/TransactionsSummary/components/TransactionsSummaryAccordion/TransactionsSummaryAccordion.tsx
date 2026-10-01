"use client";

import React, {FC, useId, useState} from 'react';
import BankStatement from "@/domain/entity/Transaction/bankStatement";
import TransactionAccordionSection
    from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionsSummaryAccordion/components/TransactionAccordionSection";
import Icon from "@/presentation/components/icons/Icon";

type TransactionsSummaryAccordionProps = {
    bankStatement: BankStatement;
}

const TransactionsSummaryAccordion: FC<TransactionsSummaryAccordionProps> = ({bankStatement}) => {
    const [isOpen, setIsOpen] = useState(false);
    const contentId = useId();

    return (
        <div className="mt-3 overflow-hidden">
            <button
                type="button"
                className={`flex w-full items-start justify-between gap-3 pt-[12px] pb-4 text-left cursor-pointer ${!isOpen && "border-b border-darkGrayishBlue-300"}`}
                onClick={() => setIsOpen((currentState) => !currentState)}
                aria-expanded={isOpen}
                aria-controls={contentId}
            >
                <div>
                    <p className="typo-main-body-semi-bold">
                        Resumen historico de millas
                    </p>
                    <p className="font-sans text-sm leading-5 font-normal text-grayscale-400">
                        Movimientos totales en el programa
                    </p>
                </div>
                <Icon
                    name="icon-arrow-down"
                    className={`size-6 shrink-0 text-blue-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            {isOpen && (
                <div
                    id={contentId}
                    className="border-b border-darkGrayishBlue-300 pb-4 pt-3"
                >
                    <div className="space-y-5">
                        <TransactionAccordionSection
                            title="Acumulaciones"
                            type="increment"
                            total={bankStatement.accreditations.totalPoints}
                            details={[
                                {label: "Consumos", value: bankStatement.accreditations.consumptions, icon: "icon-credit-card"},
                                {label: "Promociones", value: bankStatement.accreditations.promos, icon: "icon-local-offer"},
                            ]}
                        />

                        <TransactionAccordionSection
                            title="Redenciones"
                            type="decrement"
                            total={bankStatement.debits.totalPoints}
                            details={[
                                {label: "Viajes", value: bankStatement.debits.travels, icon: "icon-flight"},
                                {label: "Productos", value: bankStatement.debits.products, icon: "icon-local-mall"},
                                {label: "Donaciones", value: bankStatement.debits.donations, icon: "icon-pets"},
                                {label: "Otros", value: bankStatement.debits.others, icon: "icon-library-books"},
                            ]}
                        />

                        <TransactionAccordionSection
                            title="Transferencias"
                            details={[
                                {label: "Millas recibidas", value: bankStatement.accreditations.receivedTransfers},
                                {label: "Millas enviadas", value: bankStatement.debits.sentTransfers}
                            ]}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionsSummaryAccordion;
