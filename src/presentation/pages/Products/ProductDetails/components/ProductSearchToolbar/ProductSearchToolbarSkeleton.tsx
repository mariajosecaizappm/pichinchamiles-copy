"use client"
import { Skeleton } from "@heroui/react";

const ProductSearchToolbarSkeleton = () => {
    return (
        <div className="flex gap-2">
            <div className="flex-1 z-0">
                <Skeleton className="w-full h-12 rounded-lg " />
            </div>
            <Skeleton className="w-10 h-12 rounded-lg lg:hidden" />
        </div>
    );
};

export default ProductSearchToolbarSkeleton;