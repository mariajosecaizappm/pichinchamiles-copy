import { TripType } from "@/domain/entity/Travel/structure/flight";
import { Button } from "@/presentation/components/Form/components/Button";
import FormContext from "@/presentation/components/Form/context/FormContext";
import { useContext } from "react";
import { Trip, createDefaultTrip } from "../FlightsFormConfig";
import AdvancedOptionsTrigger from "./AdvancedOptionsFormFieldsTrigger";
import AdvancedOptionsFields from "./AdvanceOptionsFormFields";
import FlightsFormBaseFields from "./FlightsFormBaseFields";
import MultiStepTravelFields from "./MultiStepTravelFields";
import { cn } from "@heroui/react";
import IconSearch from "@/presentation/components/icons/IconSearch";

const FlightsFormFields = () => {
    const { values, setFieldValue, isSubmitting, hasVisibleErrors } = useContext(FormContext);

    return (
        <div className="flex flex-col gap-2.5">

            <div className={cn("flex flex-col gap-2.5 xl:flex-row", hasVisibleErrors ? "items-center" : "items-end")}>
                <div className="w-full">
                    <div className={cn(
                        "w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5",
                        hasVisibleErrors ? "items-start" : "items-end",
                        values.flightTravelType === TripType.ROUND
                            ? "xl:grid-cols-[1fr_1fr_1fr_1.2fr_1fr]"
                            : "xl:grid-cols-[1fr_1fr_1fr_1fr_1fr]"
                    )}>
                        <FlightsFormBaseFields />
                    </div>
                </div>

                <div className="max-xl:w-full">
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

            </div>
            {
                values.flightTravelType === TripType.MULTIPLE && (
                    <div className="hidden md:flex flex-col gap-2.5">
                        {
                            values.multidestinationTrips?.map((trip: Trip, index: number) => (
                                <div className={cn("flex gap-2.5", hasVisibleErrors ? "items-start" : "items-end")} key={trip.id}>
                                    <MultiStepTravelFields index={index} />
                                    <div className={cn(
                                        "self-stretch flex",
                                        hasVisibleErrors ? "items-center" : "items-end",
                                    )}>
                                        {index > 0 ? (
                                            <div className="min-w-37">
                                                <Button
                                                    type="button"
                                                    variant="bordered" className="border-blue-500 text-blue-500" onPress={() => {
                                                        const newTrips = values.multidestinationTrips?.filter((_: Trip, i: number) => i !== index)
                                                        setFieldValue('multidestinationTrips', newTrips)
                                                    }}>
                                                    Eliminar
                                                </Button>
                                            </div>
                                        ) :
                                            <div>
                                                <Button
                                                    className="bg-blue-500 text-white gap-0"
                                                    type="button"
                                                    onPress={() => setFieldValue('multidestinationTrips', values?.multidestinationTrips?.concat(createDefaultTrip()))}
                                                >
                                                    <span className="w-6 h-6 flex items-center justify-center" aria-hidden="true">
                                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="currentColor" />
                                                        </svg>
                                                    </span>
                                                    <span className="px-2">
                                                        Añadir vuelo
                                                    </span>
                                                </Button>
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
            <div className="hidden md:block py-2">
                <AdvancedOptionsTrigger />
            </div>
            {
                values.showAdvancedOptions && (
                    <div className="hidden md:flex gap-2.5">
                        <AdvancedOptionsFields />
                    </div>
                )
            }
        </div>
    )
}

export default FlightsFormFields