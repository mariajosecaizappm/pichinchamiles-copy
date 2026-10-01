"use client"
import { clsx } from "clsx"
import { FocusEvent, ReactNode, useId, useMemo } from "react"
import Select from "react-dropdown-select"
import type { SelectProps } from "react-dropdown-select/types/select-types"
import AutocompleteClearButton from "./AutocompleteClearButton"
import AutocompleteContentRenderer from "./AutocompleteContentRenderer"
import { AutocompleteFieldProvider } from "./AutocompleteFieldContext"
import AutocompleteItemRenderer from "./AutocompleteItemRenderer"
import AutocompleteNoData from "./AutocompleteNoData"
import {
    compareByValue,
    EMPTY_OPTIONS,
    DROPDOWN_CLASSES,
    FIELD_CLASSES,
    INVALID_CLASSES,
    keepAllOptions,
    VALID_CLASSES,
} from "./autocompleteConfig"
import type { AutocompleteOption } from "./types"

export type { AutocompleteOption } from "./types"

export interface BaseAutocompleteProps
    extends Omit<SelectProps<AutocompleteOption>, "className" | "onChange"> {
    label?: ReactNode
    startContent?: ReactNode
    testId?: string
    isDisabled?: boolean
    isInvalid?: boolean
    errorMessage?: string
    filterOptions?: boolean
    regExp?: RegExp
    className?: string
    "aria-label"?: string
    onChange?: (values: AutocompleteOption[]) => void
    onSearchChange?: (search: string) => void
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void
}

const BaseAutocomplete = ({
    label,
    startContent,
    testId,
    disabled,
    isDisabled,
    isInvalid,
    errorMessage,
    filterOptions = true,
    regExp,
    className,
    options = EMPTY_OPTIONS,
    noDataLabel = "No se encontraron resultados",
    onSearchChange,
    onBlur,
    "aria-label": ariaLabel,
    ...rest
}: BaseAutocompleteProps) => {
    const inputId = useId()
    const errorId = `${inputId}-error`
    const showError = Boolean(isInvalid && errorMessage)

    const fieldContext = useMemo(
        () => ({
            inputId,
            describedBy: showError ? errorId : undefined,
            isInvalid,
            startContent,
            regExp,
            onSearchChange,
            onBlur,
        }),
        [inputId, errorId, showError, isInvalid, startContent, regExp, onSearchChange, onBlur],
    )

    return (
        <div className="flex w-full flex-col gap-2" data-testid={testId}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm leading-4 font-semibold text-grayscale-500"
                >
                    {label}
                </label>
            )}

            <AutocompleteFieldProvider value={fieldContext}>
                <Select<AutocompleteOption>
                    {...rest}
                    options={options}
                    noDataLabel={noDataLabel}
                    disabled={isDisabled ?? disabled}
                    clearable
                    searchable
                    closeOnSelect
                    dropdownHandle={false}
                    compareValuesFunc={compareByValue}
                    searchFn={filterOptions ? undefined : keepAllOptions}
                    additionalProps={{ "aria-label": ariaLabel }}
                    className={clsx(
                        FIELD_CLASSES,
                        DROPDOWN_CLASSES,
                        isInvalid ? INVALID_CLASSES : VALID_CLASSES,
                        className,
                    )}
                    contentRenderer={AutocompleteContentRenderer}
                    itemRenderer={AutocompleteItemRenderer}
                    clearRenderer={AutocompleteClearButton}
                    noDataRenderer={AutocompleteNoData}
                />
            </AutocompleteFieldProvider>

            {showError && (
                <span id={errorId} className="text-tiny text-error-500">
                    {errorMessage}
                </span>
            )}
        </div>
    )
}

export default BaseAutocomplete
