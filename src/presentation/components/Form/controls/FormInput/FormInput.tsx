 
import React from "react"
import {
    Input,
    InputProps,
} from "@/presentation/components/Form/components/Input"

type FormInputProps = {
    name: string
    value: string
    isInvalid: boolean
    errorMessage?: React.ReactNode
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
    'aria-describedby'?: string
    'aria-label'?: string
    errorId: string
} & Omit<InputProps, "error" | "value" | "variant" | "aria-describedby" | "errorId" >

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(({
    name,
    value,
    isInvalid,
    errorMessage,
    onChange,
    onBlur,
    "aria-describedby": ariaDescribedby,
    "aria-label": ariaLabel,
    errorId,
    ...rest
}, ref) => {
    return (
        <Input
            {...rest}
            ref={ref}
            name={name}
            value={value}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
            onChange={onChange}
            onBlur={onBlur}
            aria-describedby={ariaDescribedby}
            aria-label={ariaLabel}
            errorId={errorId}
            classNames={{
                ...rest.classNames,
                errorMessage: "text-error-500 font-body3"
            }}
        />
    )
})

FormInput.displayName = "FormInput"

export default FormInput

