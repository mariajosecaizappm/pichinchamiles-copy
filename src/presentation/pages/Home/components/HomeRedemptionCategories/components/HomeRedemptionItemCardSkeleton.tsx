import { Skeleton } from "@heroui/react"

const HomeRedemptionCardSkeleton = () => {
    return (
        <div
            className="shrink-0 w-[calc(100vw-5rem)] max-w-[300px] rounded overflow-hidden border border-grayscale-100"
        >
            <Skeleton className="w-full h-[155px]" />
            <div className="p-5 flex flex-col gap-2">
                <Skeleton className="h-4 rounded w-32" />
                <div className="space-y-1.5">
                    <Skeleton className="h-2 rounded w-full" />
                    <Skeleton className="h-2 rounded w-2/3" />
                </div>
                <Skeleton className="h-3 rounded w-1/3" />
            </div>
        </div>
    )
}


export default HomeRedemptionCardSkeleton