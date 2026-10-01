import { cn, Skeleton } from "@heroui/react"

type Props = {
    className?: string
    itemClassName?: string
}

const TabItemSkeleton = () => {
    return (
        <Skeleton className="w-3/4 h-4 rounded-sm" />
    )
}

const TabLinksSkeleton = ({ className, itemClassName }: Props) => {
    return (
        <div className={cn("flex border-b border-darkGrayishBlue-200", className)}
        >
            <div className={cn("border-b-2 border-darkGrayishBlue-200 w-34 h-12 flex items-center justify-center relative px-4", itemClassName)}>
                <TabItemSkeleton />
            </div>
            {["skeleton-1", "skeleton-2", "skeleton-3"].map((k) => (
                <div key={k} className={cn("w-34 h-12 flex items-center justify-center relative px-4", itemClassName)}>
                    <TabItemSkeleton />
                </div>
            ))}
        </div>
    )
}

export default TabLinksSkeleton