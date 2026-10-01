import React, {FC} from 'react';
import {formatMiles} from "@/presentation/helpers/quantities";
import SummaryRow
    from "@/presentation/pages/Profile/Transactions/components/TransactionsSummary/components/TransactionsSummaryAccordion/components/SummaryRow";
import {IconName} from "@/presentation/components/icons/Icon";

type TransactionsSummaryAccordionProps = {
    title: string
    total?: number
    type?: "increment" | "decrement"
    details: Array<{
        label: string
        value: number
        icon?: IconName
    }>
    titleClassName?: string
}

const TransactionAccordionSection: FC<TransactionsSummaryAccordionProps> = ({title, total, type, details, titleClassName}) => {
    const sectionColor = type === "increment" ? "text-success-500" : "text-information-500";
    const getSimbol = (value: number) =>{
        if(type && value > 0) return type === "increment" ? "+" : "-"
        return ""
    }

    return (
        <section className="space-y-3">
            <div>
                <h3 className={`font-sans text-sm leading-5 font-semibold text-neutral-950 ${titleClassName ?? ""}`}>
                    {title}
                </h3>
                {total !== undefined && (
                    <p className={`mt-1 font-sans text-[28px] font-semibold leading-8 ${sectionColor}`}>
                        {type === "increment" ? "+" : "-"} {formatMiles(total)} millas
                    </p>
                )}
            </div>
            <div className="space-y-2">
                {details.map((detail)=>(
                    <SummaryRow
                        key={detail.label}
                        label={detail.label}
                        value={detail.value}
                        icon={detail.icon}
                        iconClassName={sectionColor}
                        simbol={getSimbol(detail.value)}
                    />
                ))}
            </div>
        </section>
    );
};

export default TransactionAccordionSection;