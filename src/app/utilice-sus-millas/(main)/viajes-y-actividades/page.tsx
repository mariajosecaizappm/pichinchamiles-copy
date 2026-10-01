// @/src/app/utilice-sus-millas/(main)/viajes-y-actividades/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import links from "@/presentation/config/links"
import UltraViajesSkeleton from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/UltraViajesPage/UltraViajesSkeleton"

const TravelAndActivitiesPage = () => {
    const router = useRouter()

    useEffect(() => {
        router.replace(links.flights)
    }, [router])

    return <UltraViajesSkeleton />
}

export default TravelAndActivitiesPage