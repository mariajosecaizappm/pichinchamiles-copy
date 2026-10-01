"use client"

import useSession from "@/presentation/hooks/useSession"
import MemberInformation from "./MemberInformation"

const MemberInformationContainer = () => {
    const { member } = useSession()

    if (!member) {
        return null
    }

    return (
        <MemberInformation member={member} />
    )
}

export default MemberInformationContainer