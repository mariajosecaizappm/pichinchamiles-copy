import type { RendererArgs } from "react-dropdown-select/types/select-types"

export type AutocompleteOption = { value: string; label: string; data?: Record<string, string> }

export type AutocompleteRendererArgs = RendererArgs<AutocompleteOption>
