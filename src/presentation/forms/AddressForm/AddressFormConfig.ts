import { Address, AddressLocation } from "@/domain/entity/Address/structure/address"
import { addressValidation } from "@/presentation/helpers/regexp"
import { validDocument, validationPhone } from "@/presentation/helpers/validation"
import * as Yup from "yup"
import { createRequiredLocationFields } from "./addressLocationValidation"

const ADDRESS_CHARS_MESSAGE =
    "Vuelve a ingresar la información sin caracteres especiales (ej. -, ., _, @, #)."

export interface AddressFormValues
    extends Record<string, unknown>,
    Omit<Address, "country" | "state" | "city" | "zone"> {
    country: AddressLocation | null
    state: AddressLocation | null
    city: AddressLocation | null
    zone: AddressLocation | null
}

export const addressFormInitialValues: AddressFormValues = {
    id: "",
    alias: "",
    street1: "",
    street2: "",
    country: null,
    state: null,
    city: null,
    zone: null,
    number: "",
    reference: "",
    isThirdPartyAddress: false,
    customerReceivingFirstName: "",
    customerReceivingLastName: "",
    customerReceivingEmail: "",
    customerReceivingPhone: "",
    customerReceivingIdentificationNumber: "",
    customerReceivingIdentificationType: "",
    secondPhone: "",
    postalCode: "",
    default: false,
}

export const addressFormValidationSchema = Yup.object().shape({
    alias: Yup.string()
        .trim()
        .required("Dirección requerida")
        .min(3, "Dirección requerida")
        .matches(addressValidation, ADDRESS_CHARS_MESSAGE)
        .max(50, "El nombre de la dirección no puede exceder 50 caracteres"),
    street1: Yup.string()
        .trim()
        .required("Calle principal requerida")
        .min(3, "Calle principal requerida")
        .matches(addressValidation, ADDRESS_CHARS_MESSAGE)
        .max(50, "La calle principal no puede exceder 50 caracteres"),
    street2: Yup.string()
        .trim()
        .required("Calle secundaria requerida")
        .min(3, "Calle secundaria requerida")
        .matches(addressValidation, ADDRESS_CHARS_MESSAGE)
        .max(50, "La calle secundaria no puede exceder 50 caracteres"),
    number: Yup.string()
        .trim()
        .max(15, "El número de dirección no puede exceder 15 caracteres")
        .matches(addressValidation, ADDRESS_CHARS_MESSAGE)
        .required("Número de dirección requerida"),
    reference: Yup.string()
        .trim()
        .required("Campo requerido")
        .min(3, "Campo requerido")
        .matches(addressValidation, ADDRESS_CHARS_MESSAGE)
        .max(200, "Has superado el límite de 200 caracteres permitidos"),
    ...createRequiredLocationFields(),
    secondPhone: Yup.string()
        .trim()
        .required("Número telefónico requerido")
        .matches(addressValidation, ADDRESS_CHARS_MESSAGE)
        .matches(validationPhone, "Ingresar un número telefónico valido"),
    isThirdPartyAddress: Yup.boolean(),
    customerReceivingFirstName: Yup.string()
        .trim()
        .when("isThirdPartyAddress", {
            is: true,
            then: schema =>
                schema
                    .required("Nombres requeridos")
                    .min(3, "Nombres requeridos")
                    .max(50, "Los nombres no pueden exceder 50 caracteres")
                    .matches(addressValidation, ADDRESS_CHARS_MESSAGE)
        }),
    customerReceivingLastName: Yup.string().trim().when("isThirdPartyAddress", {
        is: true,
        then: schema =>
            schema
                .required("Apellidos requeridos")
                .min(3, "Apellidos requeridos")
                .max(50, "Los apellidos no pueden exceder 50 caracteres")
                .matches(addressValidation, ADDRESS_CHARS_MESSAGE)
    }),
    customerReceivingPhone: Yup.string().when("isThirdPartyAddress", {
        is: true,
        then: schema =>
            schema
                .required("Número telefónico requerido")
                .matches(validationPhone, "Ingresar un número telefónico valido")
                .matches(addressValidation, ADDRESS_CHARS_MESSAGE),
    }),
    customerReceivingIdentificationType: Yup.string().when("isThirdPartyAddress", {
        is: true,
        then: schema => schema.required("Tipo de identificación requerido"),
    }),
    customerReceivingIdentificationNumber: Yup.string().when("isThirdPartyAddress", {
        is: true,
        then: schema =>
            schema
                .required("Documento de identificación requerido")
                .test(
                    "custom",
                    "Ingresar un documento de identificación válido",
                    function (value) {
                        if (!value) return false
                        return validDocument(value, this.parent.customerReceivingIdentificationType)
                    }
                )
                .matches(addressValidation, ADDRESS_CHARS_MESSAGE),
    }),
})
