import { Address, AddressLocation } from "@/domain/entity/Address/structure/address"
import { addressValidation } from "@/presentation/helpers/regexp"
import { validationPhone } from "@/presentation/helpers/validation"
import * as Yup from "yup"
import { createRequiredLocationFields } from "../AddressForm/addressLocationValidation"

const ADDRESS_CHARS_MESSAGE =
    "Vuelve a ingresar la información sin caracteres especiales (ej. -, ., _, @, #)."

export type BillingFormValues = Pick<
    Address,
    | "customerReceivingEmail"
    | "customerReceivingPhone"
    | "street1"
    | "street2"
    | "number"
    | "customerReceivingFirstName"
    | "customerReceivingLastName"
    | "customerReceivingIdentificationNumber"
    | "customerReceivingIdentificationType"
> & {
    state: AddressLocation | null
    city: AddressLocation | null
    zone: AddressLocation | null
    companyName?: string
    billingFullName: string
    billingMaskedDocument: string
}

export const billingFormValidationSchema = Yup.object().shape({
    customerReceivingEmail: Yup.string()
        .required("El correo es requerido")
        .email("El correo es inválido"),
    customerReceivingPhone: Yup.string()
        .required("El número telefónico es requerido")
        .matches(validationPhone, "Ingresar un número telefónico válido")
        .min(10, "Ingresar un número telefónico válido")
        .max(10, "Ingresar un número telefónico válido"),
    street1: Yup.string()
        .required("La calle principal es requerida")
        .min(3, "La calle principal es requerida")
        .max(50, "El Calle principal no puede exceder 50 caracteres")
        .matches(addressValidation, ADDRESS_CHARS_MESSAGE),
    street2: Yup.string()
        .required("La calle secundaria es requerida")
        .min(3, "La calle secundaria es requerida")
        .max(50, "El Calle secundaria no puede exceder 50 caracteres")
        .matches(addressValidation, ADDRESS_CHARS_MESSAGE),
    ...createRequiredLocationFields(),
    number: Yup.string()
        .required("El número es requerido")
        .max(15, "El Número de dirección no puede exceder 15 caracteres")
        .matches(addressValidation, ADDRESS_CHARS_MESSAGE),
})

export const addressToBillingFormValues = (
    address: Address,
    displayValues: { billingFullName: string; billingMaskedDocument: string }
): BillingFormValues => ({
    customerReceivingEmail: address.customerReceivingEmail,
    customerReceivingPhone: address.customerReceivingPhone,
    street1: address.street1,
    street2: address.street2,
    number: address.number,
    state: address.state,
    city: address.city,
    zone: address.zone,
    customerReceivingFirstName: address.customerReceivingFirstName,
    customerReceivingLastName: address.customerReceivingLastName,
    customerReceivingIdentificationNumber: address.customerReceivingIdentificationNumber,
    customerReceivingIdentificationType: address.customerReceivingIdentificationType,
    companyName: address.companyName,
    billingFullName: displayValues.billingFullName,
    billingMaskedDocument: displayValues.billingMaskedDocument,
})
