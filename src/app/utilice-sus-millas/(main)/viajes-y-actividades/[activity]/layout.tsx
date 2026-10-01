import { BannerCategory } from "@/domain/entity/Banner/banner"
import { ActivityKey } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/TravelAndActivitiesConfig"
import UltraViajesPage from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/UltraViajesPage"
import UltraViajesSkeleton from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/UltraViajesPage/UltraViajesSkeleton"
import { notFound } from "next/navigation"
import { Suspense } from "react"

type Props = {
    children: React.ReactNode
    params: Promise<{
        activity: ActivityKey
    }>
}

const ACTIVITIES: Record<ActivityKey, { title: string, category: BannerCategory }> = {
    "vuelos": {
        title: "Nuestros vuelos recomendados",
        category: BannerCategory.UV_FLIGHTS
    },
    "hoteles": {
        title: "Nuestros hoteles recomendados",
        category: BannerCategory.UV_HOTELS
    },
    "autos": {
        title: "Nuestros autos recomendados",
        category: BannerCategory.UV_CARS
    },
    "actividades": {
        title: "Nuestras actividades recomendadas",
        category: BannerCategory.UV_ACTIVITIES
    },
    "disney": {
        title: "Nuestros actividades Disney recomendadas",
        category: BannerCategory.UV_DISNEY
    }
}

const TravelAndActivitiesLayout = async ({ children, params }: Props) => {
    const { activity } = await params

    const activityData = ACTIVITIES[activity]

    if (!activityData) {
        notFound()
    }

    return (
        <>
            {children}
            <Suspense fallback={<UltraViajesSkeleton />}>
                <UltraViajesPage title={activityData.title} category={activityData.category} />
            </Suspense>
        </>
    )
}

export default TravelAndActivitiesLayout