'use client';

import React from 'react';
import { Tabs as TabsUI, Tab, TabsVariantProps, TabsProps as TabsPropsUI } from "@heroui/react";
import clsx from 'clsx';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  isDisabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  className?: string;
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps & TabsVariantProps & TabsPropsUI> = ({ 
    items, 
    className = '',
    defaultTab,
    onTabChange,
    variant = 'underlined',
    color,
    ...props
}) => {
    const { classNames, ...restProps } = props;
    const { tabList, cursor, tab, tabContent, ...restClassNames } = classNames ?? {};

    return (
        <TabsUI 
            data-testid="tabs"
            className={clsx('', className)}
            defaultSelectedKey={defaultTab ?? items[0]?.id}
            onSelectionChange={(key) => onTabChange?.(key as string)}
            variant={variant}
            color={color}
            classNames={{
                tabList: clsx("p-0 gap-7 relative rounded-none p-0 border-b border-divider", tabList),
                cursor: clsx("bg-blue-500",cursor),
                tab: clsx("max-w-fit p-0 h-15", tab),
                tabContent: clsx("group-data-[selected=true]:text-blue-500 font-semibold text-lg", tabContent),
                ...restClassNames
            }}
            {...restProps}
        >
            {items.map((item) => (
                <Tab 
                    key={item.id}
                    data-testid={`tab-${item.id}`}
                    title={item.label}
                    isDisabled={item.isDisabled}
                    
                >
                    {item.content}
                </Tab>
            ))}
        </TabsUI>
    );
};

export default Tabs;
