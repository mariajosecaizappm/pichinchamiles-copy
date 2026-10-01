'use client';

import React from 'react';
import clsx from 'clsx';
import { Icon } from '@iconify/react';
import { Accordion as AccordionUI, AccordionItem, cn } from "@heroui/react";

export interface AccordionItem {
  id: string;
  title: string | React.ReactNode;
  content: React.ReactNode;
  hasHtml?: boolean;
  titleClassName?: string;
  triggerClassName?: string;
}

type AccordionProps = {
  items: AccordionItem[];
  className?: string;
  itemClassName?: string;
  allowMultiple?: boolean;
  disablePadding?: boolean;
  indicatorClassName?: string;
  triggerClassName?: string;
  titleClassName?: string;
} & Omit<React.ComponentProps<typeof AccordionUI>, 'items' | 'className' | 'selectionMode' | 'children'>;

interface AccordionIndicatorProps {
  isOpen?: boolean;
}

const AccordionIndicator: React.FC<AccordionIndicatorProps> = ({ isOpen }) => (
    <Icon icon={isOpen ? "ph:caret-right-bold" : "ph:caret-down-bold"} width={20} fill='currentColor'/>
);

const indicatorRenderer = ({ isOpen }: { isOpen?: boolean }) => <AccordionIndicator isOpen={isOpen} />;

const Accordion: React.FC<AccordionProps & Omit<React.ComponentProps<typeof AccordionUI>, 'children'>> = ({ 
    items, 
    className = '',
    allowMultiple = false,
    itemClassName = '',
    disablePadding = false,
    indicatorClassName = '',
    triggerClassName = '',
    titleClassName = '',
    ...props
}) => {
    return (
        <AccordionUI 
            className={clsx(
                'px-0', 
                className,
                disablePadding && '[&_[data-orientation="vertical"][data-collection^="react-aria"]]:pl-0 [&_[data-orientation="vertical"][data-collection^="react-aria"]]:pr-0'
            )}
            selectionMode={allowMultiple ? "multiple" : "single"}
            {...props}
            {...props}
        >
            {items.map((item) => (
                <AccordionItem 
                    key={item.id}
                    title={item.title}
                    indicator={indicatorRenderer}
                    classNames={{
                        title: cn("text-body leading-body font-bold font-sans text-dropdown-title", titleClassName),
                        trigger: cn("py-5 cursor-pointer", triggerClassName, item.triggerClassName),
                        indicator: cn("text-blue-500", indicatorClassName),
                        content: itemClassName
                    }}
                
                >
                    {item.hasHtml ? (
                        <div 
                            className={cn("base-paragraph", itemClassName)}
                            dangerouslySetInnerHTML={{ __html: item.content as string }}
                        />
                    ) : (
                        <div className={cn("base-paragraph", itemClassName)}>
                            {item.content}
                        </div>
                    )}
                </AccordionItem>
            ))}
        </AccordionUI>
    );
};

export default Accordion;
