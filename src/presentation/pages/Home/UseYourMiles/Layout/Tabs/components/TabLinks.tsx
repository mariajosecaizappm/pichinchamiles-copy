"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { cn } from "@heroui/react";

export interface TabLink {
  id: string;
  label: string;
  href: string;
}

export interface TabLinksClassNames {
  active?: string;
  inactive?: string;
}

export const TAB_LINKS_DEFAULT_CLASS_NAMES = {
    active: "text-sm text-blue-500 font-semibold",
    inactive: "text-sm text-gray-500 hover:text-gray-700",
} as const;

interface TabLinksProps {
    tabs: TabLink[];
    className?: string;
    classNames?: TabLinksClassNames;
    onTabClick?: (tabId: string) => void;
}

const TabLinks = ({ tabs, className, classNames, onTabClick }: TabLinksProps) => {
    const pathname = usePathname();

    const getActiveTab = () => {
        return tabs.find(tab => pathname.startsWith(tab.href))?.id ?? "";
    };

    const activeTabId = getActiveTab();
    const activeClassName = classNames?.active ?? TAB_LINKS_DEFAULT_CLASS_NAMES.active;
    const inactiveClassName = classNames?.inactive ?? TAB_LINKS_DEFAULT_CLASS_NAMES.inactive;
    const activeTabRef = useRef<HTMLAnchorElement | null>(null);

    useEffect(() => {
        activeTabRef.current?.scrollIntoView({ behavior: "instant", block: "nearest", inline: "center" });
    }, [activeTabId]);

    return (
        <div role="tablist" aria-label="Secciones principales" className={cn("flex overflow-x-auto", className)}>
            {tabs.map((tab) => {
                const isActive = tab.id === activeTabId;

                return (
                    <Link
                        key={tab.id}
                        href={tab.href}
                        ref={isActive ? activeTabRef : undefined}
                        role="tab"
                        onClick={onTabClick ? () => onTabClick(tab.id) : undefined}
                        aria-selected={isActive}
                        aria-label={`${tab.label}, ${isActive ? 'seleccionado' : 'no seleccionado'}`}
                        className={clsx(
                            "flex-1 h-12 flex flex-col items-center cursor-pointer text-center active:outline-none! focus:outline-none! whitespace-nowrap",
                            isActive ? activeClassName : inactiveClassName
                        )}
                    >
                        <span className="p-4 h-10 flex justify-center items-center shrink-0 self-stretch">

                            {tab.label}
                        </span>
                        <span
                            className="h-8 w-full flex items-end"
                            aria-hidden="true">
                            <div className={cn("w-full", isActive ? "bg-blue-500 h-0.5" : "h-px bg-darkGrayishBlue-200")}/>
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};

export default TabLinks;
