"use client"

import { Skeleton } from "@heroui/react"

const HomeFaqsSkeleton = () => {
    return (
        <div className="p-6 grid gap-6">
            <div className="flex justify-center items-center flex-col space-y-4">

                <Skeleton className="w-full h-8 bg-grayscale-50 rounded max-w-lg" />
                <Skeleton className="w-full h-3 bg-grayscale-50 rounded max-w-md" />

            </div>
            <div className="flex justify-center items-center flex-col space-y-4 base-container w-full">

                <Skeleton className="w-full h-8 bg-grayscale-50 rounded" />

                <Skeleton className="w-full h-8 bg-grayscale-50 rounded" />

                <Skeleton className="w-full h-8 bg-grayscale-50 rounded" />

            </div>
            <div className="flex justify-center items-center">
                <Skeleton className="w-64 h-8 bg-grayscale-50 rounded" />
            </div>
        </div>
    )
}

export default HomeFaqsSkeleton