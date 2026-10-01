"use client"
import {
    ChangeEvent,
    createContext,
    FocusEvent,
    ReactNode,
    RefObject,
    useContext,
    useEffect,
    useRef,
} from "react"
import AutocompleteContent from "./AutocompleteContent"
import type { AutocompleteRendererArgs } from "./types"

export type AutocompleteFieldContextValue = {
    inputId: string
    describedBy?: string
    isInvalid?: boolean
    startContent?: ReactNode
    regExp?: RegExp
    onSearchChange?: (search: string) => void
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void
}

const AutocompleteFieldContext = createContext<AutocompleteFieldContextValue | null>(null)

export const AutocompleteFieldProvider = AutocompleteFieldContext.Provider

export const useAutocompleteField = () => {
    const value = useContext(AutocompleteFieldContext)
    if (!value) {
        throw new Error("useAutocompleteField must be used within AutocompleteFieldProvider")
    }
    return value
}

export type AutocompleteContentController = AutocompleteFieldContextValue &
    AutocompleteRendererArgs & {
        inputRef: RefObject<HTMLInputElement | null>
        selected: AutocompleteRendererArgs["state"]["values"][number] | undefined
        showSelectedLabel: boolean
        openField: () => void
        handleChange: (event: ChangeEvent<HTMLInputElement>) => void
        handleInputClick: () => void
        handleBlur: (event: FocusEvent<HTMLInputElement>) => void
        handleFocus: (event: FocusEvent<HTMLInputElement>) => void
    }

const AutocompleteContentContainer = (args: AutocompleteRendererArgs) => {
    const { props, state, methods } = args
    const field = useAutocompleteField()
    const { regExp, onSearchChange, onBlur } = field
    const inputRef = useRef<HTMLInputElement>(null)
    const selected = state.values[0]
    const showSelectedLabel = Boolean(selected) && state.search === ""

    useEffect(() => {
        if (state.dropdown) inputRef.current?.focus()
        else inputRef.current?.blur()
    }, [state.dropdown])

    const openField = () => {
        inputRef.current?.focus()
        methods.dropDown("open")
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        if (regExp && value !== "" && !regExp.test(value)) return

        methods.setSearch(event)
        onSearchChange?.(value)
    }

    const handleInputClick = () => {
        if (state.dropdown && props.closeOnClickInput && !state.search) {
            methods.dropDown("close")
            return
        }
        methods.dropDown("open")
    }

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        if (state.dropdown) return
        onBlur?.(event)
    }

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        event.stopPropagation()
        if (!state.dropdown) methods.dropDown("open")
    }

    return (
        <AutocompleteContent
            {...field}
            {...args}
            inputRef={inputRef}
            selected={selected}
            showSelectedLabel={showSelectedLabel}
            openField={openField}
            handleChange={handleChange}
            handleInputClick={handleInputClick}
            handleBlur={handleBlur}
            handleFocus={handleFocus}
        />
    )
}

export default AutocompleteContentContainer
