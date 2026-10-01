import FormContext from "@/presentation/components/Form/context/FormContext";
import { Button } from "@/presentation/components/Form/components/Button";
import FormDatePicker from "@/presentation/components/Form/controls/FormDatePicker/FormDatePicker";
import IconSearch from "@/presentation/components/icons/IconSearch";
import { PassengersSelect } from "../../../Form/components/PassengerSelect";
import { buildPassengerCategories } from "../data";
import { MIN_DAYS_AHEAD } from "../DisneyFormConfig";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useContext } from "react";
import clsx from "clsx";

const DisneyFormFields = () => {
    const { isSubmitting, values, hasVisibleErrors } = useContext(FormContext);
    const minDate = today(getLocalTimeZone()).add({ days: MIN_DAYS_AHEAD });
    
    const adults: number = values.adults ?? 1;
    const childrens: number = values.childrens ?? 0;
    const infants: number = values.infants ?? 0;
    const categories = buildPassengerCategories(adults, childrens, infants)
        .filter(category => category.key !== "infants");

    return (
        <div className={clsx("flex flex-col gap-2.5 xl:flex-row", hasVisibleErrors ? "items-center" : "items-end")}>
            <div className={clsx("w-full grid grid-cols-1 md:grid-cols-2 gap-2.5", hasVisibleErrors ? "items-start" : "items-end")}>
                <FormDatePicker
                    name="date"
                    label="Fecha de visita"
                    aria-label="Escoge la fecha de visita"
                    minValue={minDate}
                />
                <PassengersSelect
                    label="Número de visitantes"
                    testId="disney-passengers-select"
                    categories={categories}
                    triggerAriaLabel="Escoge el número de visitantes"
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

export default DisneyFormFields;
