"use client"

import { Skeleton } from "@heroui/react"
import FeaturedItemCardSkeleton from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured/FeaturedItemCardSkeleton"

const ActivityOffersCampaignsSkeleton = () => {
    return (
        <div className="body-container py-6 flex flex-col gap-8">
            {[1, 2].map((index) => (
                <div key={index} className="flex flex-col gap-3">
                    <div className="flex flex-col lg:flex-row gap-3">
                        <Skeleton className="lg:max-w-[412px] w-full h-40 lg:min-h-[311px] rounded-lg" />
                        <div className="flex gap-3 overflow-hidden">
                            {[1, 2, 3].map((cardIndex) => (
                                <FeaturedItemCardSkeleton key={cardIndex} />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ActivityOffersCampaignsSkeleton
