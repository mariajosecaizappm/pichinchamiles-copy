"use client"

import { Skeleton } from "@heroui/react"
import FeaturedItemCardSkeleton from "./FeaturedItemCardSkeleton"

const FeaturedItemsSkeleton = () => {
    return (
        <div className="p-6 w-full max-w-330 mx-auto overflow-x-hidden">
            <div className="flex flex-col gap-6">
                <Skeleton className="h-7 w-2/3 max-w-78" />
                <div className="flex justify-start xl:justify-center gap-6 xl:gap-13">
                    {["skeleton-a", "skeleton-b", "skeleton-c", "skeleton-d"].map((id) => (
                        <FeaturedItemCardSkeleton key={id} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FeaturedItemsSkeleton