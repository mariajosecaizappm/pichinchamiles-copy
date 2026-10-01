"use client";

import React, { useRef } from 'react';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import clsx from 'clsx';
import { useScrollActiveItemIntoView } from '@/presentation/hooks/useScrollActiveItemIntoView';
import LeftArrowWithMobile from './LeftArrowWithMobile';
import RightArrowWithMobile from './RightArrowWithMobile';

interface CarouselCategoriesProps {
    items: React.ReactNode[];
    itemClassName?: string;
    wrapperClassName?: string;
    scrollContainerClassName?: string;
    showArrows?: boolean;
    showArrowsOnMobile?: boolean;
    ariaLabel: string;
    activeItemIndex?: number;
}

const CarouselCategories: React.FC<CarouselCategoriesProps> = ({
    items,
    itemClassName = '',
    wrapperClassName = '',
    scrollContainerClassName = '',
    showArrows = true,
    showArrowsOnMobile = true,
    ariaLabel,
    activeItemIndex,
}) => {
    const activeItemRef = useRef<HTMLDivElement>(null);

    useScrollActiveItemIntoView(activeItemRef, [activeItemIndex]);

    return (
        <section
            aria-label={ariaLabel}
            aria-roledescription="carrusel"
            className='overflow-hidden'
        >
            <ScrollMenu
                LeftArrow={showArrows ? <LeftArrowWithMobile
                    infinite={true}
                    showArrowsOnMobile={showArrowsOnMobile} /> : undefined}
                RightArrow={showArrows ? <RightArrowWithMobile
                    infinite={true}
                    showArrowsOnMobile={showArrowsOnMobile} /> : undefined}
                wrapperClassName={clsx('relative overflow-hidden', wrapperClassName)}
                scrollContainerClassName={clsx('lg:max-w-[80%] lg:mx-auto flex gap-3 items-stretch overflow-x-auto lg:overflow-x-auto [&::-webkit-scrollbar]:hidden', scrollContainerClassName)}
                itemClassName={clsx('shrink-0', itemClassName)}
            >
                {items.map((item, index) => {
                    const itemId = `carousel-item-${index}`;
                    return (
                        <div key={itemId} data-item-id={itemId} ref={index === activeItemIndex ? activeItemRef : undefined}>
                            {item}
                        </div>
                    );
                })}
            </ScrollMenu>
        </section>
    );
};

export default CarouselCategories;
