import * as Yup from "yup"
import {ApiError} from "@/domain/entity/Error/models/ApiError";
import {ErrorCode} from "@/domain/entity/Error/structure/error";
import { ExportTransactionsAlertHandler } from "@/presentation/pages/Profile/Transactions/components/ExportTransactionsForm/components/ExportTransactionsStatusModal/types";

export type ExportTransactionsFormValues = {
    startDate: Date | null
    endDate: Date | null
}

export const EXPORT_TRANSACTIONS_MAX_DATE = new Date(2024, 2, 1, 23, 59, 59, 999)

export const exportTransactionsFormSchema = Yup.object({
    startDate: Yup.date()
        .nullable()
        .max(EXPORT_TRANSACTIONS_MAX_DATE, "Solo puedes seleccionar fechas hasta el 1 de marzo de 2024.")
        .required("Campo requerido"),
    endDate: Yup.date()
        .nullable()
        .max(EXPORT_TRANSACTIONS_MAX_DATE, "Solo puedes seleccionar fechas hasta el 1 de marzo de 2024.")
        .required("Campo requerido")
        .test("is-greater", "La fecha final debe ser posterior a la fecha inicial", (endDate, context) => {
            const { startDate } = context.parent as ExportTransactionsFormValues

            if (startDate && endDate) {
                return startDate <= endDate
            }

            return true
        }),
})

export const getExportInitialTransactionsFormValues = (): ExportTransactionsFormValues => {
    return {
        startDate: null,
        endDate: null,
    }
}

export const onExportTransactionsFormError = (
    error: ApiError,
    alert: ExportTransactionsAlertHandler
) => {
    if(error.is(ErrorCode.EXPORT_TRANSACTION_MAX_RANGE)){
        alert("review-dates")
        return null
    }

    if(error.is(ErrorCode.EXPORT_TRANSACTIONS_NOT_FOUND)){
        alert("reports-not-found")
        return null
    }

    return null
}
