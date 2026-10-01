import { DisneyParams } from "@/domain/entity/Travel/structure/disney";
import * as Yup from "yup";
import { getMinDate } from "../../helpers/dates";

export const MIN_DAYS_AHEAD = 3;

export const disneySchema = Yup.object({
    date: Yup.date()
        .required('Campo requerido')
        .min(getMinDate(MIN_DAYS_AHEAD), `La fecha debe ser al menos ${MIN_DAYS_AHEAD} días después de hoy`),
    adults: Yup.number().min(1, 'Debe haber al menos 1 adulto').required('Campo requerido'),
    childrens: Yup.number().min(0, 'No puede ser negativo').required('Campo requerido'),
    passengersInfo: Yup.string().default('1 Pasajero'),
});

export type DisneyValues = {
    adults: number;
    childrens: number;
    date: Date | null;
    passengersInfo: string;
};

export const disneyInitialValues: DisneyValues = {
    adults: 1,
    childrens: 0,
    date: null,
    passengersInfo: '1 Pasajero',
};

export function parseValuesToParams(values: DisneyValues): DisneyParams {
    const { adults, childrens, date } = values;

    return {
        adults,
        childrens,
        date: date ?? new Date()
    };
}

export const onDisneyFormError = () => {
    return (
        <>
            Algo salió mal. Inténtalo de nuevo o espera unos minutos. Si el error persiste, llámanos al{" "}
            <strong>1800-BPMILE (276-453)</strong>.
        </>
    )
}
