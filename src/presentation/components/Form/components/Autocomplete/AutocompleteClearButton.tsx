"use client"
import CloseIcon from "@/presentation/pages/Home/components/Header/components/Menu/components/Icons/CloseIcon"
import type { MouseEvent } from "react"
import type { RendererArgs } from "react-dropdown-select/types/select-types"
import type { AutocompleteOption } from "./types"

const AutocompleteClearButton = ({ state, methods }: RendererArgs<AutocompleteOption>) => {
    if (state.values.length === 0) return null

    const handleClear = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        methods.clearAll()
        methods.dropDown("open")
    }

    return (
        <button
            type="button"
            aria-label="Limpiar selección"
            className="ml-2 flex shrink-0 items-center text-grayscale-400 hover:text-grayscale-500"
            onClick={handleClear}
        >
            <CloseIcon className="size-3.5" />
        </button>
    )
}

export default AutocompleteClearButton
