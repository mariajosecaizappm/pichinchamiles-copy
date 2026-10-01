"use client"
import { Skeleton } from "@heroui/react";

const ProductGallerySkeleton = () => {
    return (
        <div className="space-y-4 lg:space-y-0 lg:flex lg:flex-row-reverse lg:gap-4 lg:items-start">
            {/* <SideBySideMagnifier /> */}
            <div className="lg:flex-1 lg:flex lg:flex-col lg:gap-3">
                <div className="aspect-243/179 lg:relative lg:rounded-lg h-full">

                    <Skeleton className="w-full h-full rounded-lg " />
                </div>

                <div className="h-6 flex items-center">
                    <Skeleton className="hidden lg:block lg:w-2/4 h-3  mx-auto" />
                </div>
            </div>
            {/* <ProductThumbnails /> */}

            <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-2 shrink-0">
                <div className="w-4 h-4 flex items-center justify-center">
                    <Skeleton className="w-2 h-2 rounded-xs " />
                </div>
                <ol className="flex flex-col gap-3">
                    {Array.from({ length: 3 }).map((_, idx) => {
                        const index = idx;
                        return (
                            <li key={index}>
                                <Skeleton className="w-16 h-16  rounded-2xl" />
                            </li>
                        );
                    })}
                </ol>
                <div className="w-4 h-4 flex items-center justify-center">
                    <Skeleton className="w-2 h-2 rounded-xs " />
                </div>
            </div>

            {/* <CarouselDots /> */}
            <ol className="flex items-center justify-center gap-2 lg:hidden">
                {
                    Array.from({ length: 3 }).map((_, idx) => {
                        const index = idx;
                        return (
                            <Skeleton key={index} className="w-2 h-2 rounded-full " />
                        );
                    })
                }
            </ol>
        </div>
    );
};

export default ProductGallerySkeleton;