import Link from "next/link";
import React from "react";

type Props = {
    label: string;
    href?: string;
    icon: React.ReactNode;
    active?: boolean;
    isLoading?: boolean;
    onClick?: () => void;
    role?: string;
    ariaSelected?: boolean;
    ariaLabel?: string;
}


type PillContentProps = Omit<Props, "href">

const PillContent = ({ label, icon, active = false, isLoading = false, onClick }: PillContentProps) => {
    return (
        <button
            data-active={active}
            data-loading={isLoading}
            onClick={onClick}
            className="w-full min-w-[88px] h-24 flex flex-col items-center justify-center gap-3 cursor-pointer group">
            <div className={"w-10 h-10 rounded-full bg-darkGrayishBlue-100 text-blue-500 flex items-center justify-center group-hover:bg-darkGrayishBlue-500 transition-colors duration-200 group-data-[active=true]:bg-darkGrayishBlue-500 group-data-[loading=true]:animate-pulse"}>
                {icon}
            </div>
            <span className="text-sm font-normal text-grayscale-500 text-center whitespace-nowrap">
                {label}
            </span>
        </button>
    );
}

const CategoryPill = ({ label, href, icon, active = false, isLoading = false, onClick, role, ariaSelected, ariaLabel }: Props) => {

    const content = <PillContent label={label} icon={icon} active={active} isLoading={isLoading} onClick={onClick} />;
    const linkComponent = href ? (
        <Link
            href={href}
            role={role}
            aria-selected={ariaSelected}
            aria-label={ariaLabel ?? label}
        >
            {content}
        </Link>
    ) : null;
  
    return linkComponent ?? content;
};

export default CategoryPill;
