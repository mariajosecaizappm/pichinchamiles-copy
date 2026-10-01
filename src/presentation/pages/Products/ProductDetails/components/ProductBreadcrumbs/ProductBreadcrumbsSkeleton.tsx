"use client"

import { Skeleton } from "@heroui/react";

const ProductBreadcrumbsSkeleton = () => {
    return (
        <div className="flex gap-4 text-grayscale-400 items-center">
            <div className="w-6 h-6 flex items-center justify-center">
                <Skeleton className="rounded-sm w-3 h-3"/>
            </div>
            <div className="flex gap-4 flex-1 h-6 items-center w-full lg:max-w-2/6">
                <div className="flex gap-4 w-3/4 lg:w-1/2">
                    <Skeleton className="rounded-sm w-full h-3"/>
                    <Skeleton className="rounded-sm w-full h-3"/>
                </div>
                <div className="gap-4 hidden lg:flex lg:w-1/2">
                    <Skeleton className="rounded-sm w-full h-3"/>
                    <Skeleton className="rounded-sm w-full h-3"/>
                </div>
            </div>
        </div>
    );
};

export default ProductBreadcrumbsSkeleton;