import { notFound } from "next/navigation"
import ActivitiesForm from "./Activities"
import CarsForm from "./Cars"
import DisneyForm from "./Disney"
import { FlightsForm } from "./Flights"
import HotelsForm from "./Hotels"
import { ActivityKey } from "./TravelAndActivitiesConfig"

type Props = {
    activity: ActivityKey
}

const TravelAndActivities = async ({ activity }: Props) => {

    const ACTIVITY_FORM: Record<ActivityKey, React.ComponentType> = {
        "vuelos": FlightsForm,
        "hoteles": HotelsForm,
        "autos": CarsForm,
        "actividades": ActivitiesForm,
        "disney": DisneyForm
    }

    if (!ACTIVITY_FORM[activity]) {
        notFound()
    }

    const ActivityForm = ACTIVITY_FORM[activity]

    return <ActivityForm />
}

export default TravelAndActivities