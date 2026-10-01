import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import type { AutocompleteOption } from "@/presentation/components/Form/components/Autocomplete"

vi.mock("@/presentation/components/Form/components/Autocomplete", () => ({
    default: ({
        name,
        options,
        values,
        isInvalid,
        errorMessage,
        onChange,
        label,
        placeholder,
    }: Record<string, unknown>) => (
        <div data-testid="autocomplete">
            <span data-testid="name">{name as string}</span>
            <span data-testid="label">{label as string}</span>
            <span data-testid="placeholder">{placeholder as string}</span>
            <span data-testid="options">{JSON.stringify(options)}</span>
            <span data-testid="values">{JSON.stringify(values)}</span>
            <span data-testid="is-invalid">{String(isInvalid)}</span>
            <span data-testid="error-message">{errorMessage as string}</span>
            <button
                data-testid="pick"
                onClick={() =>
                    (onChange as (v: AutocompleteOption[]) => void)([
                        { value: "2", label: "Guayaquil" },
                    ])
                }
            />
            <button
                data-testid="clear"
                onClick={() => (onChange as (v: AutocompleteOption[]) => void)([])}
            />
        </div>
    ),
}))

import FormAutocomplete from "@/presentation/components/Form/controls/FormAutocomplete/FormAutocomplete"

const OPTIONS: AutocompleteOption[] = [
    { value: "1", label: "Quito" },
    { value: "2", label: "Guayaquil" },
]

const onSelectionChange = vi.fn()

const renderComponent = (
    props: Partial<React.ComponentProps<typeof FormAutocomplete>> = {},
) =>
    render(
        <FormAutocomplete
            name="city"
            options={OPTIONS}
            selectedOption={null}
            isInvalid={false}
            onSelectionChange={onSelectionChange}
            {...props}
        />,
    )

describe("FormAutocomplete", () => {
    beforeEach(() => {
        onSelectionChange.mockClear()
    })

    it("should forward the field name and the options", () => {
        renderComponent()

        expect(screen.getByTestId("name")).toHaveTextContent("city")
        expect(screen.getByTestId("options")).toHaveTextContent(JSON.stringify(OPTIONS))
    })

    it("should forward the remaining props", () => {
        renderComponent({ label: "Ciudad", placeholder: "Elige una ciudad" })

        expect(screen.getByTestId("label")).toHaveTextContent("Ciudad")
        expect(screen.getByTestId("placeholder")).toHaveTextContent("Elige una ciudad")
    })

    it("should send an empty selection when there is no selected option", () => {
        renderComponent()

        expect(screen.getByTestId("values")).toHaveTextContent("[]")
    })

    it("should wrap the selected option into the values list", () => {
        renderComponent({ selectedOption: OPTIONS[0] })

        expect(screen.getByTestId("values")).toHaveTextContent(JSON.stringify([OPTIONS[0]]))
    })

    it("should report the picked option", () => {
        renderComponent()

        fireEvent.click(screen.getByTestId("pick"))

        expect(onSelectionChange).toHaveBeenCalledWith({ value: "2", label: "Guayaquil" })
    })

    it("should report null when the selection is cleared", () => {
        renderComponent({ selectedOption: OPTIONS[0] })

        fireEvent.click(screen.getByTestId("clear"))

        expect(onSelectionChange).toHaveBeenCalledWith(null)
    })

    it("should forward the validation state", () => {
        renderComponent({ isInvalid: true, errorMessage: "Campo obligatorio" })

        expect(screen.getByTestId("is-invalid")).toHaveTextContent("true")
        expect(screen.getByTestId("error-message")).toHaveTextContent("Campo obligatorio")
    })
})
