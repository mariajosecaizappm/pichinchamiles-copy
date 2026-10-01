import FormContext from "@/presentation/components/Form/context/FormContext";
import FormAutocomplete from "@/presentation/components/Form/controls/FormAutocomplete";
import { FormCheckbox } from "@/presentation/components/Form/controls/FormCheckbox";
import { FormDatePicker } from "@/presentation/components/Form/controls/FormDatePicker";
import IconCar from "@/presentation/components/icons/IconCar";
import IconSearch from "@/presentation/components/icons/IconSearch";
import Button from "@/presentation/pages/Home/components/Button";
import { cn } from "@heroui/react";
import { getLocalTimeZone, now, today } from "@internationalized/date";
import { useContext } from "react";
import { mapAutocompleteLocations, MIN_DAYS_AHEAD } from "../CarsFormConfig";

const CarsFormFields = () => {
    const { values, isSubmitting, hasVisibleErrors } = useContext(FormContext)


    const minPickUpDateValue = today(getLocalTimeZone()).add({ days: MIN_DAYS_AHEAD })
    const pickUp = values.pickUpDateTime instanceof Date ? values.pickUpDateTime : null
    const minReturnDateValue = pickUp
        ? now(getLocalTimeZone()).set({
            year: pickUp.getFullYear(),
            month: pickUp.getMonth() + 1,
            day: pickUp.getDate(),
            hour: pickUp.getHours(),
            minute: pickUp.getMinutes(),
        })
        : minPickUpDateValue

    return (
        <div className={
            cn(
                "grid grid-cols-1 gap-2.5",
                hasVisibleErrors ? "items-start" : "items-end",
                values.showDifferentDestination ? "lg:grid-cols-4" : "lg:grid-cols-3"
            )
        }>
            <FormAutocomplete
                name="pickUpLocation"
                label="Lugar de recogida"
                testId="pickUpLocation"
                aria-label="Ciudad o lugar de recogida."
                valueAsObject
                startContent={<IconCar />}
                placeholder="Ciudad o lugar de recogida"
                onSearch={mapAutocompleteLocations}
            />
            <FormDatePicker
                aria-label="Escoge la fecha y hora de recogida."
                label="Fecha y hora de recogida"
                name="pickUpDateTime"
                granularity="minute"
                hourCycle={24}
                hideTimeZone
                showMonthAndYearPickers
                minValue={minPickUpDateValue}
                defaultValue={now(getLocalTimeZone())}
            />
            <FormDatePicker
                aria-label="Escoge la fecha y hora de devolución."
                label="Fecha y hora de devolución"
                name="returnDateTime"
                granularity="minute"
                hourCycle={24}
                hideTimeZone
                showMonthAndYearPickers
                minValue={minReturnDateValue}
                defaultValue={now(getLocalTimeZone())}
            />

            <div className="py-2 col-span-full lg:row-start-2 lg:col-start-1">
                <FormCheckbox
                    name="showDifferentDestination"
                    testId="showDifferentDestination"
                    label="Devolver en otro lugar"
                    aria-label="Devolver en otro lugar despliega otra opción para definir el lugar de devolución."

                />
            </div>
            {
                values.showDifferentDestination && (

                    <div className="lg:col-start-3 lg:row-start-1">
                        <FormAutocomplete
                            name="dropOffLocation"
                            label="Lugar de devolución"
                            testId="dropOffLocation"
                            aria-label="Lugar de devolución"
                            valueAsObject
                            startContent={<IconCar />}
                            placeholder="Ciudad o lugar de devolución"
                            onSearch={mapAutocompleteLocations}
                        />
                    </div>

                )
            }
            <div className={
                cn(
                    "col-span-full lg:col-start-5 lg:col-span-1 w-full",
                    !values.showDifferentDestination && "lg:col-start-4",
                    hasVisibleErrors && "lg:self-center"
                )
            }>
                <Button type="submit" color="primary" className="lg:w-12 lg:min-w-12 h-10 lg:h-12 w-full" aria-label="Buscar resultados según la información del formulario">
                    <span className="lg:hidden" aria-hidden="true">Buscar</span>
                    {
                        !isSubmitting && (
                            <span className="hidden lg:inline" aria-hidden="true">
                                <IconSearch />
                            </span>
                        )
                    }
                </Button>
            </div>
        </div>
    );
}

export default CarsFormFields;
