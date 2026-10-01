import * as Yup from 'yup';
import { ObjectSchema } from 'yup';
import {
    defaultLopdConsentFormValues,
    LopdConsentFormValues,
} from "@/presentation/components/Layout/MainLayout/components/LopdModal/lopdConsentHelpers";

export type LopdFormValues = LopdConsentFormValues

export const defaultLopdFormConfig: LopdFormValues = defaultLopdConsentFormValues

const termsFieldSchema = Yup.boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones')
    .required('Debes aceptar los términos y condiciones')

const lopdFieldSchema = Yup.boolean()
    .oneOf([true], 'Debes autorizar el tratamiento de datos personales')
    .required('Debes autorizar el tratamiento de datos personales')

const optionalBooleanFieldSchema = Yup.boolean().required()

export const createLopdFormSchema = (options: {
    withTerms: boolean
    withLopd: boolean
}): ObjectSchema<LopdFormValues> =>
    Yup.object({
        acceptedTermsAndCondition: options.withTerms
            ? termsFieldSchema
            : optionalBooleanFieldSchema,
        acceptedLopd: options.withLopd && !options.withTerms
            ? lopdFieldSchema
            : optionalBooleanFieldSchema,
    })
