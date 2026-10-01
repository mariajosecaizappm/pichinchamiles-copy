"use client";

import type {Category} from '@/domain/entity/Category/structure/category';
import {Icon, IconName} from '@/presentation/components/icons/Icon';
import links from '@/presentation/config/links';
import React from 'react';
import CategoryPill from '../../Layout/components/CategoryPill';
import CarouselCategories from "../../Layout/Tabs/components/CarouselCategories";
import useIsDesktop from '@/presentation/hooks/useIsDesktop';
import IconShoppingBag from '@/presentation/components/icons/IconShoppingBag';
import {useParams, usePathname, useSearchParams} from 'next/navigation';
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";

interface ProductCategoriesProps {
    categories: Category[];
    className?: string;
    wrapperClassName?: string;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
    categories,
    className,
    wrapperClassName,
}) => {
    const { isDesktop } = useIsDesktop()
    const searchParams = useSearchParams()
    const pathName = usePathname()
    const { track } = useAnalytics()

    const { category: currentCategorySlug } = useParams() as { category?: string }

    const getIconName = (iconName: string): IconName => {
        return `icon-${iconName}` as IconName;
    };

    const buildHref = (categorySlug?: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('subcategory')
        params.delete('brand')
        params.delete('page')
        const basePath = categorySlug
            ? `${links.productsList}/categoria/${categorySlug}`
            : links.productsList
        const query = params.toString()
        return query ? `${basePath}?${query}` : basePath
    }

    const allCategories = [
        {
            id: "all",
            content: (
                <CategoryPill
                    key="all"
                    label="Todos"
                    href={buildHref()}
                    icon={<IconShoppingBag />}
                    active={pathName === links.productsList && !currentCategorySlug}
                />
            )
        }
    ]

    const categoryItems = categories.map((category) => {
        const isActive = currentCategorySlug === category.slug
        return {
            id: category.id,
            content: (
                <CategoryPill
                    key={category.id}
                    label={category.name}
                    href={buildHref(isActive ? undefined : category.slug)}
                    icon={<Icon name={getIconName(category.icon as string)} size={24} />}
                    active={isActive}
                    onClick={() => track(EventName.CLICKED_FILTERS, {type: "category", filter: category})}
                />
            ),
        }
    });

    const activeIndex = currentCategorySlug
        ? categories.findIndex(c => c.slug === currentCategorySlug) + 1
        : 0;

    const carouselItems = [...allCategories, ...categoryItems].map(item => item.content);

    return (
        <CarouselCategories
            items={carouselItems}
            activeItemIndex={activeIndex}
            ariaLabel={`Carrusel de categorías de productos: El carrusel incluye las ${carouselItems.length} categorías de productos.`}
            itemClassName='grid place-items-center'
            showArrowsOnMobile={false}
            scrollContainerClassName={className}
            wrapperClassName={wrapperClassName}
            showArrows={isDesktop}
        />
    );
};      

export default ProductCategories;
