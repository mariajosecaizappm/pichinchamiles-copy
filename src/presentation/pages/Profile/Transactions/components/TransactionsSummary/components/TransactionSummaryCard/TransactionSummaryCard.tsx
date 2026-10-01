import React, {FC} from 'react';
import BankStatement from "@/domain/entity/Transaction/bankStatement";
import {formatMiles} from "@/presentation/helpers/quantities";

type TransactionSummaryCardProps = {
    bankStatement: BankStatement;
}

const TransactionSummaryCard: FC<TransactionSummaryCardProps> = ({bankStatement}) => {
    const currentDate = new Intl.DateTimeFormat('es-EC', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());

    return (
        <div className="border border-darkGrayishBlue-300 rounded-lg p-4 [grid-area:total]">
            <p className="font-sans text-sm leading-5 font-normal text-grayscale-400 mb-1">
                {`Saldo disponible al ${currentDate}`}
            </p>
            <p className="font-sans text-[28px] font-semibold leading-8 text-grayscale-500">
                {formatMiles(bankStatement.balance)} millas
            </p>
        </div>
    );
};

export default TransactionSummaryCard;
