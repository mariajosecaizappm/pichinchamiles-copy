"use client"
import React, {PropsWithChildren, ReactNode, useState, useRef, useEffect, forwardRef, useImperativeHandle} from "react"
import { createPortal } from "react-dom"
import FormContext from "./FormContext"
import {useFormik} from "formik"
import {ApiError} from "@/domain/entity/Error/models/ApiError"
import {ObjectSchema} from "yup"
import Alert from "@/presentation/components/Alert/Alert"

export interface FormRef {
    addAlert: (alertData: ReactNode | { content: ReactNode, dismiss: boolean }) => void
    clearAlert: () => void
    submitForm: () => void
    reset: () => void
    setFieldValue: (field: string, value: unknown) => void
    disableForm: (disabled: boolean) => void
    focusOn: (field: string) => void
}

export type FormProps<T extends Record<string, unknown>> = PropsWithChildren<{
    initialValues: T
    onSubmit: (values: T) => Promise<void>
    schema?: ObjectSchema<T>
    onError?: (error: ApiError) => ReactNode | { content: ReactNode, dismiss: boolean } | null
    className?: string
    formErrorId?: string
    ariaLabel?: string
    role?: string
    autoFocusOn?: keyof T
    validateOnChange?: boolean
    enableReinitialize?: boolean
}>

function FormInner<T extends Record<string, unknown>>({
    children,
    initialValues,
    onSubmit,
    schema,
    onError,
    className,
    formErrorId,
    ariaLabel,
    role,
    autoFocusOn,
    validateOnChange = false,
    enableReinitialize,
}: FormProps<T>, ref: React.ForwardedRef<FormRef>) {
    const [alert, setAlert] = useState<ReactNode | null>(null)
    const [errorContainer, setErrorContainer] = useState<HTMLElement | null>(null)
    const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const formElementRef = useRef<HTMLFormElement>(null)
    const lastFocusedSubmitCountRef = useRef(0)
    const submitCountRef = useRef(0)

    useEffect(() => {
        if (formErrorId) {
            const element = document.getElementById(formErrorId)
            if (element) {
                setErrorContainer(element)
            }
        }
    }, [formErrorId])

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
        }
    }, [])

    const handleAddAlert = (alertData: ReactNode | { content: ReactNode, dismiss: boolean }) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }
        if (alertData !== null && typeof alertData === 'object' && 'content' in alertData && 'dismiss' in alertData) {
            const { content, dismiss } = alertData as { content: ReactNode, dismiss: boolean }
            setAlert(<Alert variant="warning" className="mb-4">{content}</Alert>)
            if (dismiss) {
                timerRef.current = setTimeout(() => {
                    setAlert(null)
                }, 8000)
            }
        } else if (alertData) {
            setAlert(<Alert variant="warning" className="mb-4">{alertData as ReactNode}</Alert>)
            timerRef.current = setTimeout(() => {
                setAlert(null)
            }, 8000)
        }
    }

    const clearAlert = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }
        setAlert(null)
    }

    const shouldValidateOnChangeOrBlur = validateOnChange || submitCountRef.current > 0

    const focusOn = (field: string) => {
        if (typeof window === "undefined") return;
        const input = formElementRef.current?.querySelector<HTMLInputElement>(`input[name="${field}"]`)
        if (input) {
            input.focus()
        }
    }

    const formik = useFormik<T>({
        initialValues,
        enableReinitialize,
        validationSchema: schema,
        validateOnChange: shouldValidateOnChangeOrBlur,
        validateOnBlur: shouldValidateOnChangeOrBlur,
        onSubmit: async (values, { setSubmitting }) => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
                timerRef.current = null
            }
            setAlert(null)

            try {
                await onSubmit(values)
            } catch (error) {
                if (onError && error instanceof ApiError) {
                    const result = onError(error)
                    if (result) {
                        handleAddAlert(result)
                    }
                }else{
                    handleAddAlert("Ocurrió un error, inténtalo más tarde");
                }
            } finally {
                setSubmitting(false)
            }
        }
    })

    useEffect(() => {
        submitCountRef.current = formik.submitCount
    }, [formik.submitCount])

    useEffect(() => {
        if (formik.submitCount === 0) return
        if (formik.submitCount === lastFocusedSubmitCountRef.current) return
        if (Object.keys(formik.errors).length === 0) return

        lastFocusedSubmitCountRef.current = formik.submitCount
        requestAnimationFrame(() => {
            const firstInvalid = formElementRef.current?.querySelector('[aria-invalid="true"]')
            if (firstInvalid instanceof HTMLElement) firstInvalid.focus()
        })
    }, [formik.submitCount, formik.errors])
    
    useImperativeHandle(ref, () => ({
        addAlert: handleAddAlert,
        clearAlert,
        submitForm: () => {
            formik.submitForm()
        },
        reset: () => {
            formik.resetForm()
        },
        setFieldValue: (field: string, value: unknown) => {
            formik.setFieldValue(field, value)
        },
        disableForm: (disabled: boolean) => {
            setIsFormDisabled(disabled)
        },
        focusOn
    }))

    const hasErrors = React.useMemo(() => {
        if (!schema) return false
        return !schema.isValidSync(formik.values)
    }, [schema, formik.values])

    const hasVisibleErrors = React.useMemo(() => {
        return Object.keys(formik.errors).some((key: string) => {
            const hasValue = formik.values[key] !== "" && formik.values[key] !== undefined && formik.values[key] !== null
            const hasError = formik.errors[key]
            const hasSubmitted = formik.submitCount > 0
            const isTouched = Boolean(formik.touched[key])
            return Boolean(hasError) && (hasValue || hasSubmitted || isTouched)
        })
    }, [formik.errors, formik.values, formik.submitCount, formik.touched])

    useEffect(()=>{
        focusOn(String(autoFocusOn))
    }, [autoFocusOn])

    const contextValue = React.useMemo(() => ({
        values: formik.values,
        errors: formik.errors,
        touched: formik.touched,
        onInputChange: formik.handleChange,
        setFieldValue: formik.setFieldValue,
        setFieldTouched: formik.setFieldTouched,
        setFieldError: formik.setFieldError,
        onBlur: formik.handleBlur,
        validateForm: formik.validateForm,
        isSubmitting: formik.isSubmitting,
        submitCount: formik.submitCount,
        disabled: formik.isSubmitting || isFormDisabled,
        hasErrors,
        hasVisibleErrors,
        alert
    }), [
        formik.values,
        formik.errors,
        formik.touched,
        formik.handleChange,
        formik.setFieldValue,
        formik.setFieldTouched,
        formik.setFieldError,
        formik.handleBlur,
        formik.validateForm,
        formik.isSubmitting,
        formik.submitCount,
        hasErrors,
        hasVisibleErrors,
        alert,
        isFormDisabled
    ])

    return (
        <FormContext.Provider value={contextValue}>
            <form ref={formElementRef} onSubmit={formik.handleSubmit} className={className} aria-label={ariaLabel} role={role}>
                {alert && (errorContainer ? createPortal(alert, errorContainer) : alert)}
                {children}
            </form>
        </FormContext.Provider>
    )
}

const Form = forwardRef(FormInner) as <T extends Record<string, unknown>>(
    props: FormProps<T> & React.RefAttributes<FormRef>
) => React.ReactElement

export default Form
