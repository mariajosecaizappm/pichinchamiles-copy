import React, {FC} from 'react';
import {TransactionStatus} from "@/domain/entity/Transaction/transaction";
import TransactionStatusChipIcon
    from "@/presentation/pages/Profile/Transactions/components/TransactionDetailModal/components/TransactionDetailModalSection/components/TransactionStatusChip/TransactionStatusChipIcon";

type TransactionStatusChipProps = {
    status: TransactionStatus
}

const STATUS_CONFIG: Record<TransactionStatus, {
    label: string;
    textColor: string;
    backgroundColor: string;
    borderColor: string;
    hasIconContainer: boolean;
    iconBackgroundColor: string;
    iconBorderColor: string;
}> = {
    [TransactionStatus.APPROVED]: {
        label: 'Aprobado',
        textColor: '#31A451',
        backgroundColor: '#ECF6EE',
        borderColor: '#B4DCBE',
        hasIconContainer: true,
        iconBackgroundColor: 'transparent',
        iconBorderColor: 'transparent',
    },
    [TransactionStatus.REJECTED]: {
        label: 'Rechazado',
        textColor: '#D50707',
        backgroundColor: '#FBE6E6',
        borderColor: '#EE9C9C',
        hasIconContainer: true,
        iconBackgroundColor: 'transparent',
        iconBorderColor: 'transparent',
    },
    [TransactionStatus.PENDING]: {
        label: 'Pendiente',
        textColor: '#F76800',
        backgroundColor: '#FDE1CC',
        borderColor: '#F7C49D',
        hasIconContainer: false,
        iconBackgroundColor: '#FFFFFF',
        iconBorderColor: '#F7C49D',
    },
};

const TransactionStatusChip: FC<TransactionStatusChipProps> = ({status}) => {
    const config = STATUS_CONFIG[status] ?? STATUS_CONFIG[TransactionStatus.PENDING];

    return (
        <span
            className="inline-flex items-center gap-1 rounded-full border p-1 pr-2"
            style={{
                color: config.textColor,
                backgroundColor: config.backgroundColor,
                borderColor: config.borderColor,
            }}
        >
            <span
                className={`flex items-center justify-center ${config.hasIconContainer ? 'h-4 w-4 rounded-full border' : ''}`}
                style={{
                    backgroundColor: config.hasIconContainer ? config.iconBackgroundColor : 'transparent',
                    borderColor: config.hasIconContainer ? config.iconBorderColor : 'transparent',
                }}
            >
                <TransactionStatusChipIcon status={status} />
            </span>
            <span className="typo-main-legal-medium leading-none">
                {config.label}
            </span>
        </span>
    );
};

export default TransactionStatusChip;
