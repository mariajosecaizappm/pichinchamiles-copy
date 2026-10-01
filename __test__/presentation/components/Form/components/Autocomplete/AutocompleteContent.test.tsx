import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import AutocompleteContentContainer, {
    AutocompleteFieldProvider,
    type AutocompleteFieldContextValue,
} from "@/presentation/components/Form/components/Autocomplete/AutocompleteFieldContext"
import type {
    AutocompleteOption,
    AutocompleteRendererArgs,
} from "@/presentation/components/Form/components/Autocomplete/types"

const QUITO: AutocompleteOption = { value: "1", label: "Quito" }

const setSearch = vi.fn()
const dropDown = vi.fn()

type RendererState = AutocompleteRendererArgs["state"]
type RendererProps = AutocompleteRendererArgs["props"]

const buildRendererArgs = ({
    values = [] as AutocompleteOption[],
    search = "",
    dropdown = false,
    selectProps = {},
}: {
    values?: AutocompleteOption[]
    search?: string
    dropdown?: boolean
    selectProps?: Partial<RendererProps>
} = {}): AutocompleteRendererArgs => ({
    props: { placeholder: "Elige una ciudad", ...selectProps } as RendererProps,
    state: {
        dropdown,
        values,
        search,
        selectBounds: {},
        cursor: null,
        searchResults: [],
    } as RendererState,
    methods: { setSearch, dropDown } as unknown as AutocompleteRendererArgs["methods"],
})

const renderContent = ({
    field = {},
    ...rendererOptions
}: {
    field?: Partial<AutocompleteFieldContextValue>
    values?: AutocompleteOption[]
    search?: string
    dropdown?: boolean
    selectProps?: Partial<RendererProps>
} = {}) =>
    render(
        <AutocompleteFieldProvider
            value={{
                inputId: "city-input",
                ...field,
            }}
        >
            <AutocompleteContentContainer {...buildRendererArgs(rendererOptions)} />
        </AutocompleteFieldProvider>,
    )

describe("AutocompleteContent", () => {
    beforeEach(() => {
        setSearch.mockClear()
        dropDown.mockClear()
    })

    it("should render the placeholder while nothing is selected", () => {
        renderContent()

        expect(screen.getByPlaceholderText("Elige una ciudad")).toBeInTheDocument()
    })

    it("should render the start content", () => {
        renderContent({ field: { startContent: <span data-testid="icon" /> } })

        expect(screen.getByTestId("icon")).toBeInTheDocument()
    })

    it("should show the selected label over the input", () => {
        renderContent({ values: [QUITO] })

        expect(screen.getByText("Quito")).toBeInTheDocument()
        expect(screen.getByRole("textbox")).toHaveClass("text-transparent", "caret-transparent")
        expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "")
    })

    it("should hide the selected label while searching", () => {
        renderContent({ values: [QUITO], search: "gua" })

        expect(screen.queryByText("Quito")).not.toBeInTheDocument()
        expect(screen.getByRole("textbox")).not.toHaveClass("sr-only")
    })

    it("should forward the typed text", () => {
        const onSearchChange = vi.fn()
        renderContent({ field: { onSearchChange } })

        fireEvent.change(screen.getByRole("textbox"), { target: { value: "qui" } })

        expect(setSearch).toHaveBeenCalledTimes(1)
        expect(onSearchChange).toHaveBeenCalledWith("qui")
    })

    it("should ignore typed text that does not match the regExp", () => {
        const onSearchChange = vi.fn()
        renderContent({ field: { onSearchChange, regExp: /^[a-z]*$/ } })

        fireEvent.change(screen.getByRole("textbox"), { target: { value: "12" } })

        expect(setSearch).not.toHaveBeenCalled()
        expect(onSearchChange).not.toHaveBeenCalled()
    })

    it("should allow emptying the input even with a regExp", () => {
        const onSearchChange = vi.fn()
        renderContent({ search: "abc", field: { onSearchChange, regExp: /^[a-z]+$/ } })

        fireEvent.change(screen.getByRole("textbox"), { target: { value: "" } })

        expect(setSearch).toHaveBeenCalledTimes(1)
        expect(onSearchChange).toHaveBeenCalledWith("")
    })

    it("should focus the input when the list opens", () => {
        renderContent({ dropdown: true })

        expect(screen.getByRole("textbox")).toHaveFocus()
    })

    it("should keep the input blurred while the list is closed", () => {
        renderContent()

        expect(screen.getByRole("textbox")).not.toHaveFocus()
    })

    it("should ignore blur while the list is open", () => {
        const onBlur = vi.fn()
        renderContent({ dropdown: true, field: { onBlur } })

        fireEvent.blur(screen.getByRole("textbox"))

        expect(onBlur).not.toHaveBeenCalled()
    })

    it("should open the list when the input is clicked", () => {
        renderContent()

        fireEvent.click(screen.getByRole("textbox"))

        expect(dropDown).toHaveBeenCalledWith("open")
    })

    it("should open the list when the start content is clicked", () => {
        renderContent({ field: { startContent: <span>icon</span> } })

        fireEvent.click(screen.getByRole("button"))

        expect(dropDown).toHaveBeenCalledWith("open")
    })

    it("should report the blur once the list is closed", () => {
        const onBlur = vi.fn()
        renderContent({ field: { onBlur } })

        fireEvent.blur(screen.getByRole("textbox"))

        expect(onBlur).toHaveBeenCalledTimes(1)
    })

    it("should disable the input when the field is disabled", () => {
        renderContent({ selectProps: { disabled: true } })

        expect(screen.getByRole("textbox")).toBeDisabled()
    })

    it("should expose the invalid state and its description", () => {
        renderContent({ field: { isInvalid: true, describedBy: "city-error" } })

        const input = screen.getByRole("textbox")

        expect(input).toHaveAttribute("aria-invalid", "true")
        expect(input).toHaveAttribute("aria-describedby", "city-error")
        expect(input).toHaveClass("placeholder:text-danger")
    })

    it("should use the id given by the field", () => {
        renderContent()

        expect(screen.getByRole("textbox")).toHaveAttribute("id", "city-input")
    })
})
