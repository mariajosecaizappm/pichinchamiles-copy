"use client"
import AutocompleteContentContainer from "./AutocompleteFieldContext"
import type { AutocompleteRendererArgs } from "./types"

const AutocompleteContentRenderer = (args: AutocompleteRendererArgs) => (
    <AutocompleteContentContainer {...args} />
)

export default AutocompleteContentRenderer
