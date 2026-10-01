import { CabinType, FlightParams, LegsType, RouteType, TripParams, TripType } from "@/domain/entity/Travel/structure/flight";
import { AutocompleteOption } from "@/presentation/components/Form/controls/FormAutocomplete/FormAutocomplete";
import * as Yup from "yup";
import { searchLocations } from "./actions";
import { getMinDate } from "../../helpers/dates";

export const MIN_DAYS_AHEAD = 3;

export type AutocompleteOptionValue = Yup.InferType<typeof autocompleteOptionSchema>;

export const autocompleteOptionSchema = Yup.object({
    id: Yup.string(),
    name: Yup.string(),
    countryCode: Yup.string(),
}).default(undefined)


const basicTripValidationSchema = Yup.object({
    id: Yup.string().required(),
    origin: autocompleteOptionSchema.required('Campo requerido'),
    destination: autocompleteOptionSchema.required('Campo requerido'),
    startDate: Yup.date()
        .required('Campo requerido')
        .test('min-date', 'La fecha de salida debe ser al menos 3 días posterior a la actual', (value) => {
            if (!value) return true;
            return value >= getMinDate(MIN_DAYS_AHEAD);
        }),
});

const tripRoundValidationSchema = basicTripValidationSchema.shape({
    endDate: Yup.date()
        .required('Campo requerido')
        .test('min-date', 'La fecha de regreso no puede ser menor a la de salida.', (value) => {
            if (!value) return true;
            return value >= getMinDate(MIN_DAYS_AHEAD);
        })
        .test('is-greater', 'La fecha de regreso no puede ser menor a la de salida.', (endDate, context) => {
            const { startDate } = context.parent;
            if (startDate && endDate) {
                return startDate < endDate;
            }
            return true;
        }),
});


export const flightsSchema = Yup.object({
    flightTravelType: Yup.string()
        .default(TripType.ROUND)
        .test('is-selected', 'Debe seleccionar un tipo de viaje', (value) => value !== undefined),
    oneWayTrip: basicTripValidationSchema.when(
        ['flightTravelType'],
        (validation, schema) => {

            if (validation && validation[0] === TripType.ROUND) {
                return tripRoundValidationSchema;
            }

            return schema;
        },
    ),
    multidestinationTrips: Yup.array().default([]).when(
        ['flightTravelType'],
        (validation, schema) => {
            if (validation && validation[0] === TripType.MULTIPLE) {
                return schema.required('Campo requerido').of(basicTripValidationSchema).test("ordered-start-dates", "Las fechas de salida deben ser cronológicamente posteriores.",
                    function (trips) {
                        if (!trips || trips.length === 0) return true;
                        const { oneWayTrip } = this.parent;
                        const baseDate = oneWayTrip?.startDate as Date | undefined;
                        if (!baseDate) return true;
                        
                        for (let i = 0; i < trips.length; i++) {
                            const tripDate = (trips[i] as Trip)?.startDate;
                            if (tripDate && tripDate < baseDate) {
                                return this.createError({
                                    message: "Las fechas de salida deben ser cronológicamente posteriores.",
                                    path: `multidestinationTrips[${i}].startDate`,
                                })
                            }
                            if(i > 0) {
                                const previousTripDate = (trips[i - 1] as Trip)?.startDate;
                                if (previousTripDate && tripDate && tripDate <= previousTripDate) {
                                    return this.createError({
                                        message: "Las fechas de salida deben ser cronológicamente posteriores.",
                                        path: `multidestinationTrips[${i}].startDate`,
                                    })
                                }
                            }
                        }
                        return true;
                    }
                )
            }
            return schema;
        }
    ),
    showAdvancedOptions: Yup.boolean().default(false),
    passengersInfo: Yup.string().default('1 Pasajero'),
    adults: Yup.number().default(1),
    childrens: Yup.number().default(0),
    infants: Yup.number().default(0),
    stops: Yup.mixed<LegsType>().default(LegsType.ALL_STOPS),
    class: Yup.mixed<CabinType>().default(CabinType.ANY),
    airline: Yup.string().default('all'),
});



export function parseValuesToParams(
    values: FlightsValues,
): FlightParams {
    const oneWayTrip = values.oneWayTrip;
    const defaultFlight = mapperTripParams(oneWayTrip);
    const trips: TripParams[] = [defaultFlight];

    if (values.flightTravelType === TripType.MULTIPLE) {
        values.multidestinationTrips.forEach((trip) => {
            trips.push({
                origin: trip.origin?.id ?? '',
                destination: trip.destination?.id ?? '',
                startDate: trip.startDate ?? new Date(),
            });
        });
    }
    const originCountryCode = oneWayTrip.origin?.countryCode;
    const destinationCountryCode = oneWayTrip.destination?.countryCode;
    const routeType = getRouterType({ originCountryCode, destinationCountryCode });

    return {
        tripType: values.flightTravelType as TripType,
        trips,
        adults: values.adults,
        childrens: values.childrens,
        infants: values.infants,
        stops: values.stops,
        class: values.class,
        airline: values.airline,
        routeType,
    };
}

function mapperTripParams(oneWayTrip: Trip):TripParams {
    return {
        origin: oneWayTrip.origin?.id ?? '',
        destination: oneWayTrip.destination?.id ?? '',
        startDate: oneWayTrip.startDate ?? new Date(),
        endDate: oneWayTrip.endDate ?? new Date(),
    }
}

function getRouterType(
    { originCountryCode, destinationCountryCode }:
  { originCountryCode: string | undefined, destinationCountryCode: string | undefined }
): RouteType {
    return originCountryCode &&
    destinationCountryCode &&
    destinationCountryCode !== originCountryCode
        ? RouteType.INTERNATIONAL
        : RouteType.DOMESTIC;
}


export type FlightsValues = {
    flightTravelType: TripType | string | undefined;
    oneWayTrip: Trip;
    multidestinationTrips: Trip[];
    showAdvancedOptions: boolean;
    passengersInfo: string;
    adults: number;
    childrens: number;
    infants: number;
    stops: LegsType;
    class: CabinType;
    airline: string;
}

export type Trip = {
    id: string;
    origin: AutocompleteOptionValue | null;
    destination: AutocompleteOptionValue | null;
    startDate: Date | null;
    endDate?: Date | null;
};

const generateUUID = (): string => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID()
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 15) >> (c === "x" ? 0 : 1)
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
    })
}

export const createDefaultTrip = (): Trip => ({
    id: generateUUID(),
    origin: null,
    destination: null,
    startDate: null,
});

export const flightsInitialValues: FlightsValues = {
    flightTravelType: TripType.ROUND,
    oneWayTrip: { ...createDefaultTrip(), endDate: null },
    multidestinationTrips: [createDefaultTrip()],
    showAdvancedOptions: false,
    passengersInfo: '1 Pasajero',
    adults: 1,
    childrens: 0,
    infants: 0,
    stops: LegsType.ALL_STOPS,
    class: CabinType.ANY,
    airline: 'all',
}

export const mapAutocompleteLocations = async (search: string): Promise<AutocompleteOption[]> => {
    const results = await searchLocations(search);
    return results.map((result) => ({
        value: result.id ?? '',
        label: result.name ?? '',
        data: { countryCode: result.countryCode ?? '' },
    }));
}

export const onFlightsFormError = () => {
    return (
        <>
            Algo salió mal. Inténtalo de nuevo o espera unos minutos. Si el error persiste, llámanos al{" "}
            <strong>1800-BPMILE (276-453)</strong>.
        </>
    )
}