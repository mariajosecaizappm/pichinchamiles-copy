import React, { useState } from "react"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import FormContext, { FormContextValues } from "@/presentation/components/Form/context/FormContext"
import type { AutocompleteOption } from "@/presentation/components/Form/components/Autocomplete"

vi.mock("@/presentation/components/Form/controls/FormAutocomplete/FormAutocomplete", () => ({
    default: ({
        name,
        options,
        selectedOption,
        isInvalid,
        errorMessage,
        filterOptions,
        onSelectionChange,
        onSearchChange,
        onDropdownOpen,
        onBlur,
    }: Record<string, unknown>) => (
        <div data-testid="form-autocomplete">
            <span data-testid="name">{name as string}</span>
            <span data-testid="options">{JSON.stringify(options)}</span>
            <span data-testid="selected-option">{JSON.stringify(selectedOption)}</span>
            <span data-testid="is-invalid">{String(isInvalid)}</span>
            <span data-testid="error-message">{errorMessage as string}</span>
            <span data-testid="filter-options">{String(filterOptions)}</span>
            <input
                data-testid="search"
                onChange={event =>
                    (onSearchChange as (value: string) => void)(event.target.value)
                }
            />
            <button
                data-testid="pick"
                onClick={() =>
                    (onSelectionChange as (option: AutocompleteOption) => void)({
                        value: "2",
                        label: "Guayaquil",
                        data: { grade: "CITY" },
                    })
                }
            />
            <button
                data-testid="clear"
                onClick={() => (onSelectionChange as (option: null) => void)(null)}
            />
            <button data-testid="open" onClick={() => (onDropdownOpen as () => void)()} />
            <button data-testid="blur" onClick={() => (onBlur as () => void)()} />
        </div>
    ),
}))

import FormAutocompleteContainer from "@/presentation/components/Form/controls/FormAutocomplete/FormAutocompleteContainer"

const OPTIONS: AutocompleteOption[] = [
    { value: "1", label: "Quito" },
    { value: "2", label: "Guayaquil" },
]

const setFieldValue = vi.fn()
const setFieldTouched = vi.fn()
const onBlur = vi.fn()

const createContext = (overrides: Partial<FormContextValues> = {}): FormContextValues => ({
    values: {},
    errors: {},
    touched: {},
    disabled: false,
    isSubmitting: false,
    submitCount: 0,
    hasErrors: false,
    hasVisibleErrors: false,
    alert: null,
    onInputChange: vi.fn(),
    setFieldValue,
    setFieldTouched,
    onBlur,
    validateForm: vi.fn().mockResolvedValue({}),
    ...overrides,
})

type ContainerProps = React.ComponentProps<typeof FormAutocompleteContainer>

const renderContainer = (
    props: Partial<ContainerProps> = {},
    context: Partial<FormContextValues> = {},
) =>
    render(
        <FormContext.Provider value={createContext(context)}>
            <FormAutocompleteContainer name="city" {...props} />
        </FormContext.Provider>,
    )

const selectedOption = () => JSON.parse(screen.getByTestId("selected-option").textContent || "null")
const options = () => JSON.parse(screen.getByTestId("options").textContent || "[]")

describe("FormAutocompleteContainer", () => {
    beforeEach(() => {
        setFieldValue.mockClear()
        setFieldTouched.mockClear()
        onBlur.mockClear()
    })

    it("should forward the field name", () => {
        renderContainer({ options: OPTIONS })

        expect(screen.getByTestId("name")).toHaveTextContent("city")
        expect(options()).toEqual(OPTIONS)
    })

    describe("selection", () => {
        it("should store the option value on a plain field", () => {
            renderContainer({ options: OPTIONS })

            fireEvent.click(screen.getByTestId("pick"))

            expect(setFieldValue).toHaveBeenCalledWith("city", "2")
        })

        it("should store the whole option on an object field", () => {
            renderContainer({ options: OPTIONS, valueAsObject: true })

            fireEvent.click(screen.getByTestId("pick"))

            expect(setFieldValue).toHaveBeenCalledWith("city", {
                id: "2",
                name: "Guayaquil",
                grade: "CITY",
            })
        })

        it("should empty a plain field when the selection is cleared", () => {
            renderContainer({ options: OPTIONS }, { values: { city: "1" } })

            fireEvent.click(screen.getByTestId("clear"))

            expect(setFieldValue).toHaveBeenCalledWith("city", "")
            expect(setFieldTouched).toHaveBeenCalledWith("city", true, false)
        })

        it("should null an object field when the selection is cleared", () => {
            renderContainer(
                { options: OPTIONS, valueAsObject: true },
                { values: { city: { id: "1", name: "Quito" } } },
            )

            fireEvent.click(screen.getByTestId("clear"))

            expect(setFieldValue).toHaveBeenCalledWith("city", null)
            expect(setFieldTouched).toHaveBeenCalledWith("city", true, false)
        })

        it("should clear the field when the context has no setFieldTouched", () => {
            renderContainer({ options: OPTIONS }, { values: { city: "1" }, setFieldTouched: undefined })

            fireEvent.click(screen.getByTestId("clear"))

            expect(setFieldValue).toHaveBeenCalledWith("city", "")
        })
    })

    describe("selected option", () => {
        it("should stay empty without a form value", () => {
            renderContainer({ options: OPTIONS })

            expect(selectedOption()).toBeNull()
        })

        it("should take the label from the options of a plain field", () => {
            renderContainer({ options: OPTIONS }, { values: { city: "1" } })

            expect(selectedOption()).toEqual({ value: "1", label: "Quito" })
        })

        it("should fall back to the stored value when it is not in the options", () => {
            renderContainer({ options: OPTIONS }, { values: { city: "99" } })

            expect(selectedOption()).toEqual({ value: "99", label: "99" })
        })

        it("should keep the extra data of an object field", () => {
            renderContainer(
                { options: OPTIONS, valueAsObject: true },
                { values: { city: { id: "2", name: "Guayaquil", grade: "CITY" } } },
            )

            expect(selectedOption()).toEqual({
                value: "2",
                label: "Guayaquil",
                data: { grade: "CITY" },
            })
        })

        it("should use an empty label when the object has no name", () => {
            renderContainer({ valueAsObject: true }, { values: { city: { id: "2" } } })

            expect(selectedOption()).toEqual({ value: "2", label: "", data: {} })
        })

        it("should read nested field names", () => {
            renderContainer(
                { name: "trip.origin", options: OPTIONS },
                { values: { trip: { origin: "1" } } },
            )

            expect(selectedOption()).toEqual({ value: "1", label: "Quito" })
        })
    })

    describe("validation", () => {
        it("should show the error once the field has a value", () => {
            renderContainer(
                { options: OPTIONS },
                { values: { city: "1" }, errors: { city: "Campo obligatorio" } },
            )

            expect(screen.getByTestId("is-invalid")).toHaveTextContent("true")
            expect(screen.getByTestId("error-message")).toHaveTextContent("Campo obligatorio")
        })

        it("should show the error after a submit attempt", () => {
            renderContainer(
                { options: OPTIONS },
                { errors: { city: "Campo obligatorio" }, submitCount: 1 },
            )

            expect(screen.getByTestId("is-invalid")).toHaveTextContent("true")
        })

        it("should hide the error on an untouched empty field", () => {
            renderContainer({ options: OPTIONS }, { errors: { city: "Campo obligatorio" } })

            expect(screen.getByTestId("is-invalid")).toHaveTextContent("false")
            expect(screen.getByTestId("error-message")).toBeEmptyDOMElement()
        })

        it("should forward the blur of the form", () => {
            renderContainer({ options: OPTIONS })

            fireEvent.click(screen.getByTestId("blur"))

            expect(onBlur).toHaveBeenCalledTimes(1)
        })
    })

    describe("search", () => {
        beforeEach(() => {
            vi.useFakeTimers({ shouldAdvanceTime: true })
        })

        afterEach(() => {
            vi.useRealTimers()
        })

        it("should debounce the search and keep only the last text", async () => {
            const onSearch = vi.fn().mockResolvedValue([{ value: "3", label: "Cuenca" }])
            renderContainer({ onSearch })

            fireEvent.change(screen.getByTestId("search"), { target: { value: "cu" } })
            fireEvent.change(screen.getByTestId("search"), { target: { value: "cue" } })

            expect(onSearch).not.toHaveBeenCalled()

            await act(async () => {
                vi.advanceTimersByTime(300)
            })

            expect(onSearch).toHaveBeenCalledTimes(1)
            expect(onSearch).toHaveBeenCalledWith("cue")
            expect(options()).toEqual([{ value: "3", label: "Cuenca" }])
        })

        it("should ignore results of an outdated search", async () => {
            const stale = [{ value: "9", label: "Stale" }]
            const fresh = [{ value: "3", label: "Cuenca" }]
            let resolveStale: (value: AutocompleteOption[]) => void = () => {}
            const onSearch = vi
                .fn()
                .mockImplementationOnce(
                    () => new Promise<AutocompleteOption[]>(resolve => (resolveStale = resolve)),
                )
                .mockResolvedValueOnce(fresh)

            renderContainer({ onSearch })

            fireEvent.change(screen.getByTestId("search"), { target: { value: "st" } })
            await act(async () => {
                vi.advanceTimersByTime(300)
            })

            fireEvent.change(screen.getByTestId("search"), { target: { value: "cue" } })
            await act(async () => {
                vi.advanceTimersByTime(300)
            })

            await act(async () => {
                resolveStale(stale)
            })

            expect(options()).toEqual(fresh)
        })

        it("should drop a pending search when the component unmounts", async () => {
            const onSearch = vi.fn().mockResolvedValue([])
            const { unmount } = renderContainer({ onSearch })

            fireEvent.change(screen.getByTestId("search"), { target: { value: "cu" } })
            unmount()

            await act(async () => {
                vi.advanceTimersByTime(300)
            })

            expect(onSearch).not.toHaveBeenCalled()
        })
    })

    describe("opening the list", () => {
        it("should reload the options from the server", async () => {
            const onSearch = vi.fn().mockResolvedValue([{ value: "3", label: "Cuenca" }])
            renderContainer({ onSearch })

            fireEvent.click(screen.getByTestId("open"))

            expect(onSearch).toHaveBeenCalledWith("")
            await waitFor(() => expect(options()).toEqual([{ value: "3", label: "Cuenca" }]))
        })

        it("should restore the static options without a search callback", async () => {
            const onSearch = vi.fn().mockResolvedValue([{ value: "3", label: "Cuenca" }])
            const { rerender } = renderContainer({ options: OPTIONS, onSearch })

            fireEvent.click(screen.getByTestId("open"))
            await waitFor(() => expect(options()).toEqual([{ value: "3", label: "Cuenca" }]))

            rerender(
                <FormContext.Provider value={createContext()}>
                    <FormAutocompleteContainer name="city" options={OPTIONS} />
                </FormContext.Provider>,
            )
            fireEvent.click(screen.getByTestId("open"))

            expect(options()).toEqual(OPTIONS)
        })

        it("should notify the parent that the field was activated", () => {
            const onFocus = vi.fn()
            renderContainer({ options: OPTIONS, onFocus })

            fireEvent.click(screen.getByTestId("open"))

            expect(onFocus).toHaveBeenCalledTimes(1)
        })
    })

    describe("options list", () => {
        it("should let the field filter locally without a search callback", () => {
            renderContainer({ options: OPTIONS })

            expect(screen.getByTestId("filter-options")).toHaveTextContent("true")
        })

        it("should skip the local filter when the search runs server side", () => {
            renderContainer({ onSearch: vi.fn().mockResolvedValue([]) })

            expect(screen.getByTestId("filter-options")).toHaveTextContent("false")
        })

        it("should follow the static options given by the parent", () => {
            const Harness = () => {
                const [current, setCurrent] = useState(OPTIONS)

                return (
                    <FormContext.Provider value={createContext()}>
                        <button onClick={() => setCurrent([{ value: "3", label: "Cuenca" }])}>
                            update
                        </button>
                        <FormAutocompleteContainer name="city" options={current} />
                    </FormContext.Provider>
                )
            }

            render(<Harness />)
            fireEvent.click(screen.getByText("update"))

            expect(options()).toEqual([{ value: "3", label: "Cuenca" }])
        })

        it("should keep the searched options when the parent sends an empty list", async () => {
            const onSearch = vi.fn().mockResolvedValue([{ value: "3", label: "Cuenca" }])
            const Harness = () => {
                const [current, setCurrent] = useState<AutocompleteOption[]>(OPTIONS)

                return (
                    <FormContext.Provider value={createContext()}>
                        <button onClick={() => setCurrent([])}>empty</button>
                        <FormAutocompleteContainer
                            name="city"
                            options={current}
                            onSearch={onSearch}
                        />
                    </FormContext.Provider>
                )
            }

            render(<Harness />)
            fireEvent.click(screen.getByTestId("open"))
            await waitFor(() => expect(options()).toEqual([{ value: "3", label: "Cuenca" }]))

            fireEvent.click(screen.getByText("empty"))

            expect(options()).toEqual([{ value: "3", label: "Cuenca" }])
        })

        it("should keep the searched options while the user is typing", async () => {
            const onSearch = vi.fn().mockResolvedValue([{ value: "3", label: "Cuenca" }])
            const Harness = () => {
                const [current, setCurrent] = useState<AutocompleteOption[]>(OPTIONS)

                return (
                    <FormContext.Provider value={createContext()}>
                        <button onClick={() => setCurrent([{ value: "4", label: "Loja" }])}>
                            update
                        </button>
                        <FormAutocompleteContainer
                            name="city"
                            options={current}
                            onSearch={onSearch}
                        />
                    </FormContext.Provider>
                )
            }

            render(<Harness />)
            fireEvent.change(screen.getByTestId("search"), { target: { value: "cu" } })
            await waitFor(() => expect(options()).toEqual([{ value: "3", label: "Cuenca" }]))

            fireEvent.click(screen.getByText("update"))

            expect(options()).toEqual([{ value: "3", label: "Cuenca" }])
        })
    })
})
