"use client"

import PromotionCardItemSkeleton from "./PromotionCardItemSkeleton"

const PromotionCardsSkeleton = () => {
    return (
        <div className="flex gap-4 lg:body-container py-3 pl-6 overflow-x-hidden justify-between">
            {["skeleton-a", "skeleton-b", "skeleton-c", "skeleton-d"].map((id) => (
                <PromotionCardItemSkeleton key={id} />
            ))}
        </div>
    )
}

export default PromotionCardsSkeleton