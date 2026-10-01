import React, {useContext, useEffect, useMemo} from "react"
import { getIn } from "formik"
import FormContext from "@/presentation/components/Form/context/FormContext"
import {numberToWords} from "@/presentation/helpers/numberToWords"
import { handleScrollFocusedInputIntoView } from "@/presentation/helpers/scrollFocusedInputIntoView"
import {useScreenReader} from "@/presentation/components/providers/ScreenReaderProvider"
import {InputProps} from "@/presentation/components/Form/components/Input"
import FormInput from "./FormInput"

type FormInputContainerProps = {
    name: string
    regExp?: RegExp
    onValueChange?: (value: string) => void
    displayValue?: string
} & Omit<InputProps, "error" | "onChange" | "value" | "variant" | "aria-describedby" | "errorId">

const FormInputContainer: React.FC<FormInputContainerProps> = ({
    name,
    regExp,
    onValueChange,
    displayValue,
    'aria-label': ariaLabelProp,
    onFocus,
    ...rest
}) => {
    const { values, errors, touched, submitCount, onInputChange, onBlur } = useContext(FormContext)
    const { info } = useScreenReader()
    const errorId = `${name}-error`
    const value = values[name]
    const error = errors[name] as string | undefined
    const hasValue = value !== "" && value !== undefined && value !== null
    const isTouched = Boolean(getIn(touched, name))
    const showError = !!((hasValue || submitCount > 0 || isTouched) && error)

    const spokenValue = hasValue ? `Ingresaste el número [${numberToWords(String(value))}]` : ''

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (regExp) {
            if (e.target.value === "" || regExp.test(e.target.value)) {
                onInputChange(e)
                onValueChange?.(e.target.value)
            }
            return
        }

        onInputChange(e)
        onValueChange?.(e.target.value)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        handleScrollFocusedInputIntoView(e)
        onFocus?.(e)
    }

    useEffect(() => {
        if (spokenValue) {
            info(spokenValue)
        }
    }, [spokenValue, info])

    const getInputAriaLabel = useMemo(() => {
        let baseLabel = '';
        const labelProp = rest.label;

        if (typeof ariaLabelProp === 'string') {
            baseLabel = ariaLabelProp;
        } else if (typeof labelProp === 'string') {
            baseLabel = labelProp;
        }
        
        const valueInWords = hasValue ? numberToWords(String(value)) : '';
        if (showError && valueInWords) {
            return `${baseLabel}. Valor ingresado: ${valueInWords}. Error: ${error}`;
        }
        if (valueInWords) {
            return `${baseLabel}. Valor ingresado: ${valueInWords}`;
        }
        return baseLabel;
    }, [ariaLabelProp, rest.label, hasValue, value, showError, error])

    return (
        <FormInput
            {...rest}
            name={name}
            value={displayValue ?? value ?? ""}
            isInvalid={showError}
            errorMessage={showError ? <span aria-label={`Error. ${error}`}>{error}</span> : undefined}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={onBlur}
            aria-describedby={showError ? errorId : undefined}
            aria-label={getInputAriaLabel}
            errorId={errorId}
        />
    )
}

export default FormInputContainer
