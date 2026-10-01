"use client"

import { Skeleton } from "@heroui/react"
import HomeFeaturedRewardCardSkeleton from "./HomeFeaturedRewardCardSkeleton"

const HomeFeaturedRewardsSkeleton = () => {
    return (
        <div className="py-6 md:py-10 flex flex-col gap-10 items-center overflow-hidden">
            <div className="space-y-4 flex flex-col items-center justify-center base-container">
                <Skeleton className="h-9 w-56 rounded" />
                <Skeleton className="h-4 w-72 rounded " />
                <div className="w-full md:hidden overflow-x-auto">
                    <div className="flex gap-4 px-6">
                        {[1, 2, 3].map((index) => (
                            <HomeFeaturedRewardCardSkeleton key={index}/>
                        ))}
                    </div>
                </div>
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 px-3 place-items-center xl:px-0 w-full max-w-[1182px] mx-auto">
                    {[1, 2, 3,4,5,6].map((index) => (
                        <HomeFeaturedRewardCardSkeleton key={index}/>
                    ))}  
                </div>
            </div>

        </div>
    )
}

export default HomeFeaturedRewardsSkeleton