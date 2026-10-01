import React, {FC} from 'react';

type ActivationSummaryItemProps = {
    label: string;
    value: string;
}

const ActivationSummaryItem: FC<ActivationSummaryItemProps> = ({label, value}) => {
    return (
        <div className="flex flex-col text-grayScale-500" aria-label={`${label}: ${value}`}>
            <dt className="typo-main-body-semi-bold">{label}</dt>
            <dd className="typo-main-caption-book">{value}</dd>
        </div>
    );
};

export default ActivationSummaryItem;