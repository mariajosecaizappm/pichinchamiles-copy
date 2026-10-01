import TravelAndActivities from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/TravelAndActivities"
import { ActivityKey } from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/TravelAndActivitiesConfig"

type Props = {
    params: Promise<{
        activity: ActivityKey
    }>
}

const TravelAndActivitiesPage = async ({ params }: Props) => {
    const { activity } = await params
    return <TravelAndActivities activity={activity}/>
}

export default TravelAndActivitiesPage