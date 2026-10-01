import { Skeleton } from "@heroui/react"

const HomeFeaturedRewardCardSkeleton = () => {
    return (
        <div
            className="shrink-0 w-[calc(100vw-5rem)] max-w-[300px] rounded overflow-hidden border border-grayscale-100"
        >
            <Skeleton className="w-full h-[155px]" />
            <div className="py-4 px-5 grid gap-1.5">
                <Skeleton className="h-6 rounded w-48" />

                <div className="grid gap-1">
                    <Skeleton className="h-3 rounded w-12" />
                    <Skeleton className="h-5 rounded w-32" />
                </div>
                <Skeleton className="h-2 rounded w-11/12" />

            </div>
        </div>
    )
}



export default HomeFeaturedRewardCardSkeleton