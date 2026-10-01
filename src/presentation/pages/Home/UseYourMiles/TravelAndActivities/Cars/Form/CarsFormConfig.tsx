import { CarRentalParams } from '@/domain/entity/Travel/structure/carRental';
import { AutocompleteOption } from '@/presentation/components/Form/controls/FormAutocomplete/FormAutocomplete';
import * as Yup from 'yup';
import { searchLocations } from '../actions';


export type CarsLocation = {
    id: string
    name: string
} | null

export type CarsValues = {
    pickUpLocation: CarsLocation
    pickUpDateTime: Date | null
    returnDateTime: Date | null
    showDifferentDestination: boolean
    dropOffLocation: CarsLocation
}

export const carsInitialValues: CarsValues = {
    pickUpLocation: null,
    pickUpDateTime: null,
    returnDateTime: null,
    showDifferentDestination: false,
    dropOffLocation: null,
};



export const MIN_DAYS_AHEAD = 3;

export const getMinPickUpDate = (): Date => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + MIN_DAYS_AHEAD);
    return d;
};

const autocompleteFieldSchema = Yup.object({
    id: Yup.string().required(),
    name: Yup.string().required(),
});


export const carsSchema = Yup.object({
    showDifferentDestination: Yup.boolean().default(false),
    pickUpLocation: autocompleteFieldSchema
        .nullable()
        .required('Selecciona un lugar de recogida'),
    pickUpDateTime: Yup.date()
        .typeError('Fecha y hora no válidas')
        .required('Selecciona la fecha y hora de recogida')
        .min(
            getMinPickUpDate(),
            `La fecha de recogida debe ser al menos ${MIN_DAYS_AHEAD} días después de hoy`,
        ),
    returnDateTime: Yup.date()
        .typeError('Fecha y hora no válidas')
        .required('Selecciona la fecha y hora de devolución')
        .when('pickUpDateTime', ([pickUpDateTime], schema) =>
            pickUpDateTime instanceof Date && !isNaN(pickUpDateTime.getTime())
                ? schema.min(
                    pickUpDateTime,
                    'La fecha de devolución debe ser posterior a la de recogida',
                )
                : schema,
        ),
    dropOffLocation: autocompleteFieldSchema
        .nullable()
        .when('showDifferentDestination', {
            is: true,
            then: (schema) => schema.required('Selecciona un lugar de devolución'),
            otherwise: (schema) => schema.notRequired(),
        }),
});



export function parseValuesToParams(values: CarsValues): CarRentalParams {
    const {
        pickUpLocation,
        dropOffLocation,
        showDifferentDestination,
        pickUpDateTime,
        returnDateTime,
    } = values;

    const effectiveDropOff = showDifferentDestination ? dropOffLocation : pickUpLocation;

    return {
        pickUpLocation: pickUpLocation?.id ?? '',
        dropOffLocation: effectiveDropOff?.id ?? '',
        pickUpDate: pickUpDateTime ?? new Date(),
        pickUpTime: pickUpDateTime ?? new Date(),
        dropOffDate: returnDateTime ?? new Date(),
        dropOffTime: returnDateTime ?? new Date(),
    };
}


export const mapAutocompleteLocations = async (search: string): Promise<AutocompleteOption[]> => {
    const results = await searchLocations(search);
    return results.map((result) => ({
        value: result.id ?? '',
        label: result.name ?? '',
    }));
}

export const onCarsFormError = () => {
    return (
        <>
            Algo salió mal. Inténtalo de nuevo o espera unos minutos. Si el error persiste, llámanos al{" "}
            <strong>1800-BPMILE (276-453)</strong>.
        </>
    )
}