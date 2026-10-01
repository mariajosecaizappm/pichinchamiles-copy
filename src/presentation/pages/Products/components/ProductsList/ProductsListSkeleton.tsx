"use client"

import { Skeleton } from "@heroui/react"
import ProductBreadcrumbsSkeleton from "../skeletons/ProductsBreadcrumbsSkeleton"

const ProductsListSkeletonCard = () => (
    <div className="flex min-h-[150px] flex-row overflow-hidden rounded-lg border border-darkGrayishBlue-500 bg-white lg:min-h-[311px] lg:flex-col">
        <Skeleton className="h-[150px] w-[140px] shrink-0 rounded-none lg:h-[200px] lg:w-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-3 lg:p-4">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
            <Skeleton className="mt-auto h-6 w-24 rounded" />
        </div>
    </div>
)

type Props = {
    count?: number
}

const ProductsListSkeleton = ({ count = 8 }: Props) => {
    return (
        <div>
            <div className="hidden lg:block">
                <ProductBreadcrumbsSkeleton />
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-4">
                {Array.from({ length: count }, (_, i) => (
                    <div key={i} className="min-w-0">
                        <ProductsListSkeletonCard />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductsListSkeleton
