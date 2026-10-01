import React, { useContext } from "react"
import FormContext from "@/presentation/components/Form/context/FormContext"
import { Checkbox, CheckboxProps } from "@/presentation/components/Form/components/Checkbox"

type FormCheckboxProps = {
    name: string
    testId?: string
} & Omit<CheckboxProps, "onChange" | "value" | "isSelected" | "onValueChange">

const FormCheckbox: React.FC<FormCheckboxProps> = ({
    name,
    testId,
    ...rest
}) => {
    const { values, errors, submitCount, setFieldValue } = useContext(FormContext)
    const value = !!values[name]
    const error = errors[name] as string | undefined
    const hasError = !!(submitCount > 0 && error)

    const handleChange = (isSelected: boolean) => {
        setFieldValue(name, isSelected)
    }

    return (
        <Checkbox
            {...rest}
            testId={testId}
            name={name}
            isSelected={value}
            onValueChange={handleChange}
            isInvalid={hasError}
        />
    )
}

export default FormCheckbox