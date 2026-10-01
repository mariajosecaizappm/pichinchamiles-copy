import FormContext from "@/presentation/components/Form/context/FormContext"
import React, { useContext } from "react"
import { getIn } from "formik"
import { Select, SelectProps } from "../../components/Select"
import { SelectItem, type SharedSelection } from "@heroui/react"


export type SelectOption = {
    id: string
    name: string
}


type FormSelectProps = {
    name: string
    options: SelectOption[]
} & Omit<SelectProps, "error" | "onChange" | "value" | "selectedKeys" | "onSelectionChange" | "children">


const FormSelect: React.FC<FormSelectProps> = ({ name, options, selectionMode = "single", ...rest }) => {
    const { values, errors, touched, submitCount, setFieldValue, onBlur } = useContext(FormContext)
    const rawValue = values[name]
    const error = errors[name] as string | undefined
    const hasValue = rawValue !== "" && rawValue !== undefined && rawValue !== null
    const isTouched = Boolean(getIn(touched, name))



    const selectedKeys: Set<string> = new Set()

    if(rawValue) {
        if(Array.isArray(rawValue)) {
            rawValue.forEach((value) => {
                selectedKeys.add(value)
            })
        } else {
            selectedKeys.add(rawValue)
        }
    }

    const handleSelectionChange = (keys: SharedSelection) => {
        if (keys === "all") return
        const arr = Array.from(keys)
        setFieldValue(name, selectionMode === "multiple" ? arr : (arr[0] ?? ""))
    }


    return (
        <Select
            {...rest}
            name={name}
            selectionMode={selectionMode}
            selectedKeys={selectedKeys}
            onSelectionChange={handleSelectionChange}
            isInvalid={!!((hasValue || submitCount > 0 || isTouched) && error)}
            errorMessage={(hasValue || submitCount > 0 || isTouched) ? error : undefined}
            onBlur={onBlur}
        >
            {options.map((opt) => (
                <SelectItem key={opt.id}>
                    {opt.name}
                </SelectItem>
            ))}
        </Select>
    )

}

export default FormSelect