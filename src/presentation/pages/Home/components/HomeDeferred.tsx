"use client"

import { EventName } from "@/presentation/analytics/types"
import HomeRedirect from "@/presentation/pages/Home/components/HomeRedirect"
import { MountTracker } from "@/presentation/analytics/MountTracker"

const HomeDeferred = () => (
    <>
        <HomeRedirect />
        <MountTracker name={EventName.VIEWED_HOME} />
    </>
)

export default HomeDeferred
