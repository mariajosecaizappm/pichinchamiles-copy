'use client';

import React from 'react';
import { Breadcrumbs as BreadcrumbUI, BreadcrumbItem } from "@heroui/react";

export interface BreadcrumbItemProps {
  id: string;
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItemProps[];
  className?: string;
  separator?: string;
  itemClassName?: string;
  currentItemClassName?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
    items, 
    className = '',
    separator='/',
    itemClassName = '',
    currentItemClassName = ''
}) => {
    return (
        <BreadcrumbUI 
            className={className}
            separator={separator}
        >
            {items.map((item) => (
                <BreadcrumbItem 
                    key={item.id}
                    href={item.href}
                    isCurrent={item.isCurrent}
                    className={item.isCurrent ? currentItemClassName : itemClassName}
                >
                    {item.label}
                </BreadcrumbItem>
            ))}
        </BreadcrumbUI>
    );
};

export default Breadcrumb;
