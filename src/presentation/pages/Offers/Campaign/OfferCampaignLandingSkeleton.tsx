"use client"

import { Skeleton } from "@heroui/react"
import FeaturedItemCardSkeleton from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured/FeaturedItemCardSkeleton"

const OfferCampaignExperienceSkeleton = () => (
    <div className="flex min-h-[150px] w-full flex-row overflow-hidden rounded-lg border border-darkGrayishBlue-500 bg-white lg:hidden">
        <Skeleton className="h-[150px] w-[140px] shrink-0 rounded-none" />
        <div className="flex min-w-0 flex-1 flex-col gap-2 py-2 px-1">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
            <Skeleton className="mt-auto h-6 w-24 rounded" />
        </div>
    </div>
)

const OfferCampaignLandingSkeleton = () => {
    return (
        <div className="">
            <div className="body-container py-4 lg:py-6 flex flex-col gap-4">
                <Skeleton className="h-[160px] lg:h-[200px] w-full rounded-lg" />
                <Skeleton className="h-7 w-64 rounded-sm lg:mt-3" />
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-[12px] lg:gap-[52px] lg:px-[52px] lg:mt-3">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item}>
                            <OfferCampaignExperienceSkeleton />
                            <div className="hidden lg:block">
                                <FeaturedItemCardSkeleton />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default OfferCampaignLandingSkeleton
