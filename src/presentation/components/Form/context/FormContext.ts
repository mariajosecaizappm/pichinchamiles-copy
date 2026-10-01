/* eslint-disable @typescript-eslint/no-explicit-any */
import {ChangeEvent, FocusEvent, createContext, ReactNode} from "react"
import {FormikErrors, FormikTouched} from "formik"

export type FormContextValues<T = any> = {
    values: T
    errors: FormikErrors<T>
    touched: FormikTouched<T>
    onInputChange: (e: ChangeEvent<any>) => void
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
    setFieldTouched?: (field: string, touched?: boolean, shouldValidate?: boolean) => void
    setFieldError?: (field: string, message: string | undefined) => void
    onBlur: (e: FocusEvent<any>) => void
    validateForm: () => Promise<FormikErrors<T>>
    isSubmitting: boolean
    submitCount: number
    disabled: boolean
    hasErrors: boolean
    hasVisibleErrors: boolean
    alert: ReactNode | null
}

const FormContext = createContext<FormContextValues>({
    values: {},
    errors: {},
    touched: {},
    disabled: false,
    isSubmitting: false,
    submitCount: 0,
    hasErrors: false,
    hasVisibleErrors: false,
    alert: null,
    onInputChange: () => {},
    setFieldValue: () => {},
    setFieldTouched: () => {},
    onBlur: () => {},
    validateForm: () => Promise.resolve({})
})

export default FormContext
