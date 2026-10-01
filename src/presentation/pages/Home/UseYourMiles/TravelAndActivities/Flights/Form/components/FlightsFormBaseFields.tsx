import { TripType } from "@/domain/entity/Travel/structure/flight";
import { Button } from "@/presentation/components/Form/components/Button";
import FormContext from "@/presentation/components/Form/context/FormContext";
import FormAutocomplete from "@/presentation/components/Form/controls/FormAutocomplete";
import FormDatePicker from "@/presentation/components/Form/controls/FormDatePicker/FormDatePicker";
import FormDateRangePicker from "@/presentation/components/Form/controls/FormDateRangePicker/FormDateRangePicker";
import FormSelect from "@/presentation/components/Form/controls/FormSelect";
import IconPlane from "@/presentation/components/icons/IconPlane";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useContext } from "react";
import { PassengersSelect } from "../../../Form/components/PassengerSelect";
import { buildPassengerCategories, flightTravelTypes } from "../data";
import { createDefaultTrip, mapAutocompleteLocations, MIN_DAYS_AHEAD, Trip } from "../FlightsFormConfig";
import AdvancedOptionsTrigger from "./AdvancedOptionsFormFieldsTrigger";
import AdvancedOptionsFields from "./AdvanceOptionsFormFields";
import MultiStepTravelFields from "./MultiStepTravelFields";

const FlightsFormBaseFields = () => {
    const { values, setFieldValue } = useContext(FormContext)
    const minDate = today(getLocalTimeZone()).add({ days: MIN_DAYS_AHEAD });
    
    const adults: number = values.adults ?? 1;
    const childrens: number = values.childrens ?? 0;
    const infants: number = values.infants ?? 0;
    const categories = buildPassengerCategories(adults, childrens, infants);
    
    return (
        <>
            <FormSelect
                name="flightTravelType"
                label="Tipo de viaje"
                testId="flightTravelType"
                aria-label="Elige el tipo de viaje que vas a realizar."
                placeholder="Selecciona el tipo de viaje"
                options={flightTravelTypes}
            />


            <FormAutocomplete
                name="oneWayTrip.origin"
                label="Origen"
                aria-label="Origen del viaje"
                testId="origin"
                valueAsObject
                placeholder="Origen"
                startContent={
                    <IconPlane />
                }
                onSearch={mapAutocompleteLocations}
            />


            <FormAutocomplete
                name="oneWayTrip.destination"
                label="Destino"
                aria-label="Destino del viaje"
                testId="destination"
                valueAsObject
                placeholder="Destino"
                startContent={
                    <IconPlane />
                }
                onSearch={mapAutocompleteLocations}
            />


            {
                values.flightTravelType === TripType.ROUND ? (
                    <FormDateRangePicker
                        aria-label="Escoge las fechas de vuelo"
                        label="Fechas del vuelo"
                        startName="oneWayTrip.startDate"
                        endName="oneWayTrip.endDate"
                        minValue={minDate}
                    />
                ) : (
                    <FormDatePicker
                        aria-label="Escoge las fechas de vuelo"
                        label="Fecha de salida"
                        name="oneWayTrip.startDate"
                        minValue={minDate}
                    />
                )
            }

            <div className="col-span-1">
                <PassengersSelect
                    label="Número de pasajeros"
                    categories={categories}
                    testId="passengers-select"
                    triggerAriaLabel="Escoge el número de pasajeros"
                />
            </div>


            {
                values.flightTravelType === TripType.MULTIPLE && (

                    <div className="col-span-1 grid gap-2.5 md:hidden">
                        {
    
                            values.multidestinationTrips?.map((trip: Trip, index: number) => (
                                <div className="grid gap-2.5" key={trip.id}>
                                    <MultiStepTravelFields index={index}/>
                                    {index > 0 ? (

                                        <Button
                                            type="button"
                                            variant="bordered" className="border-blue-500 text-blue-500 h-8 text-xs" onPress={() => {
                                                const newTrips = values.multidestinationTrips?.filter((_: Trip, i: number) => i !== index )
                                                setFieldValue('multidestinationTrips', newTrips)
                                            }}>
                                            Eliminar vuelo
                                        </Button>
                                    ) :   
                                        <div>
                                            <Button
                                                className="bg-blue-500 text-white gap-0 h-8 text-xs"
                                                type="button"
                                                onPress={() => setFieldValue('multidestinationTrips', values?.multidestinationTrips?.concat(createDefaultTrip()))}
                                            >
                                                <span className="w-4 h-4 flex items-center justify-center" aria-hidden="true">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12.6668 8.66732H8.66683V12.6673H7.3335V8.66732H3.3335V7.33398H7.3335V3.33398H8.66683V7.33398H12.6668V8.66732Z" fill="currentColor"/>
                                                    </svg>
                                                </span>
                                                <span className="px-2">
                                                    Añadir vuelo
                                                </span>
                                            </Button>
                                        </div>
                                    }
                                </div>
                            ))
                        }
                        
                    </div>

                )
            }


            <div className="block @lg:col-span-2 md:hidden py-2">
                <AdvancedOptionsTrigger />
            </div>
            {
                values.showAdvancedOptions && (
                    <div className="col-span-1 @lg:col-span-2 grid @lg:grid-cols-2 gap-2.5 md:hidden">
                        <AdvancedOptionsFields />
                    </div>
                )
            }
        </>
    );
};

export default FlightsFormBaseFields;