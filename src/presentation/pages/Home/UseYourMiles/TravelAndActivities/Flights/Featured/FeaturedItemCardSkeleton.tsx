import { Skeleton } from "@heroui/react"

const FeaturedItemCardSkeleton = () => {
    return (
        <div className="h-77.5 min-w-62.5  rounded-lg overflow-hidden border border-darkGrayishBlue-500" >
            <Skeleton className="w-full h-38.75" />
            <div className="py-4 px-5 grid gap-1">
                <div className="grid gap-1">
                    <Skeleton className="w-11/12 h-7" />
                    <Skeleton className="w-2/4 h-6" />
                </div>
                <div className="grid gap-3">
                    <Skeleton className="w-9/12 h-7" />
                    <Skeleton className="w-full h-3" />
                </div>
            </div>
        </div>
    )
}

export default FeaturedItemCardSkeleton