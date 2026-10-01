"use client";

import React, { useContext } from 'react';
import { VisibilityContext } from 'react-horizontal-scrolling-menu';
import IconCarouselArrowLeft from '@/presentation/components/icons/IconCarouselArrowLeft';
import { ArrowButton } from './ArrowButton';
import { cn } from '@heroui/react';


type Props = {
    className?: string;
    infinite?: boolean;
}

export const LeftArrow: React.FC<Props> = ({ className, infinite = false }) => {
    const visibility = useContext(VisibilityContext);

    const handleLeftClick = () => {
        if (!infinite) {
            visibility.scrollPrev();
            return;
        }

        const prevElement = visibility.getPrevElement();
        if (!prevElement) {
            const lastItem = visibility.items.last();
            if (lastItem) {
                visibility.scrollToItem(lastItem, 'smooth');
            }
        } else {
            visibility.scrollPrev();
        }
    };


    return (
        <ArrowButton aria-label="Anterior" className={cn("left-0 shadow-[5px_5px_10px_-8px_rgba(7,7,7,0.15)]", className)} disabled={false} onClick={handleLeftClick}>
            <IconCarouselArrowLeft />
        </ArrowButton>
    );
};
