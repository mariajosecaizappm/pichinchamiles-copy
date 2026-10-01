"use client"

import { Skeleton } from "@heroui/react"
import TabLinksSkeleton from "../../Layout/Tabs/components/TabLinksSkeleton"

type Props = {
    children: React.ReactNode
}

const OffersTabsWrapperSkeleton = ({children}: Props) => {
    return (
        <div className="p-6 w-full body-container overflow-x-hidden">
            <div className="flex flex-col gap-6 rounded">
                <Skeleton className="h-7 w-2/3 max-w-42" />
                <div className="w-min">
                    <TabLinksSkeleton/>
                </div>
                {children}
            </div>
        </div>
    )
}

export default OffersTabsWrapperSkeleton