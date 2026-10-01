"use client"

import { cn, Skeleton } from "@heroui/react"

const PaymentOptionsSkeleton = () => {
    return (
        <div className="space-y-5">
            <div className="space-y-2 w-full">
                <div className="h-6 flex items-center">
                    <Skeleton className="h-4 w-64 rounded" />
                </div>
                <div className="flex flex-col gap-0 w-full">
                    {Array.from({ length: 2 }).map((_, idx) => {
                        const key = `payment-option-${idx}`
                        return (
                            <div key={key} className={cn("w-full h-12 flex items-center gap-[18px] px-3", idx === 0 && "bg-darkGrayishBlue-50")}>
                                <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                                <Skeleton className="h-4 w-48 rounded" />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default PaymentOptionsSkeleton