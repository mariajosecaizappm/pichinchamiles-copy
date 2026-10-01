"use client"

import FeaturedItemCardSkeleton from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured/FeaturedItemCardSkeleton"
import { Skeleton } from "@heroui/react"

const OfferCampaignSkeleton = () => {
    return (
        <div className="flex flex-col md:flex-row gap-3">
            <div className="w-full md:w-103 md:shrink-0 flex flex-col min-h-40 sm:min-h-56">
                <Skeleton className="flex-1 rounded-lg" />
            </div>
            <div className="flex justify-start gap-3">
                {["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4", "skeleton-5", "skeleton-6"].map((index) => (
                    <FeaturedItemCardSkeleton key={index} />
                ))}
            </div>
        </div>
    )
}

export default OfferCampaignSkeleton