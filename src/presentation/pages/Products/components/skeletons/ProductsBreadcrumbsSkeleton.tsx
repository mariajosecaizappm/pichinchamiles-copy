"use client"

import { Skeleton } from "@heroui/react";

const ProductBreadcrumbsSkeleton = () => {
    return (
        <div className="flex gap-4 items-center">
            <div className="flex gap-4 flex-1 h-6 items-center w-full">
                <div className="flex gap-4 w-full max-w-96">
                    <Skeleton className="rounded-sm w-full h-3"/>
                    <Skeleton className="rounded-sm w-full h-3"/>
                    <Skeleton className="rounded-sm w-full h-3"/>
                </div>
            </div>
        </div>
    );
};

export default ProductBreadcrumbsSkeleton;