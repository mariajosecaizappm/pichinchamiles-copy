import React, { useMemo } from "react"
import Autocomplete, { AutocompleteOption, AutocompleteProps } from "../../components/Autocomplete"

export type { AutocompleteOption }

export type FormAutocompletePresentationalProps = {
    name: string
    options: AutocompleteOption[]
    selectedOption: AutocompleteOption | null
    isInvalid: boolean
    errorMessage?: string
    onSelectionChange: (option: AutocompleteOption | null) => void
} & Omit<AutocompleteProps, "values" | "options" | "onChange" | "isInvalid" | "errorMessage">

const NO_VALUES: AutocompleteOption[] = []

const FormAutocomplete: React.FC<FormAutocompletePresentationalProps> = ({
    name,
    options,
    selectedOption,
    isInvalid,
    errorMessage,
    onSelectionChange,
    ...rest
}) => {
    const values = useMemo(
        () => (selectedOption ? [selectedOption] : NO_VALUES),
        [selectedOption],
    )

    return (
        <Autocomplete
            {...rest}
            name={name}
            options={options}
            values={values}
            onChange={selected => onSelectionChange(selected[0] ?? null)}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
        />
    )
}

export default FormAutocomplete
