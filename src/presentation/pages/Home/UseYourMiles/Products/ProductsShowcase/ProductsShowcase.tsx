"use client"
import React from 'react';
import clsx from 'clsx';
import Tabs from '@/presentation/components/Tabs/Tabs';
import ProductsCarousel from '../ProductsCarousel/ProductsCarousel';
import { SectionBanner  } from '@/presentation/components/Banner/SectionBanner/';
import type { Asset } from '@/domain/entity/Asset/asset';
import Link from 'next/link';
import { Product } from '@/domain/entity/Product/product';
import { cn } from '@heroui/react';

interface ProductsShowcaseProps {
    title: string;
    tabs?: {
        id: string;
        label: string;
        products: Product[];
        bannerTitle?: string;
        bannerBackgroundImage?: Asset;
        bannerButtonText?: string;
        bannerLinkButton?: string;
    }[];
    showBanner?: boolean;
    bannerTitle?: string;
    bannerButtonText?: string;
    bannerLinkButton?: string;
    bannerButtonClassName?:string;
    bannerTypeButton?: 'primary' | 'bordered',
    bannerBackgroundImage?: Asset;
    seeAllLink?:string;
    className?: string;
    ariaLabel?: string;
    onTabChange?: (tabId: string) => void;
    showArrows?: boolean;
}

const ProductsShowcase: React.FC<ProductsShowcaseProps> = ({
    title,
    tabs,
    showBanner = false,
    bannerTitle,
    bannerButtonText,
    bannerLinkButton,
    bannerButtonClassName,
    bannerBackgroundImage,
    bannerTypeButton,
    seeAllLink,
    className,
    ariaLabel,
    onTabChange,
    showArrows
}) => {
    const hasTabs = tabs && tabs.length > 0;

    const renderContent = (tab:{
        id:string,
        label: string,
        products:Product[],
        bannerTitle?: string,
        bannerBackgroundImage?: Asset,
        bannerButtonText?: string,
        bannerLinkButton?: string
    })=>{
        const currentBannerTitle = tab.bannerTitle ?? bannerTitle;
        const currentBannerBackgroundImage = tab.bannerBackgroundImage ?? bannerBackgroundImage;
        const currentBannerButtonText = tab.bannerButtonText ?? bannerButtonText;
        const currentBannerLinkButton = tab.bannerLinkButton ?? bannerLinkButton;
        
        return <div className='flex gap-3 flex-col lg:flex-row'>
            {showBanner && currentBannerTitle && (
                <SectionBanner
                    title={currentBannerTitle}
                    buttonText={currentBannerButtonText}
                    linkButton={currentBannerLinkButton ?? ""}
                    backgroundImage={currentBannerBackgroundImage}
                    className='lg:max-w-[412px] w-full h-[160px] lg:h-auto'
                    buttonClassName={bannerButtonClassName}
                    typeButton={bannerTypeButton}
                />
            )}
            <ProductsCarousel
                items={tab.products}
                showArrows={showArrows}
                wrapperClassName={cn("lg:flex-1")}
            />
        </div>
    }


    return (
        <section aria-label={`${ariaLabel ?? title}: carrusel de productos`} className={clsx('w-full py-6', className)}>
            <div className="flex flex-col gap-3 lg:body-container">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 px-6 xl:px-0">
                    <h2 aria-label={ariaLabel} className="text-[22px] font-slab leading-7 font-normal text-blue-500">
                        {title}
                    </h2>
                    {seeAllLink && (
                        <Link
                            href={seeAllLink}
                            aria-label={`Ver todos los productos de ${title}`}
                            className='cursor-pointer rounded-sm border border-blue-500 bg-white flex items-center justify-center p-2 w-full max-w-[94px] text-xs font-sans font-semibold gap-1.5 leading-normal text-blue-500 text-center h-[32px]'
                        >
                            <span className='ml-2'>
                                Ver todo
                            </span>
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M5.72667 11.06L8.78 8L5.72667 4.94L6.66667 4L10.6667 8L6.66667 12L5.72667 11.06Z" fill="#0F265C"/>
                            </svg>
                        </Link>
                    )}
                </div>

                {hasTabs ? (
                    <Tabs
                        defaultTab={tabs[0]?.id}
                        onTabChange={onTabChange}
                        items={tabs.map((tab) => ({
                            id: tab.id,
                            label: tab.label,
                            content: (
                                <>
                                    {renderContent(tab)}
                                </>
                            )
                        }))}
                        classNames={{
                            tabList: 'gap-0',
                            tab: 'px-4 py-2 lg:min-w-[144px] h-12',
                            tabContent: 'text-sm font-semibold',
                            panel: 'p-0'
                        }}
                    />
                ) : null}

            </div>
        </section>
    );
};

export default ProductsShowcase;