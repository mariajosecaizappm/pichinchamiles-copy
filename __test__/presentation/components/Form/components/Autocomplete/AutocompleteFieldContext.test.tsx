import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
    AutocompleteFieldProvider,
    useAutocompleteField,
} from "@/presentation/components/Form/components/Autocomplete/AutocompleteFieldContext"

const ContextReader = () => {
    const field = useAutocompleteField()

    return (
        <div>
            <span data-testid="input-id">{field.inputId}</span>
            <span data-testid="described-by">{field.describedBy ?? ""}</span>
            <span data-testid="invalid">{String(field.isInvalid)}</span>
        </div>
    )
}

describe("AutocompleteFieldContext", () => {
    it("should throw when the hook is used outside the provider", () => {
        expect(() => render(<ContextReader />)).toThrow(
            "useAutocompleteField must be used within AutocompleteFieldProvider",
        )
    })

    it("should expose the field configuration to descendants", () => {
        render(
            <AutocompleteFieldProvider
                value={{
                    inputId: "city-input",
                    describedBy: "city-error",
                    isInvalid: true,
                }}
            >
                <ContextReader />
            </AutocompleteFieldProvider>,
        )

        expect(screen.getByTestId("input-id")).toHaveTextContent("city-input")
        expect(screen.getByTestId("described-by")).toHaveTextContent("city-error")
        expect(screen.getByTestId("invalid")).toHaveTextContent("true")
    })
})
