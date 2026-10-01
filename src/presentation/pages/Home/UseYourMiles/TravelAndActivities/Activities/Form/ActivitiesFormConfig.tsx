import {ActivityParams} from '@/domain/entity/Travel/structure/activity';
import * as Yup from 'yup';
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import container from "@/presentation/config/inversify.config";
import GetActivitiesLocationsUseCase from "@/domain/interactors/TravelLocation/GetActivitiesLocationsUseCase";
import {ActivityLocation} from "@/domain/entity/TravelLocation/structure/activity";

export const MIN_DAYS_AHEAD = 3;

export const mapAutocompleteLocations = async (search: string) => {
    const getActivitiesLocations = container.get<GetActivitiesLocationsUseCase>(
        UseCaseTypes.GetActivitiesLocationsUseCase
    );
    const locations = await getActivitiesLocations.execute(search);
    return locations.map(({cityCode, cityName, countryName}: ActivityLocation) => {
        const formatCity = cityName ? `${cityName} - ` : '';
        const formatCode = cityCode ? `(${cityCode ?? ''})` : '';
        return {
            value: cityCode ?? '',
            label: formatCity + countryName + formatCode,
        };
    });
};

export const activitiesSchema = Yup.object({
    destination: Yup.object({
        id: Yup.string().required(),
        name: Yup.string().required(),
    }).nullable().required('Campo requerido'),
    endDate: Yup.date().required('Campo requerido'),
    age: Yup.number().required('Campo requerido').min(18, 'Debe ser mayor a 18 años'),
});

export type ActivitiesValues = {
    destination: { id: string; name: string } | null;
    endDate: Date | null;
    age: number;
};

export const activitiesInitialValues: ActivitiesValues = {
    destination: null,
    endDate: null,
    age: 18,
};

export function parseValuesToParams(values: ActivitiesValues): ActivityParams {
    const {destination, endDate, age} = values;

    return {
        destination: destination?.id ?? '',
        endDate: endDate ?? new Date(),
        age,
    };
}

export const onActivityFormError = () => {
    return (
        <>
            Algo salió mal. Inténtalo de nuevo o espera unos minutos. Si el error persiste, llámanos al{" "}
            <strong>1800-BPMILE (276-453)</strong>.
        </>
    )
}
