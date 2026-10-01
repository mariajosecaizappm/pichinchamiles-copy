import React, {FC} from 'react';
import {TransactionStatus} from "@/domain/entity/Transaction/transaction";

type TransactionStatusIconProps = {
    status: TransactionStatus;
}

const TransactionStatusChipIcon: FC<TransactionStatusIconProps> = ({status}) => {
    if (status === TransactionStatus.APPROVED) {
        return (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M7.99992 1.33398C4.31992 1.33398 1.33325 4.32065 1.33325 8.00065C1.33325 11.6807 4.31992 14.6673 7.99992 14.6673C11.6799 14.6673 14.6666 11.6807 14.6666 8.00065C14.6666 4.32065 11.6799 1.33398 7.99992 1.33398ZM6.66658 11.334L3.33325 8.00065L4.27325 7.06065L6.66658 9.44732L11.7266 4.38732L12.6666 5.33398L6.66658 11.334Z"
                    fill="#31A451"/>
            </svg>
        );
    }

    if (status === TransactionStatus.REJECTED) {
        return (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M7.99992 1.33398C4.31325 1.33398 1.33325 4.31398 1.33325 8.00065C1.33325 11.6873 4.31325 14.6673 7.99992 14.6673C11.6866 14.6673 14.6666 11.6873 14.6666 8.00065C14.6666 4.31398 11.6866 1.33398 7.99992 1.33398ZM11.3333 10.394L10.3933 11.334L7.99992 8.94065L5.60659 11.334L4.66658 10.394L7.05992 8.00065L4.66658 5.60732L5.60659 4.66732L7.99992 7.06065L10.3933 4.66732L11.3333 5.60732L8.93992 8.00065L11.3333 10.394Z"
                    fill="#D50707"/>
            </svg>
        );
    }

    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5.19853 1.78064C5.55488 1.16357 6.44513 1.16357 6.80149 1.78064L10.8247 8.74602C11.1811 9.3631 10.736 10.1344 10.0233 10.1344H1.97675C1.26404 10.1344 0.81891 9.3631 1.17526 8.74602L5.19853 1.78064Z"
                fill="#F76800"
            />
            <path
                d="M6 4.06641V6.51175"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
            <circle cx="6" cy="8.08984" r="0.666667" fill="white" />
        </svg>
    );
};

export default TransactionStatusChipIcon;
