"use client"

import { Skeleton } from "@heroui/react"
import FeaturedItemCardSkeleton from "../../TravelAndActivities/Flights/Featured/FeaturedItemCardSkeleton"
import OffersTabsWrapperSkeleton from "./OffersTabsWrapperSkeleton"

type Props = {
    showBannerSkeleton?: boolean;
}

const OffersShowcaseSkeleton = ({showBannerSkeleton}: Props) => {
    return (
        <OffersTabsWrapperSkeleton>
            <div className="flex flex-col md:flex-row gap-3">
                {
                    showBannerSkeleton && (
                        <div className="w-full md:w-103 md:shrink-0 flex flex-col min-h-40 sm:min-h-56">
                            <Skeleton className="flex-1 rounded-lg" />
                        </div>
                    )
                }   
                <div className="flex justify-start gap-3">
                    {["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4", "skeleton-5", "skeleton-6"].map((index) => (
                        <FeaturedItemCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        </OffersTabsWrapperSkeleton>
    )
}

export default OffersShowcaseSkeleton