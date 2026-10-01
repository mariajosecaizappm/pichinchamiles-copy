"use client"
import { Skeleton } from "@heroui/react";

const ProductCategoriesSkeleton = () => {
    return ( 
        <div className="flex self-stretch items-center justify-between w-full h-full">
            <Skeleton className="w-10 h-10 hidden rounded-md lg:block" />
            <div className="flex-1 flex gap-3 items-stretch overflow-hidden">
                {Array.from({ length: 12 }).map((_, i) => {
                    const key = `skeleton-${i}`;
                    return (
                        <div key={key} className="min-w-[88px] h-24 shrink-0 flex flex-col items-center justify-center gap-3" >
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="h-5 w-full flex items-center justify-center">
                                <Skeleton className="w-14 h-3 rounded" />
                            </div>
                        </div>
                    );
                })}
            </div>
            <Skeleton className="w-10 h-10 hidden rounded-md lg:block" />
        </div>
    );
};

export default ProductCategoriesSkeleton;
