"use client"

import { Divider, Skeleton } from "@heroui/react"
import ProductsListSkeleton from "../ProductsList/ProductsListSkeleton"
import ProductsBreadcrumbsSkeleton from "./ProductsBreadcrumbsSkeleton"

const ProductsContentSkeleton = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-4 body-container lg:py-3">
            <div className="block lg:hidden">
                <div className="flex flex-wrap gap-2.5 w-full py-2">
                    {Array.from({ length: 3 }).map((_, index) => {
                        const key = `mobile-filter-${index}`
                        return (
                            <Skeleton
                                className="w-20 h-10 rounded-lg"
                                key={key} />
                        )
                    })}
                </div>
                <ProductsBreadcrumbsSkeleton />
            </div>
            <aside className="hidden lg:block lg:sticky lg:top-[100px] lg:self-start w-full max-w-77 shrink-0 bg-white">
                <div className="flex flex-col gap-3">
                    <div className="pt-4 flex flex-col gap-4">
                        <Skeleton className="w-24 h-6 rounded-sm" />
                        <Divider className="bg-darkGrayishBlue-300" />
                        <Skeleton className="w-full h-15 rounded-sm" />
                        <Skeleton className="w-full h-15 rounded-sm" />
                        <Skeleton className="w-full h-15 rounded-sm" />
                        <Skeleton className="w-full h-15 rounded-sm" />
                    </div>
                </div>
            </aside>
            <div className="flex-1">
                <ProductsListSkeleton />
            </div>
        </div>

    )
}

export default ProductsContentSkeleton