"use client"

import { Skeleton } from "@heroui/react"
import ProductBreadcrumbsSkeleton from "./ProductBreadcrumbs/ProductBreadcrumbsSkeleton"
import PaymentOptionsSkeleton from "./ProductForm/components/PaymentOptions/PaymentOptionsSkeleton"
import ProductGallerySkeleton from "./ProductGallery/ProductGallerySkeleton"
import ProductSearchToolbarSkeleton from "./ProductSearchToolbar/ProductSearchToolbarSkeleton"
import RelatedProductsSkeleton from "./RelatedProducts/RelatedProductsSkeleton"

const ProductDetailsSkeleton = () => {
    return (
        <div className="py-3 lg:py-6">
            <div className="body-container">
                {/* <ProductSearchToolbar /> */}
                <ProductSearchToolbarSkeleton />
            </div>
            <div className="body-container py-3">
                <div className="mb-4">
                    <ProductBreadcrumbsSkeleton />
                </div>

                {/* Layout: single column on mobile, two columns on desktop */}
                <div className="flex flex-col lg:flex-row lg:gap-4 lg:items-start">
                    {/* Left col: gallery + description (desktop only wrapper) */}
                    <div className="lg:w-1/2 lg:shrink-0 lg:flex lg:flex-col lg:gap-6">
                        {/* <ProductGallery */}
                        <ProductGallerySkeleton />

                        {/* Description: visible only on desktop here */}
                        <div className="hidden lg:block">
                            {/* Accordion trigger */}
                            <div className="h-16 flex items-center justify-between">
                                <Skeleton className="w-32 h-4  rounded" />
                                <Skeleton className="w-3 h-3  rounded" />
                            </div>
                            {/* Accordion content */}
                            <div className="py-2">
                                <div className="h-6 flex items-center">
                                    <Skeleton className="w-[94%] h-4  rounded" />
                                </div>
                                <div className="h-6 flex items-center">
                                    <Skeleton className="w-[91%] h-4  rouded" />
                                </div>
                                <div className="h-6 flex items-center">
                                    <Skeleton className="w-2/4 h-4  rounded" />
                                </div>
                                <div className="h-6 flex items-center">
                                    <Skeleton className="w-3/4 h-4  rounded" />
                                </div>
                                <div className="h-6 flex items-center">
                                    <Skeleton className="w-1/6 h-4  rounded" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right col: details + actions */}
                    <div className="space-y-5 pt-3 lg:self-start w-full">
                        <div className="space-y-4 lg:flex-1">
                            {/* Product name */}
                            <div className="h-7 flex items-center w-full max-w-80 lg:max-w-96">
                                <Skeleton className="h-6 w-full rounded" />
                            </div>
                            {/* <ProductMeta /> */}
                            <section className="space-y-1 lg:space-y-2">
                                <div className="h-6 flex items-center">
                                    <Skeleton className="h-4 w-full max-w-40 rounded" />
                                </div>
                                <div className="h-6 flex items-center">
                                    <Skeleton className="h-4 w-full max-w-32 rounded" />
                                </div>
                            </section>
                            {/* <ProductPrice  /> */}
                            <section>
                                <div className="h-5 flex items-center mb-1">
                                    <Skeleton className="h-3 w-10 rounded" />
                                </div>
                                <div className="h-8 flex items-center">
                                    <Skeleton className="h-6 w-40 rounded-sm" />
                                </div>
                            </section>
                            <div className="py-2 lg:hidden">
                                <div className="h-px bg-darkGrayishBlue-300" />
                            </div>
                        </div>

                        {/* <ProductCustomization features={product.features} /> */}
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                                {/* // ProductVariantSelector */}
                                {Array.from({ length: 2 }).map((_, idx) => {
                                    const key = `variant-${idx}`;
                                    return (
                                        <div key={key} className="flex flex-col gap-2">
                                            <div className="h-4 flex items-center">
                                                <Skeleton className="h-3 w-16 rounded" />
                                            </div>
                                            <Skeleton className="h-12 w-full rounded-sm" />
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="w-1/2 lg:w-min pr-1 lg:pr-0">
                                <div className="flex flex-col gap-2">
                                    <div className="h-4 flex items-center">
                                        <Skeleton className="h-3 w-16 rounded" />
                                    </div>
                                    <Skeleton className="h-12 w-full lg:w-32 rounded-sm" />
                                </div>
                            </div>
                        </div>

                        {/* <PaymentOptions basePointsPrice={product.minPointsPrice} /> */}
                        <PaymentOptionsSkeleton />

                        {/* <AddToCart /> */}
                        <div className="w-full lg:w-min lg:min-w-50 lg:py-2">
                            <Skeleton className="h-12 w-full lg:w-50 rounded-sm" />
                        </div>

                        {/* DescriptionAccordion (mobile only) */}
                        <div className="lg:hidden pt-4">
                            <div className="border-b border-darkGrayishBlue-300 px-4">
                                <div className="h-16 flex items-center justify-between">
                                    <Skeleton className="h-4 w-32 rounded" />
                                    <Skeleton className="h-3 w-3 rounded" />
                                </div>
                            </div>
                        </div>

                        {/* <OrderNotice /> */}
                        <div className="border border-darkGrayishBlue-400 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-7 w-7 rounded" />
                                <div className="h-7 flex items-center flex-1">
                                    <Skeleton className="h-5 w-64 rounded" />
                                </div>
                            </div>
                            <div className="py-2">
                                <div className="h-px bg-darkGrayishBlue-400" />
                            </div>
                            <ul className="space-y-1 pl-3">
                                {[
                                    "w-3/4",
                                    "w-full",
                                    "w-5/6",
                                ].map((width, idx) => {
                                    const key = `notice-item-${idx}`;
                                    return (
                                        <li key={key} className="h-6 flex items-center gap-2">
                                            <Skeleton className="h-1.5 w-1.5 rounded-full shrink-0" />
                                            <Skeleton className={`h-4 ${width} rounded`} />
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:body-container">
                <RelatedProductsSkeleton />
            </div>
        </div>
    )
}

export default ProductDetailsSkeleton