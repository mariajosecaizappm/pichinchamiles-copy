import { Skeleton } from "@heroui/react"

const OrderInfoSkeleton = () => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="h-8 flex items-center">
                <Skeleton className="h-6 w-full max-w-80 rounded-md" />
            </div>
            <div className="space-y-3">
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
            </div>
        </div>
    )
}

export default OrderInfoSkeleton