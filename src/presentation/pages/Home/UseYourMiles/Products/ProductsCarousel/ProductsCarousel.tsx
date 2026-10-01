"use client";

import React from 'react';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import clsx from 'clsx';
import ProductCard from '../ProductCard/ProductCard';
import { Product } from '@/domain/entity/Product/product';
import { LeftArrow } from '@/presentation/components/ScrollMenu/LeftArrow';
import { RightArrow } from '@/presentation/components/ScrollMenu/RightArrow';

interface ProductsCarouselProps {
    items: Product[];
    label?: string;
    itemClassName?: string;
    wrapperClassName?: string;
    scrollContainerClassName?: string;
    showArrows?: boolean;
}

const ProductsCarousel: React.FC<ProductsCarouselProps> = ({
    items,
    label = 'Carrusel de productos',
    itemClassName = '',
    wrapperClassName = '',
    scrollContainerClassName = '',
    showArrows = true,
}) => {
    const total = items.length;
    return (
        <section
            aria-label={label}
            aria-roledescription="carrusel"
            className='overflow-hidden'
        >
            <ScrollMenu
                LeftArrow={showArrows ? LeftArrow : undefined}
                RightArrow={showArrows ? RightArrow : undefined}
                wrapperClassName={clsx('relative overflow-hidden', wrapperClassName)}
                scrollContainerClassName={clsx('flex gap-4  items-stretch overflow-x-auto lg:overflow-hidden [&::-webkit-scrollbar]:hidden', scrollContainerClassName)}
                itemClassName={clsx('shrink-0', itemClassName)}
            >
                {items.map((item, index) => (
                    <article
                        key={item.id}
                        aria-label={`Producto ${index + 1} de ${total}`}
                        aria-roledescription="diapositiva"
                        className="h-full flex"
                    >
                        <ProductCard product={item} enlargePriceWithoutPrevious />
                    </article>
                ))}
            </ScrollMenu>
        </section>
    );
};

export default ProductsCarousel;