"use client"
import type { RendererArgs } from "react-dropdown-select/types/select-types"
import type { AutocompleteOption } from "./types"

const AutocompleteNoData = ({ props: selectProps }: RendererArgs<AutocompleteOption>) => (
    <div className="flex h-10 items-center border-t border-grayscale-100 px-4 py-2 text-sm text-grayscale-400">
        {selectProps.noDataLabel}
    </div>
)

export default AutocompleteNoData
