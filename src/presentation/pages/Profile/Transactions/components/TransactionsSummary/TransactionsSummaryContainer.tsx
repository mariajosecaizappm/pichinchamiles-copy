import React from 'react';
import TransactionsSummary
    from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary/TransactionsSummary";
import {useQuery} from "@tanstack/react-query";
import container from "@/presentation/config/inversify.config";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetBankStatementUseCase from "@/domain/interactors/Transactions/GetBankStatementUseCase";
import TransactionsSummarySkeleton
    from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary/TransactionsSummarySkeleton";

const TransactionsSummaryContainer = () => {
    const getBankStatementUseCase = container.get<GetBankStatementUseCase>(UseCaseTypes.GetBankStatementUseCase);

    const { data: bankStatement, isLoading, isError } = useQuery({
        queryKey: ["bankStatement"],
        queryFn: () => getBankStatementUseCase.getBankStatement(),
        refetchOnWindowFocus: false
    })

    if(isLoading || !bankStatement || isError) return <TransactionsSummarySkeleton />;

    return <TransactionsSummary bankStatement={bankStatement}/>;
};

export default TransactionsSummaryContainer;
