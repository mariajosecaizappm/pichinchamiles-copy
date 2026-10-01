"use client"

import { Skeleton } from "@heroui/react"

const OffersNavbarSkeleton = () => {
    return (
        <div className="body-container pt-4 lg:p-4">
            <div className="flex flex-col items-center lg:flex-row lg:justify-between lg:gap-6">
                <div className="flex-1">
                    <div className="w-full h-9 flex items-center">
                        <Skeleton className="w-28 h-6 rounded" />
                    </div>
                </div>
                <div className="w-full flex-1 flex justify-center p-4 lg:p-0 lg:max-w-[288px]">
                    <div className="flex border-b border-grayscale-200 w-full"
                    >
                        <div className="border-b-2 border-grayscale-200 w-full h-12 flex items-center justify-center relative">
                            <Skeleton className="absolute w-20 h-4 rounded" />
                        </div>
                        <div className="w-full h-12 flex items-center justify-center relative">
                            <Skeleton className="absolute w-20 h-4 rounded" />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default OffersNavbarSkeleton