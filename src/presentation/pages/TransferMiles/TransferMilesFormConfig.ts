import * as Yup from "yup"
import { ApiError } from "@/domain/entity/Error/models/ApiError"
import { ErrorCode } from "@/domain/entity/Error/structure/error"
import { textAndNumbers } from "@/presentation/helpers/regexp"

const INVALID_CHARS_MESSAGE =
    "Vuelve a ingresar la información sin caracteres especiales (ej. -, ., _, @, #)."

export type TransferBeneficiaryFormValues = {
    identificationNumber: string
}

export const transferBeneficiaryFormInitialValues: TransferBeneficiaryFormValues = {
    identificationNumber: "",
}

export const transferBeneficiaryFormSchema = Yup.object({
    identificationNumber: Yup.string()
        .required("El documento del beneficiario es requerido")
        .matches(textAndNumbers, INVALID_CHARS_MESSAGE)
        .min(4, "El documento del beneficiario debe tener al menos 4 dígitos")
        .max(17, "El documento del beneficiario no puede exceder 17 caracteres"),
})

export const getTransferBeneficiaryFieldErrorMessage = (error: ApiError): string | null => {
    if (error.code === ErrorCode.SELF_TRANSFER) {
        return "No puedes transferir millas a tu propia cuenta. Ingresa el documento de otro socio."
    }

    if (error.code === ErrorCode.BENEFICIARY_NOT_FOUND) {
        return "Este usuario no está registrado en Pichincha Miles."
    }

    if (error.code === ErrorCode.USER_CANCELED) {
        return "El número de identificación se encuentra bloqueado o no tiene permitido el acceso. Para mayor información, comunícate al 1800 - BPMILE (276-453)."
    }

    return null
}

export const MIN_TRANSFER_MILES = 10
export const MAX_TRANSFER_MILES = 1_000_000

export const MILES_MIN_ERROR = "El mínimo a transferir es 10 millas."
export const MILES_MAX_ERROR = "El máximo a transferir es 1'000.000 millas."
export const MILES_INSUFFICIENT_ERROR = "Saldo insuficiente. Ingresa una cantidad menor."
export const MILES_REQUIRED_ERROR = "Las millas a transferir son requeridas"

export const digitsOnlyRegExp = /^\d*$/

export type TransferMilesAmountFormValues = {
    miles: string
}

export const transferMilesAmountFormInitialValues: TransferMilesAmountFormValues = {
    miles: "",
}

export const createTransferMilesAmountSchema = (balance: number) =>
    Yup.object({
        miles: Yup.string()
            .required(MILES_REQUIRED_ERROR)
            .matches(/^\d+$/, MILES_REQUIRED_ERROR)
            .test("min-miles", MILES_MIN_ERROR, (value) => {
                if (!value) return false
                return Number(value) >= MIN_TRANSFER_MILES
            })
            .test("max-miles", MILES_MAX_ERROR, (value) => {
                if (!value) return false
                return Number(value) <= MAX_TRANSFER_MILES
            })
            .test("max-balance", MILES_INSUFFICIENT_ERROR, (value) => {
                if (!value) return false
                return Number(value) <= balance
            }),
    })

export const parseMilesAmount = (miles: string): number => {
    const numericValue = Number(miles)
    return Number.isFinite(numericValue) ? numericValue : 0
}

export const getTransferMilesAmountError = (
    miles: string,
    balance: number
): string | undefined => {
    try {
        createTransferMilesAmountSchema(balance).validateSync({ miles })
        return undefined
    } catch (error) {
        return error instanceof Error ? error.message : undefined
    }
}

export const isValidTransferMilesAmount = (miles: string, balance: number): boolean =>
    !getTransferMilesAmountError(miles, balance)
