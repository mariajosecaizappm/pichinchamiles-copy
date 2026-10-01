"use client"

import { Skeleton } from "@heroui/react"

const BodyBannersSkeleton = () => {
    return (
        <div className="p-6 w-full max-w-330 mx-auto">
            <div className="grid grid-cols-2 gap-2.5">
                <div className="col-span-2 h-[400px] relative">
                    <Skeleton className="w-full h-full rounded-lg"/>
                </div>
                <div className="col-span-1 h-[235px] relative">
                    <Skeleton className="w-full h-full rounded-lg"/>
                </div>
                <div className="col-span-1 h-[235px] relative">
                    <Skeleton className="w-full h-full rounded-lg"/>
                </div>
            </div>
        </div>
    )
}

export default BodyBannersSkeleton