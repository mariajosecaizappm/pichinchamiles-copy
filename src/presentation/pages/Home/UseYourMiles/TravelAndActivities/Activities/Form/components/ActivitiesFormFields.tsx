import FormContext from "@/presentation/components/Form/context/FormContext";
import { Button } from "@/presentation/components/Form/components/Button";
import FormAutocomplete from "@/presentation/components/Form/controls/FormAutocomplete/FormAutocompleteContainer";
import FormDatePicker from "@/presentation/components/Form/controls/FormDatePicker/FormDatePicker";
import FormInput from "@/presentation/components/Form/controls/FormInput/FormInputContainer";
import IconSearch from "@/presentation/components/icons/IconSearch";
import { useContext } from "react";
import { mapAutocompleteLocations, MIN_DAYS_AHEAD } from "../ActivitiesFormConfig";
import { getLocalTimeZone, today } from "@internationalized/date";
import IconPing from "@/presentation/components/icons/IconPing";
import clsx from "clsx";

const ActivitiesFormFields = () => {
    const { isSubmitting,  hasVisibleErrors } = useContext(FormContext);
    const minDate = today(getLocalTimeZone()).add({ days: MIN_DAYS_AHEAD });

    return (
        <div className={clsx("flex flex-col gap-2.5 xl:flex-row", hasVisibleErrors ? "items-center" : "items-end")}>
            <div className={clsx("w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5", hasVisibleErrors ? "items-start" : "items-end")}>
                <FormAutocomplete
                    name="destination"
                    label="Ciudad"
                    aria-label="Destino o lugar."
                    placeholder="Destino o lugar"
                    valueAsObject
                    onSearch={mapAutocompleteLocations}
                    startContent={
                        <IconPing className="text-grayscale-400" />
                    }
                />
                <FormDatePicker
                    aria-label="Escoge la fecha de la actividad."
                    label="Fecha de la actividad"
                    name="endDate"
                    minValue={minDate}
                />
                <FormInput
                    name="age"
                    label="Edad del participante"
                    aria-label="Ingresa la edad del participante"
                    placeholder="Ingresa tu edad"
                    type="number"
                    classNames={{
                        inputWrapper: "border-[1px] shadow-none"
                    }}
                />
            </div>
            <Button type="submit" color="primary" className="h-8 md:h-10 xl:w-12 xl:min-w-12 xl:h-12" aria-label="Buscar resultados según la información del formulario">
                <span className="xl:hidden text-xs" aria-hidden="true">Buscar</span>
                {
                    !isSubmitting && (
                        <span className="hidden xl:inline" aria-hidden="true">
                            <IconSearch/>
                        </span>
                    )
                }
            </Button>
        </div>
    );
};

export default ActivitiesFormFields;
