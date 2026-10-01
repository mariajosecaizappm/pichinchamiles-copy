import React, {FC} from 'react';
import BankStatement from "@/domain/entity/Transaction/bankStatement";
import TransactionSummaryCard
    from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionSummaryCard";
import TransactionsSummaryAccordion
    from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionsSummaryAccordion";
import useIsDesktop from "@/presentation/hooks/useIsDesktop";
import TransactionsSection
    from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionsSection";

type TransactionsSummaryProps = {
    bankStatement: BankStatement
}

const TransactionsSummary: FC<TransactionsSummaryProps> = ({bankStatement}) => {
    const { isDesktop } = useIsDesktop();
    return (
        <div className="md:grid md:grid-cols-3 md:[grid-template-areas:'total_accreditations_debits'_'transactions_accreditations_debits'] md:gap-4">
            <TransactionSummaryCard bankStatement={bankStatement}/>
            {isDesktop
                ? <TransactionsSection bankStatement={bankStatement}/>
                : <TransactionsSummaryAccordion bankStatement={bankStatement}/>
            }
        </div>
    );
};

export default TransactionsSummary;
