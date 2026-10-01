import React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import AutocompleteContentRenderer from "@/presentation/components/Form/components/Autocomplete/AutocompleteContentRenderer"
import { AutocompleteFieldProvider } from "@/presentation/components/Form/components/Autocomplete/AutocompleteFieldContext"
import type { AutocompleteRendererArgs } from "@/presentation/components/Form/components/Autocomplete/types"

vi.mock("@/presentation/components/Form/components/Autocomplete/AutocompleteContent", () => ({
    default: ({
        inputId,
        describedBy,
        isInvalid,
        startContent,
    }: {
        inputId: string
        describedBy?: string
        isInvalid?: boolean
        startContent?: React.ReactNode
    }) => (
        <div data-testid="autocomplete-content">
            <span data-testid="input-id">{inputId}</span>
            <span data-testid="described-by">{describedBy ?? ""}</span>
            <span data-testid="invalid">{String(isInvalid)}</span>
            {startContent}
        </div>
    ),
}))

const rendererArgs: AutocompleteRendererArgs = {
    props: { placeholder: "Elige una ciudad" } as AutocompleteRendererArgs["props"],
    state: {
        dropdown: false,
        values: [],
        search: "",
        selectBounds: {},
        cursor: null,
        searchResults: [],
    },
    methods: {} as AutocompleteRendererArgs["methods"],
}

describe("AutocompleteContentRenderer", () => {
    it("should merge the renderer args with the field context", () => {
        render(
            <AutocompleteFieldProvider
                value={{
                    inputId: "city-input",
                    describedBy: "city-error",
                    isInvalid: true,
                    startContent: <span data-testid="icon" />,
                }}
            >
                <AutocompleteContentRenderer {...rendererArgs} />
            </AutocompleteFieldProvider>,
        )

        expect(screen.getByTestId("autocomplete-content")).toBeInTheDocument()
        expect(screen.getByTestId("input-id")).toHaveTextContent("city-input")
        expect(screen.getByTestId("described-by")).toHaveTextContent("city-error")
        expect(screen.getByTestId("invalid")).toHaveTextContent("true")
        expect(screen.getByTestId("icon")).toBeInTheDocument()
    })
})
