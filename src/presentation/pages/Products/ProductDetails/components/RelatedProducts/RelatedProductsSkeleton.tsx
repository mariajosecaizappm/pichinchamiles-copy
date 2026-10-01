"use client"

import FeaturedItemCardSkeleton from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Featured/FeaturedItemCardSkeleton";
import { Skeleton } from "@heroui/react";

const RelatedProductsSkeleton = () => {
    return (
        <div className="p-6 w-full max-w-330 mx-auto overflow-x-hidden">
            <div className="flex flex-col gap-6">
                <Skeleton className="h-7 w-2/3 max-w-78" />
                <div className="flex justify-start gap-6 xl:gap-13">
                    {["skeleton-a", "skeleton-b", "skeleton-c", "skeleton-d", "skeleton-e", "skeleton-f"].map((id) => (
                        <FeaturedItemCardSkeleton key={id} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RelatedProductsSkeleton;