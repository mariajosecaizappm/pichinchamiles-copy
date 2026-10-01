"use client";

import Accordion from '@/presentation/components/Accordion/Accordion';
import { FOOTER_ITEMS } from "./FooterConfig";
import AppLink from "@/presentation/components/AppLink";

const AccordionLinks = () => {

    return (
        <Accordion
            allowMultiple
            className="flex flex-col gap-4"
            showDivider={false}
            indicatorClassName="text-grayscale-500 w-6 h-6 flex items-center justify-center"
            triggerClassName="p-3"
            titleClassName="text-[18px] font-semibold text-grayscale-500"
            itemClassName="[&_a]:font-sans [&_a]:no-underline [&_a]:hover:underline text-grayscale-500 font-normal"
            items={FOOTER_ITEMS.map(item => ({
                id: item.title,
                title: item.title,
                content: (
                    <ul className="flex flex-col gap-2 px-3">
                        {item.links.map((link) => (
                            <li key={link.href}>
                                <AppLink href={link.href}>
                                    {link.label}
                                </AppLink>
                            </li>
                        ))}
                    </ul>
                )
            }))}
        />
    );
};

export default AccordionLinks;