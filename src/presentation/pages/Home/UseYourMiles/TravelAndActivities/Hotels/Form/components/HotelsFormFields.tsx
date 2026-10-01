import FormContext from "@/presentation/components/Form/context/FormContext";
import { Button } from "@/presentation/components/Form/components/Button";
import FormAutocomplete from "@/presentation/components/Form/controls/FormAutocomplete/FormAutocompleteContainer";
import FormDateRangePicker from "@/presentation/components/Form/controls/FormDateRangePicker/FormDateRangePicker";
import IconSearch from "@/presentation/components/icons/IconSearch";
import { PassengersSelect } from "../../../Form/components/PassengerSelect";
import { buildPassengerCategories } from "../data";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useContext } from "react";
import clsx from "clsx";
import { mapAutocompleteLocations, MIN_DAYS_AHEAD } from "../HotelsFormConfig";
import IconBed from "@/presentation/components/icons/IconBed";

const HotelsFormFields = () => {
    const { isSubmitting, values, hasVisibleErrors } = useContext(FormContext);
    const minDate = today(getLocalTimeZone()).add({ days: MIN_DAYS_AHEAD });
    
    const adults: number = values.adults ?? 2;
    const childrens: number = values.childrens ?? 0;
    const infants: number = 0;
    const categories = buildPassengerCategories(adults, childrens, infants)

    

    return (
        <div className={clsx("flex flex-col gap-2.5 xl:flex-row", hasVisibleErrors ? "items-center" : "items-end")}>
            <div className={clsx("w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5", hasVisibleErrors ? "items-start" : "items-end")}>
                <FormAutocomplete
                    name="destination"
                    label="Ciudad o destino"
                    aria-label="Ciudad o destino"
                    placeholder="Destino"
                    valueAsObject
                    onSearch={mapAutocompleteLocations}
                    startContent={
                        <IconBed className="text-grayscale-400" />
                    }
                />
                <FormDateRangePicker
                    aria-label="Escoge tus fechas de estadía"
                    label="Fechas de estadía"
                    startName="startDate"
                    endName="endDate"
                    minValue={minDate}
                />
                <PassengersSelect
                    label="Habitación y huéspedes"
                    testId="hotels-passengers-select"
                    categories={categories}
                    showRoom={true}
                    roomLabel="Habitación"
                    guestLabel="Huéspede"
                    showAgeSelect
                    triggerAriaLabel="Escoge el número de huéspedes para una habitación"
                />
            </div>
            <Button type="submit" color="primary" className="xl:w-12 xl:min-w-12 xl:h-12" aria-label="Buscar resultados según la información del formulario">
                <span className="xl:hidden" aria-hidden="true">Buscar</span>
                {
                    !isSubmitting && (
                        <span className="hidden xl:inline" aria-hidden="true">
                            <IconSearch />
                        </span>
                    )
                }
            </Button>
        </div>
    );
};

export default HotelsFormFields;
