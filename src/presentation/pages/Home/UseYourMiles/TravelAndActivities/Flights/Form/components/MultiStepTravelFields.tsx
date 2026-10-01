import FormAutocomplete from "@/presentation/components/Form/controls/FormAutocomplete"
import FormDatePicker from "@/presentation/components/Form/controls/FormDatePicker/FormDatePicker"
import { getLocalTimeZone, today } from "@internationalized/date"
import { mapAutocompleteLocations, MIN_DAYS_AHEAD } from "../FlightsFormConfig"
import IconPlane from "@/presentation/components/icons/IconPlane"

type MultiStepTravelFieldsProps = {
    index: number,
}

const MultiStepTravelFields = ({ index }: MultiStepTravelFieldsProps) => {
    const minDate = today(getLocalTimeZone()).add({ days: MIN_DAYS_AHEAD });
    return (
        <>
            <FormAutocomplete
                name={`multidestinationTrips[${index}].origin`}
                valueAsObject
                label="Origen"
                aria-label="Origen del viaje"
                testId="origin"
                placeholder="Origen"
                startContent={
                    <IconPlane className="" />
                }
                onSearch={mapAutocompleteLocations}

            />
            <FormAutocomplete
                name={`multidestinationTrips[${index}].destination`}
                valueAsObject
                label="Destino"
                aria-label="Destino del viaje"
                testId="destination"
                placeholder="Destino"
                startContent={
                    <IconPlane />
                }
                onSearch={mapAutocompleteLocations}
            />

            <FormDatePicker
                aria-label="Escoge las fechas de vuelo"
                label="Fecha de salida"
                name={`multidestinationTrips[${index}].startDate`}
                minValue={minDate}
            />

            
        </>
    )
}

export default MultiStepTravelFields