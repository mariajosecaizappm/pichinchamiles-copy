import type { AutocompleteOption, AutocompleteRendererArgs } from "./types"

export const EMPTY_OPTIONS: AutocompleteOption[] = []

export const FIELD_CLASSES = [
    "h-12 w-full rounded-sm! border! p-3! shadow-none!",
    "focus:shadow-none! focus-within:shadow-none!",
    "aria-expanded:rounded-b-none! aria-expanded:border-x-2! aria-expanded:border-t-2! aria-expanded:border-b-0!",
    "[&_.react-dropdown-select-content]:min-w-0!",
].join(" ")

export const DROPDOWN_CLASSES = [
    "[&_.react-dropdown-select-dropdown]:top-full! [&_.react-dropdown-select-dropdown]:-left-0.5! [&_.react-dropdown-select-dropdown]:-right-0.5! [&_.react-dropdown-select-dropdown]:w-auto!",
    "[&_.react-dropdown-select-dropdown]:z-40!",
    "[&_.react-dropdown-select-dropdown]:rounded-t-none! [&_.react-dropdown-select-dropdown]:rounded-b-sm!",
    "[&_.react-dropdown-select-dropdown]:border-x-2! [&_.react-dropdown-select-dropdown]:border-t-0! [&_.react-dropdown-select-dropdown]:border-b-2!",
    "[&_.react-dropdown-select-dropdown]:shadow-none!",
].join(" ")

export const VALID_CLASSES = [
    "border-grayscale-200! hover:border-information-500!",
    "focus-within:border-information-500! aria-expanded:border-information-500!",
    "[&_.react-dropdown-select-dropdown]:border-information-500!",
].join(" ")

export const INVALID_CLASSES = [
    "border-danger! hover:border-danger!",
    "focus-within:border-danger! aria-expanded:border-danger!",
    "[&_.react-dropdown-select-dropdown]:border-danger!",
].join(" ")

export const keepAllOptions = ({ props }: AutocompleteRendererArgs) => props.options ?? EMPTY_OPTIONS

export const compareByValue = (a: AutocompleteOption[], b: AutocompleteOption[]) =>
    a.length === b.length && a.every((option, index) => option.value === b[index]?.value)
