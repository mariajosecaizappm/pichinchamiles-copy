import { HotelParams } from '@/domain/entity/Travel/structure/hotel';
import * as Yup from 'yup';
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import container from "@/presentation/config/inversify.config";
import GetHotelsLocationsUseCase from "@/domain/interactors/TravelLocation/GetHotelsLocationsUseCase";
import { HotelLocation } from "@/domain/entity/TravelLocation";

export const MIN_DAYS_AHEAD = 3;

export const MAX_CHILDREN_AGES = 17;

export const mapAutocompleteLocations = async (search: string) => {
    const getHotelsLocations = container.get<GetHotelsLocationsUseCase>(
        UseCaseTypes.GetHotelsLocationsUseCase
    );
    const locations = await getHotelsLocations.execute(search);
    return locations.map(({ cityCode, cityName, countryName }: HotelLocation) => {
        const formatCity = cityName ? `${cityName} - ` : '';
        const formatCode = cityCode ? `(${cityCode ?? ''})` : '';
        return {
            value: cityCode ?? '',
            label: formatCity + countryName + formatCode,
        };
    });
};

export const hotelsSchema = Yup.object({
    destination: Yup.object({
        id: Yup.string().required(),
        name: Yup.string().required(),
    }).nullable().required('Campo requerido'),
    startDate: Yup.date().required('Campo requerido'),
    endDate: Yup.date()
        .required('Campo requerido')
        .test('is-greater', 'La fecha de salida debe ser posterior a la fecha de entrada', (endDate, context) => {
            const { startDate } = context.parent;
            if (startDate && endDate) {
                return startDate < endDate;
            }
            return true;
        }),
    adults: Yup.number().min(1, 'Debe haber al menos 1 adulto').required('Campo requerido'),
    childrens: Yup.number().min(0, 'No puede ser negativo').max(4, 'Máximo 4 niños').required('Campo requerido'),
    ageChildren1: Yup.number().min(0, 'No puede ser negativo').max(MAX_CHILDREN_AGES, 'La edad máxima es 17 años')
        .when('childrens', {
            is: (childrens: number) => childrens >= 1,
            then: (schema) => schema.required('Campo requerido'),
            otherwise: (schema) => schema
        }),
    ageChildren2: Yup.number().min(0, 'No puede ser negativo').max(MAX_CHILDREN_AGES, 'La edad máxima es 17 años')
        .when('childrens', {
            is: (childrens: number) => childrens >= 2,
            then: (schema) => schema.required('Campo requerido'),
            otherwise: (schema) => schema
        }),
    ageChildren3: Yup.number().min(0, 'No puede ser negativo').max(MAX_CHILDREN_AGES, 'La edad máxima es 17 años')
        .when('childrens', {
            is: (childrens: number) => childrens >= 3,
            then: (schema) => schema.required('Campo requerido'),
            otherwise: (schema) => schema
        }),
    ageChildren4: Yup.number().min(0, 'No puede ser negativo').max(MAX_CHILDREN_AGES, 'La edad máxima es 17 años')
        .when('childrens', {
            is: (childrens: number) => childrens >= 4,
            then: (schema) => schema.required('Campo requerido'),
            otherwise: (schema) => schema
        }),
    passengersInfo: Yup.string().default('1 Habitación, 2 Huéspedes'),
});

export type HotelsValues = {
    destination: { id: string; name: string } | null;
    startDate: Date | null;
    endDate: Date | null;
    adults: number;
    childrens: number;
    ageChildren1: number | undefined;
    ageChildren2: number | undefined;
    ageChildren3: number | undefined;
    ageChildren4: number | undefined;
    passengersInfo: string;
};

export const hotelsInitialValues: HotelsValues = {
    destination: null,
    startDate: null,
    endDate: null,
    adults: 2,
    childrens: 0,
    ageChildren1: 0,
    ageChildren2: 0,
    ageChildren3: 0,
    ageChildren4: 0,
    passengersInfo: '1 Habitación, 2 Huéspedes',
};

export function parseValuesToParams(values: HotelsValues): HotelParams {
    const {
        adults,
        ageChildren1,
        ageChildren2,
        ageChildren3,
        ageChildren4,
        startDate,
        endDate,
        destination,
    } = values;

    const ageChildrens = [
        ageChildren1,
        ageChildren2,
        ageChildren3,
        ageChildren4,
    ].filter((age): age is number => age !== undefined && age > 0);

    return {
        destination: destination?.id ?? '',
        adults,
        ageChildrens,
        checkIn: startDate ?? new Date(),
        checkOut: endDate ?? new Date(),
    };
}

export const onHotelsFormError = () => {
    return (
        <>
            Algo salió mal. Inténtalo de nuevo o espera unos minutos. Si el error persiste, llámanos al{" "}
            <strong>1800-BPMILE (276-453)</strong>.
        </>
    )
}