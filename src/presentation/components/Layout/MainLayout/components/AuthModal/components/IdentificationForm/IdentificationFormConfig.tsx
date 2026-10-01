import * as Yup from "yup"
import {ApiError} from "@/domain/entity/Error/models/ApiError";
import {ErrorCode} from "@/domain/entity/Error/structure/error";

export type IdentificationFormValues = {
    identificationNumber: string
}

export const defaultIdentificationFormValues: IdentificationFormValues = {
    identificationNumber: ""
}

export const identificationFormSchema = Yup.object({
    identificationNumber: Yup.string()
        .min(4, "El documento de identificación debe tener al menos 4 dígitos")
        .required("El documento de identificación es requerido")
})

export const onIdentificationFormError = (error: ApiError) => {
    if (error.code === ErrorCode.INVALID_USER) {
        return <div aria-label="Advertencia. El documento de identificación ingresado no forma parte del programa. Conoce nuestras tarjetas para aprovechar estos beneficios. Para más información comunícate con nosotros al uno ochocientos B P M I L E, dos siete seis cuatro cinco tres.">
            El documento de identificación ingresado no forma parte del programa.
            <br />
            Para más información, comunícate con nosotros al <span className="font-semibold">1800 - BPMILE (276-453)</span>.
        </div>
    }

    if (error.code === ErrorCode.USER_CANCELED) {
        return <div aria-label="Advertencia. El número de identificación se encuentra bloqueado o no tiene permitido el acceso. Para mayor información comunícate al uno al uno ochocientos B P M I L E, dos siete seis cuatro cinco tres.">
            El número de identificación se encuentra bloqueado o no tiene permitido el acceso. Para mayor
            información, comunícate al <span className="font-bold">1800 - BPMILE (276-453)</span>
        </div>
    }
}
