import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { getIn } from "formik"
import FormContext from "@/presentation/components/Form/context/FormContext"
import { AutocompleteProps } from "../../components/Autocomplete"
import FormAutocomplete, { AutocompleteOption } from "./FormAutocomplete"

type OptionObject = { id?: string; name?: string; [key: string]: unknown }

const EMPTY_OPTIONS: AutocompleteOption[] = []
const SEARCH_DEBOUNCE_MS = 300

type FormAutocompleteContainerProps = {
    name: string
    options?: AutocompleteOption[]
    onSearch?: (search: string) => Promise<AutocompleteOption[]>
    valueAsObject?: boolean
    onFocus?: () => void
} & Omit<
    AutocompleteProps,
    "values" | "options" | "onChange" | "isInvalid" | "errorMessage" | "filterOptions"
>

const FormAutocompleteContainer: React.FC<FormAutocompleteContainerProps> = ({
    name,
    options: staticOptions = EMPTY_OPTIONS,
    onSearch,
    valueAsObject = false,
    onFocus,
    ...rest
}) => {
    const [options, setOptions] = useState<AutocompleteOption[]>(staticOptions)
    const isSearchingRef = useRef(false)
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const requestIdRef = useRef(0)

    const { values, errors, submitCount, setFieldValue, setFieldTouched, onBlur } =
        useContext(FormContext)

    const rawValue = getIn(values, name) as string | OptionObject | undefined | null
    const error = getIn(errors, name) as string | undefined

    const selectedKey = valueAsObject
        ? ((rawValue as OptionObject)?.id ?? null)
        : (rawValue as string | null | undefined) ?? null

    const hasValue = Boolean(selectedKey)

    const selectedOption = useMemo<AutocompleteOption | null>(() => {
        if (!selectedKey) return null

        if (valueAsObject) {
            const { id, name: optionLabel, ...data } = rawValue as OptionObject
            return {
                value: id as string,
                label: (optionLabel as string) ?? "",
                data: data as Record<string, string>,
            }
        }

        return {
            value: selectedKey,
            label: options.find(option => option.value === selectedKey)?.label ?? selectedKey,
        }
    }, [selectedKey, valueAsObject, rawValue, options])

    const handleSelectionChange = (option: AutocompleteOption | null) => {
        isSearchingRef.current = false

        if (valueAsObject) {
            setFieldValue(name, option ? { id: option.value, name: option.label, ...option.data } : null)
        } else {
            setFieldValue(name, option?.value ?? "")
        }

        if (!option) setFieldTouched?.(name, true, false)
    }

    const fetchOptions = useCallback(
        (search: string) => {
            if (!onSearch) return

            const requestId = ++requestIdRef.current

            onSearch(search).then(results => {
                // only the latest request may update the list
                if (requestId === requestIdRef.current) setOptions(results)
            })
        },
        [onSearch],
    )

    const handleSearchChange = useCallback(
        (search: string) => {
            isSearchingRef.current = true

            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
            debounceTimerRef.current = setTimeout(() => fetchOptions(search), SEARCH_DEBOUNCE_MS)
        },
        [fetchOptions],
    )

    const handleDropdownOpen = useCallback(() => {
        isSearchingRef.current = false
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)

        if (onSearch) fetchOptions("")
        else setOptions(staticOptions)

        onFocus?.()
    }, [fetchOptions, onSearch, staticOptions, onFocus])

    useEffect(() => {
        if (isSearchingRef.current) return
        if (staticOptions.length === 0 && options.length > 0) return
        setOptions(staticOptions)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [staticOptions])

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
        }
    }, [])

    return (
        <FormAutocomplete
            {...rest}
            name={name}
            options={options}
            selectedOption={selectedOption}
            filterOptions={!onSearch}
            onSelectionChange={handleSelectionChange}
            onSearchChange={handleSearchChange}
            onDropdownOpen={handleDropdownOpen}
            isInvalid={!!((hasValue || submitCount > 0) && error)}
            errorMessage={(hasValue || submitCount > 0) ? error : undefined}
            onBlur={onBlur}
        />
    )
}

export default FormAutocompleteContainer
