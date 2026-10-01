import { Skeleton } from "@heroui/react"

const PromotionCardItemSkeleton = () => {
    return (
        <div className="min-w-62.5 lg:w-[295px] rounded-lg overflow-hidden border border-darkGrayishBlue-500" >
            <Skeleton className="w-full h-38.75" />
            <div className="py-4 px-5 flex flex-col gap-1">
                <div className="h-16">
                    <div className="h-8 flex items-center">
                        <Skeleton className="h-6 w-full rounded"/>
                    </div>
                    <div className="h-8 flex items-center">
                        <Skeleton className="h-6 w-3/4 rounded"/>
                    </div>
                </div>
                <div className="h-10">
                    <div className="h-5 flex items-center">
                        <Skeleton className="h-3 w-11/12 rounded"/>
                    </div>
                    <div className="h-5 flex items-center">
                        <Skeleton className="h-3 w-7/12 rounded"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PromotionCardItemSkeleton