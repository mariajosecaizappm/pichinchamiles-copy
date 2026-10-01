"use client"

import { cn, Skeleton } from "@heroui/react"
import OrderListSkeleton from "./OrderListSkeleton"
import OrderInfoSkeleton from "./OrderInfoSkeleton"

type Props = {
    className?: string
}

const OrdersSkeleton = ({ className }: Props) => {
    return (
        <div className={cn("body-container py-4", className)}>
            <div className="py-4 space-y-4">
                <div className="flex flex-col gap-1">
                    <div className="h-7 w-full flex items-center">
                        <Skeleton className="h-5 w-36 rounded-md" />
                    </div>
                    <div>
                        <div className="h-5 flex items-center">
                            <Skeleton className="h-3 w-full max-w-125 rounded-sm" />
                        </div>
                        <div className="flex items-center h-5 sm:hidden">
                            <Skeleton className="h-3 w-24 rounded-sm" />
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex gap-2.5">
                <div className="flex-1">
                    <OrderListSkeleton />
                </div>
                <div className="hidden md:flex w-100">
                    <OrderInfoSkeleton/>
                </div>
            </div>
        </div>
    )
}

export default OrdersSkeleton