import React, {FC} from "react";
import Icon, {IconName} from "@/presentation/components/icons/Icon";
import {formatMiles} from "@/presentation/helpers/quantities";

type SummaryRowProps = {
    label: string;
    value: number;
    icon?: IconName;
    iconClassName?: string;
    simbol: string;
}

const SummaryRow: FC<SummaryRowProps> = ({label, value, icon, simbol, iconClassName = "text-grayscale-400"}) => {
    return (
        <div className="flex items-center gap-3">
            <div className="flex gap-2 flex-1 items-center">
                {icon && (
                    <Icon name={icon} className={`size-6 shrink-0 block ${iconClassName}`}/>
                )}
                <span className="min-w-0 flex-1 font-sans text-sm leading-5 font-normal text-grayscale-500">
                    {label}
                </span>
            </div>
            <span className="h-4 w-px shrink-0 bg-darkGrayishBlue-400"/>
            <span className="whitespace-nowrap font-sans text-sm leading-5 font-semibold text-grayscale-500 flex-1 text-right">
                {simbol}{formatMiles(value)} millas
            </span>
        </div>
    );
};

export default SummaryRow;