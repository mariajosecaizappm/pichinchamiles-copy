
"use client";

import React, { useContext } from 'react';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';
import IconCarouselArrowRight from '@/presentation/components/icons/IconCarouselArrowRight';
import { ArrowButton } from './ArrowButton';
import { cn } from '@heroui/react';


type Props = {
    className?: string;
    infinite?: boolean;
}

export const RightArrow: React.FC<Props> = ({ className, infinite = false }) => {
    const visibility = useContext(VisibilityContext);

    const handleRightClick = () => {
        if (!infinite) {
            visibility.scrollNext();
            return;
        }

        const nextElement = visibility.getNextElement();
        if (!nextElement) {
            const firstItem = visibility.items.first();
            if (firstItem) {
                visibility.scrollToItem(firstItem, 'smooth');
            }
        } else {
            visibility.scrollNext();
        }
    };

    return (
        <ArrowButton aria-label="Siguiente" className={cn("right-0", className)} disabled={false} onClick={handleRightClick}>
            <IconCarouselArrowRight />
        </ArrowButton>
    );
};
