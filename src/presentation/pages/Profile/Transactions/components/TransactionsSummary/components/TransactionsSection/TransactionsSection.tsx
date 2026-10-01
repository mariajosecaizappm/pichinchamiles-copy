import React, {FC} from 'react';
import TransactionAccordionSection
    from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionsSummaryAccordion/components/TransactionAccordionSection";
import BankStatement from "@/domain/entity/Transaction/bankStatement";

type TransactionsSectionProps = {
    bankStatement: BankStatement
}

const TransactionsSection: FC<TransactionsSectionProps> = ({bankStatement}) => {
    return (
        <>
            <div className="p-4 border border-darkGrayishBlue-300 rounded-lg [grid-area:accreditations]">
                <TransactionAccordionSection
                    title="Acumulaciones"
                    titleClassName="text-body"
                    type="increment"
                    total={bankStatement.accreditations.totalPoints}
                    details={[
                        {label: "Consumos", value: bankStatement.accreditations.consumptions, icon: "icon-credit-card"},
                        {label: "Promociones", value: bankStatement.accreditations.promos, icon: "icon-local-offer"},
                    ]}
                />
            </div>
            <div className="p-4 border border-darkGrayishBlue-300 rounded-lg [grid-area:debits]">
                <TransactionAccordionSection
                    title="Redenciones"
                    type="decrement"
                    titleClassName="text-body"
                    total={bankStatement.debits.totalPoints}
                    details={[
                        {label: "Viajes", value: bankStatement.debits.travels, icon: "icon-flight"},
                        {label: "Productos", value: bankStatement.debits.products, icon: "icon-local-mall"},
                        {label: "Donaciones", value: bankStatement.debits.donations, icon: "icon-pets"},
                        {label: "Otros", value: bankStatement.debits.others, icon: "icon-library-books"},
                    ]}
                />
            </div>
            <div className="p-4 border border-darkGrayishBlue-300 rounded-lg [grid-area:transactions]">
                <TransactionAccordionSection
                    title="Transferencias"
                    titleClassName="text-body"
                    details={[
                        {label: "Millas recibidas", value: bankStatement.accreditations.receivedTransfers},
                        {label: "Millas enviadas", value: bankStatement.debits.sentTransfers}
                    ]}
                />
            </div>
        </>
    );
};

export default TransactionsSection;
