import TabLinksSkeleton from "@/presentation/pages/Home/UseYourMiles/Layout/Tabs/components/TabLinksSkeleton"
import { Skeleton } from "@heroui/react"

const MemberInformationSkeleton = () => {
    return (
        <div className="overflow-hidden">
            <div className="w-full pt-3 md:mb-4">
                <TabLinksSkeleton className="justify-between body-container" itemClassName="min-w-60"/>
            </div>
            <div className="h-100 body-container pt-3 pb-6 space-y-3 md:max-w-[676px]">
                <Skeleton className="w-full h-full border border-darkGrayishBlue-300 rounded-lg"/>
            </div>
        </div>
    )
}

export default MemberInformationSkeleton