"use client"

import React from 'react';
import clsx from 'clsx';
import AppLink from '@/presentation/components/AppLink';
import Button from '@/presentation/pages/Home/components/Button';
import { SectionBannerContentProps } from './type';

const SectionBannerContent: React.FC<SectionBannerContentProps> = ({
    title,
    subtitle,
    buttonText,
    linkButton,
    className,
    children,
    typeButton = "primary",
    buttonClassName
}) => {
    const actionLabel = linkButton && buttonText ? buttonText : "Ver más";
    const linkAriaLabel = subtitle
        ? `${actionLabel}: ${title} - ${subtitle}`
        : `${actionLabel}: ${title}`;

    return (
        <div className={clsx('flex flex-col justify-end gap-3 rounded-lg', className)}>
            <h2 className="text-white typo-banner-title">{title}</h2>
            {subtitle && <p className="text-white typo-banner-subtitle">{subtitle}</p>}
            {children}
            <div>
                <Button
                    as={AppLink}
                    href={linkButton}
                    aria-label={linkAriaLabel}
                    variant={typeButton}
                    className={clsx('py-2 px-4 md:py-2 h-10 md:h-10', buttonClassName)}
                    aria-hidden="true"
                >
                    {actionLabel}
                </Button>
            </div>
        </div>
    );
};

export default SectionBannerContent;
