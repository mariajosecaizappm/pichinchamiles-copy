"use client"

import links from "@/presentation/config/links"
import useSession from "@/presentation/hooks/useSession"
import MemberInformationSkeleton from "@/presentation/pages/Profile/components/MemberInformation/MemberInformationSkeleton"
import ProfileTabs from "@/presentation/pages/Profile/components/ProfileTabs/ProfileTabs"
import { useRouter } from "next/navigation"

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { member, isValidatingSession } = useSession()
    const router = useRouter()
    if (isValidatingSession) {
        return   (
            <MemberInformationSkeleton />
        )
    }

    if (!member) {
        router.push(links.home)
        return null
    }
    return (
        <div className="flex flex-col">
            <ProfileTabs />
            {children}
        </div>
    )
}

export default Layout