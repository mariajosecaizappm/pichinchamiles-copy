import React, {useContext} from "react"
import FormContext from "@/presentation/components/Form/context/FormContext"
import {
    PasswordInput,
    PasswordInputProps,
} from "@/presentation/components/Form/components/PasswordInput"

type FormPasswordInputProps = {
    name: string
    regExp?: RegExp
    testId?: string
} & Omit<PasswordInputProps, "error" | "onChange" | "value" | "variant">

const FormPasswordInput: React.FC<FormPasswordInputProps> = ({
    name,
    regExp,
    testId,
    ...rest
}) => {
    const { values, errors, submitCount, onInputChange, onBlur } = useContext(FormContext)
    const value = values[name]
    const error = errors[name] as string | undefined
    const hasValue = value !== "" && value !== undefined && value !== null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (regExp) {
            if (e.target.value === "" || regExp.test(e.target.value)) {
                onInputChange(e)
            }
        } else {
            onInputChange(e)
        }
    }

    return (
        <PasswordInput
            {...rest}
            testId={testId}
            name={name}
            value={value}
            isInvalid={!!((hasValue || submitCount > 0) && error)}
            errorMessage={(hasValue || submitCount > 0) ? error : undefined}
            onChange={handleChange}
            onBlur={onBlur}
        />
    )
}

export default FormPasswordInput
