'use client';

import React from 'react';
import clsx from 'clsx';
import { Breadcrumbs as BreadcrumbUI, BreadcrumbItem } from "@heroui/react";
import Icon from "@/presentation/components/icons/Icon";

interface BreadcrumbItemProps {
  id: string;
  label: string;
  href?: string;
  isCurrent?: boolean;
  
}

interface BreadcrumbForLayoutProps {
    items: BreadcrumbItemProps[];
    className?: string;
    separator?: string;
    homeHref?: string;
    itemClassName?: string;
}

const BreadcrumbForLayout: React.FC<BreadcrumbForLayoutProps> = ({ 
    items, 
    className = '',
    separator = '/',
    homeHref = '/',
    itemClassName = '',
    ...props
}) => {
    return (
        <BreadcrumbUI 
            className={clsx('text-gray-400 text-sm font-semibold font-sans leading-5 ',className)}
            separator={separator}
            {...props}
        >
            <BreadcrumbItem 
                key="home"
                href={homeHref}
                startContent={<Icon name="icon-house" className='text-grayscale-400 p-0.5' />}
                className={clsx('[&>span]:text-gray-400 *:data-[slot="separator"]:mx-1', itemClassName)}
                aria-label="Home"

            >
                {''}
            </BreadcrumbItem>
            {items.map((item) => (
                <BreadcrumbItem 
                    key={item.id}
                    href={item.href}
                    isCurrent={item.isCurrent}
                    className={clsx(item.isCurrent ? '[&>span]:text-blue-500' : '[&>span]:text-gray-400', '*:data-[slot="separator"]:mx-2', itemClassName)}
                >
                    {item.label}
                </BreadcrumbItem>
            ))}
        </BreadcrumbUI>
    );
};

export default BreadcrumbForLayout;
