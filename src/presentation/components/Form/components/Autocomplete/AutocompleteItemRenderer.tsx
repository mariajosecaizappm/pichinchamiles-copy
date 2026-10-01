"use client"
import type { ItemRendererArgs } from "react-dropdown-select/types/select-types"
import AutocompleteItem from "./AutocompleteItem"
import type { AutocompleteOption } from "./types"

const AutocompleteItemRenderer = ({
    item,
    itemIndex,
    state,
    methods,
}: ItemRendererArgs<AutocompleteOption>) => (
    <AutocompleteItem
        option={item}
        isActive={state.cursor === itemIndex}
        isSelected={methods.isSelected(item)}
        onSelect={() => {
            methods.addItem(item)
            methods.dropDown("close")
            ;(document.activeElement as HTMLElement | null)?.blur()
        }}
    />
)

export default AutocompleteItemRenderer
