"use client"

import Accordion from "@/presentation/components/Accordion";
import { cn } from "@heroui/react";

type DescriptionAccordionProps = {
    description: string;
    contentClassName?: string;
}

const DescriptionAccordion = ({description, contentClassName}: DescriptionAccordionProps) => {
    return (
        <Accordion
            items={[{
                id: "product-description",
                title: 'Descripción del producto',
                content: description,
                hasHtml: true
            }]}
            itemClassName={cn("[&_ul]:list-disc [&_ul]:pl-7 [&_ul]:mt-2 [&_a]:font-sans", contentClassName)}
            defaultExpandedKeys={['product-description']}
        />
    );
};

export default DescriptionAccordion;