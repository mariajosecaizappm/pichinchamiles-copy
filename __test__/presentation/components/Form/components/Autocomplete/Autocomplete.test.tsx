import React, { useState } from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import Autocomplete from "@/presentation/components/Form/components/Autocomplete/Autocomplete"
import type { AutocompleteOption } from "@/presentation/components/Form/components/Autocomplete/types"

const OPTIONS: AutocompleteOption[] = [
    { value: "1", label: "Quito" },
    { value: "2", label: "Guayaquil" },
    { value: "3", label: "Cuenca" },
]

const openDropdown = () => fireEvent.click(screen.getByRole("textbox"))

const typeSearch = (value: string) =>
    fireEvent.change(screen.getByRole("textbox"), { target: { value } })

describe("Autocomplete", () => {
    const onChange = vi.fn()

    beforeEach(() => {
        onChange.mockClear()
    })

    it("should link the label to the search input", () => {
        render(<Autocomplete label="Ciudad" options={OPTIONS} onChange={onChange} />)

        expect(screen.getByLabelText("Ciudad")).toBe(screen.getByRole("textbox"))
    })

    it("should render the placeholder and the testId wrapper", () => {
        render(
            <Autocomplete
                testId="city"
                placeholder="Elige una ciudad"
                options={OPTIONS}
                onChange={onChange}
            />,
        )

        expect(screen.getByTestId("city")).toBeInTheDocument()
        expect(screen.getByPlaceholderText("Elige una ciudad")).toBeInTheDocument()
    })

    it("should forward the aria-label to the field", () => {
        render(<Autocomplete aria-label="Ciudad de destino" options={OPTIONS} onChange={onChange} />)

        expect(screen.getByLabelText("Ciudad de destino")).toBeInTheDocument()
    })

    it("should render the start content", () => {
        render(
            <Autocomplete
                startContent={<span data-testid="icon" />}
                options={OPTIONS}
                onChange={onChange}
            />,
        )

        expect(screen.getByTestId("icon")).toBeInTheDocument()
    })

    it("should show the options when the field is clicked", () => {
        render(<Autocomplete options={OPTIONS} onChange={onChange} />)

        expect(screen.queryByText("Quito")).not.toBeInTheDocument()

        openDropdown()

        expect(screen.getByText("Quito")).toBeInTheDocument()
        expect(screen.getByText("Guayaquil")).toBeInTheDocument()
    })

    it("should report the picked option", () => {
        render(<Autocomplete options={OPTIONS} onChange={onChange} />)

        openDropdown()
        fireEvent.click(screen.getByText("Guayaquil"))

        expect(onChange).toHaveBeenCalledWith([OPTIONS[1]])
    })

    it("should filter the options with the typed text", () => {
        render(<Autocomplete options={OPTIONS} onChange={onChange} />)

        openDropdown()
        typeSearch("gua")

        expect(screen.getByText("Guayaquil")).toBeInTheDocument()
        expect(screen.queryByText("Quito")).not.toBeInTheDocument()
    })

    it("should keep every option when the search runs server side", () => {
        render(<Autocomplete options={OPTIONS} filterOptions={false} onChange={onChange} />)

        openDropdown()
        typeSearch("gua")

        expect(screen.getByText("Quito")).toBeInTheDocument()
        expect(screen.getByText("Guayaquil")).toBeInTheDocument()
    })

    it("should notify the typed text", () => {
        const onSearchChange = vi.fn()
        render(
            <Autocomplete options={OPTIONS} onSearchChange={onSearchChange} onChange={onChange} />,
        )

        typeSearch("qui")

        expect(onSearchChange).toHaveBeenCalledWith("qui")
    })

    it("should reject typed text that does not match the regExp", () => {
        const onSearchChange = vi.fn()
        render(
            <Autocomplete
                options={OPTIONS}
                regExp={/^[a-z]*$/}
                onSearchChange={onSearchChange}
                onChange={onChange}
            />,
        )

        typeSearch("123")

        expect(onSearchChange).not.toHaveBeenCalled()
        expect(screen.getByRole("textbox")).toHaveValue("")
    })

    it("should show the selected label over the input", () => {
        render(<Autocomplete options={OPTIONS} values={[OPTIONS[0]]} onChange={onChange} />)

        expect(screen.getByText("Quito")).toBeInTheDocument()
        expect(screen.getByRole("textbox")).toHaveClass("text-transparent", "caret-transparent")
    })

    it("should clear the selection with the clear button", () => {
        render(<Autocomplete options={OPTIONS} values={[OPTIONS[0]]} onChange={onChange} />)

        fireEvent.click(screen.getByLabelText("Limpiar selección"))

        expect(onChange).toHaveBeenCalledWith([])
    })

    it("should open the list after clearing the selection", () => {
        render(<Autocomplete options={OPTIONS} values={[OPTIONS[0]]} onChange={onChange} />)

        fireEvent.click(screen.getByLabelText("Limpiar selección"))

        expect(onChange).toHaveBeenCalledWith([])
        openDropdown()

        expect(screen.getByRole("textbox")).toHaveFocus()
        expect(screen.getByText("Quito")).toBeInTheDocument()
        expect(screen.getByText("Guayaquil")).toBeInTheDocument()
    })

    it("should hide the clear button while nothing is selected", () => {
        render(<Autocomplete options={OPTIONS} onChange={onChange} />)

        expect(screen.queryByLabelText("Limpiar selección")).not.toBeInTheDocument()
    })

    it("should drop the selection when the parent resets the values", () => {
        const Harness = () => {
            const [values, setValues] = useState<AutocompleteOption[]>([OPTIONS[0]])

            return (
                <>
                    <button onClick={() => setValues([])}>reset</button>
                    <Autocomplete options={OPTIONS} values={values} onChange={onChange} />
                </>
            )
        }

        render(<Harness />)
        expect(screen.getByText("Quito")).toBeInTheDocument()

        fireEvent.click(screen.getByText("reset"))

        expect(screen.queryByText("Quito")).not.toBeInTheDocument()
    })

    it("should show the empty message when there are no options", () => {
        render(<Autocomplete options={[]} onChange={onChange} />)

        openDropdown()

        expect(screen.getByText("No se encontraron resultados")).toBeInTheDocument()
    })

    it("should show a custom empty message", () => {
        render(<Autocomplete options={[]} noDataLabel="Sin ciudades" onChange={onChange} />)

        openDropdown()

        expect(screen.getByText("Sin ciudades")).toBeInTheDocument()
    })

    it("should describe the input with the error message", () => {
        render(
            <Autocomplete
                options={OPTIONS}
                isInvalid
                errorMessage="Campo obligatorio"
                onChange={onChange}
            />,
        )

        const input = screen.getByRole("textbox")
        const error = screen.getByText("Campo obligatorio")

        expect(input).toHaveAttribute("aria-invalid", "true")
        expect(input).toHaveAttribute("aria-describedby", error.id)
    })

    it("should not render the error message without isInvalid", () => {
        render(<Autocomplete options={OPTIONS} errorMessage="Campo obligatorio" onChange={onChange} />)

        expect(screen.queryByText("Campo obligatorio")).not.toBeInTheDocument()
    })

    it.each([
        ["disabled", { disabled: true }],
        ["isDisabled", { isDisabled: true }],
    ])("should disable the input through %s", (_name, props) => {
        render(<Autocomplete options={OPTIONS} onChange={onChange} {...props} />)

        expect(screen.getByRole("textbox")).toBeDisabled()
    })

    it("should prefer isDisabled over disabled", () => {
        render(<Autocomplete options={OPTIONS} disabled isDisabled={false} onChange={onChange} />)

        expect(screen.getByRole("textbox")).not.toBeDisabled()
    })

    it("should apply the invalid border classes", () => {
        const { container } = render(<Autocomplete options={OPTIONS} isInvalid onChange={onChange} />)

        expect(container.querySelector(".react-dropdown-select")).toHaveClass("border-danger!")
    })

    it("should stretch the list to the field width and keep it above the form", () => {
        const { container } = render(<Autocomplete options={OPTIONS} onChange={onChange} />)

        // the library sets an inline width and a low z-index, both overridden from the field
        expect(container.querySelector(".react-dropdown-select")).toHaveClass(
            "[&_.react-dropdown-select-dropdown]:-left-0.5!",
            "[&_.react-dropdown-select-dropdown]:-right-0.5!",
            "[&_.react-dropdown-select-dropdown]:w-auto!",
            "[&_.react-dropdown-select-dropdown]:z-40!",
        )
    })

    it("should let a long label truncate instead of growing the field", () => {
        const { container } = render(
            <Autocomplete
                options={OPTIONS}
                values={[{ value: "1", label: "Crossville - TN - Estados Unidos(CSV)" }]}
                onChange={onChange}
            />,
        )

        expect(container.querySelector(".react-dropdown-select")).toHaveClass(
            "[&_.react-dropdown-select-content]:min-w-0!",
        )
        expect(screen.getByText("Crossville - TN - Estados Unidos(CSV)")).toHaveClass("truncate")
    })

    it("should apply the default border classes", () => {
        const { container } = render(<Autocomplete options={OPTIONS} onChange={onChange} />)

        expect(container.querySelector(".react-dropdown-select")).toHaveClass("border-grayscale-200!")
    })
})
