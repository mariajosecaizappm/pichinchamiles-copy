import React from "react"
import {render, fireEvent} from "@testing-library/react"
import {describe, it, expect, vi, afterEach, beforeEach} from "vitest"
import FormContext, {
    FormContextValues,
} from "@/presentation/components/Form/context/FormContext"
import FormInputContainer from "@/presentation/components/Form/controls/FormInput/FormInputContainer"

const mocks = vi.hoisted(() => {
    const onInputChange = vi.fn()
    const onBlur = vi.fn()
    const info = vi.fn()
    let lastFormInputProps: Record<string, unknown> | null = null
    return {
        onInputChange,
        onBlur,
        info,
        getLastFormInputProps: () => lastFormInputProps,
        setLastFormInputProps: (p: Record<string, unknown>) => (lastFormInputProps = p),
    }
})

vi.mock("@/presentation/components/Form/controls/FormInput/FormInput", async () => {
    const React = await import("react")
    return {
        default: (props: Record<string, unknown>) => {
            mocks.setLastFormInputProps(props)
            return (
                <input
                    data-testid="mock-form-input"
                    name={props.name as string}
                    value={props.value as string ?? ""}
                    onChange={props.onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                    onFocus={props.onFocus as (e: React.FocusEvent<HTMLInputElement>) => void}
                    onBlur={props.onBlur as (e: React.FocusEvent<HTMLInputElement>) => void}
                    aria-label={props["aria-label"] as string}
                />
            )
        },
    }
})

vi.mock("@/presentation/helpers/numberToWords", () => ({
    numberToWords: (num: string) => num.split("").join(", "),
}))

const mockHandleScrollFocusedInputIntoView = vi.fn()

vi.mock("@/presentation/helpers/scrollFocusedInputIntoView", () => ({
    handleScrollFocusedInputIntoView: (...args: unknown[]) =>
        mockHandleScrollFocusedInputIntoView(...args),
}))

vi.mock("@/presentation/components/providers/ScreenReaderProvider", () => ({
    ScreenReaderContext: { current: null },
    useScreenReader: () => ({ info: mocks.info }),
}))

const renderWithFormContext = (ctx: Partial<FormContextValues>) => {
    const value: FormContextValues = {
        values: ctx.values ?? {},
        errors: ctx.errors ?? {},
        touched: ctx.touched ?? {},
        disabled: ctx.disabled ?? false,
        isSubmitting: ctx.isSubmitting ?? false,
        submitCount: ctx.submitCount ?? 0,
        hasErrors: ctx.hasErrors ?? false,
        hasVisibleErrors: ctx.hasVisibleErrors ?? false,
        alert: ctx.alert ?? null,
        onInputChange: ctx.onInputChange ?? mocks.onInputChange,
        setFieldValue: ctx.setFieldValue ?? vi.fn(),
        setFieldTouched: ctx.setFieldTouched ?? vi.fn(),
        setFieldError: ctx.setFieldError ?? vi.fn(),
        validateForm: ctx.validateForm ?? vi.fn(),
        onBlur: ctx.onBlur ?? mocks.onBlur,
    }

    return render(
        <FormContext.Provider value={value}>
            <FormInputContainer name="field" label="Campo" />
        </FormContext.Provider>,
    )
}

describe("FormInputContainer", () => {
    beforeEach(() => {
        mocks.onInputChange.mockReset()
        mocks.onBlur.mockReset()
        mocks.info.mockReset()
        mockHandleScrollFocusedInputIntoView.mockReset()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when field is empty and submitCount is zero", () => {
        it("should not show error even if errors has a value", () => {
            renderWithFormContext({
                values: {field: ""},
                errors: {field: "Requerido"},
                submitCount: 0,
            })

            const props = mocks.getLastFormInputProps()
            expect(props?.isInvalid).toBe(false)
            expect(props?.errorMessage).toBeUndefined()
        })
    })

    describe("when submitCount is greater than zero and there is an error", () => {
        it("should show error even if field is empty", () => {
            renderWithFormContext({
                values: {field: ""},
                errors: {field: "Requerido"},
                submitCount: 1,
            })

            const props = mocks.getLastFormInputProps()
            expect(props?.isInvalid).toBe(true)
            expect(props?.errorMessage).toBeTruthy()
        })
    })

    describe("when field has value and there is an error", () => {
        it("should show error", () => {
            renderWithFormContext({
                values: {field: "a"},
                errors: {field: "Requerido"},
                submitCount: 0,
            })

            const props = mocks.getLastFormInputProps()
            expect(props?.isInvalid).toBe(true)
            expect(props?.errorMessage).toBeTruthy()
        })
    })

    describe("when input changes and regExp is not provided", () => {
        it("should call onInputChange", () => {
            renderWithFormContext({
                values: {field: ""},
            })

            fireEvent.change(
                document.querySelector('[data-testid="mock-form-input"]') as Element,
                {target: {name: "field", value: "abc"}},
            )

            expect(mocks.onInputChange).toHaveBeenCalledTimes(1)
        })
    })

    describe("when input changes and regExp is provided", () => {
        it("should call onInputChange only for matching values or empty string", () => {
            const onlyNumbers = /^\d*$/
            const value: FormContextValues = {
                values: {field: ""},
                errors: {},
                touched: {},
                disabled: false,
                isSubmitting: false,
                submitCount: 0,
                hasErrors: false,
                hasVisibleErrors: false,
                alert: null,
                onInputChange: mocks.onInputChange,
                setFieldValue: vi.fn(),
                setFieldTouched: vi.fn(),
                setFieldError: vi.fn(),
                validateForm: vi.fn(),
                onBlur: mocks.onBlur,
            }

            render(
                <FormContext.Provider value={value}>
                    <FormInputContainer name="field" label="Campo" regExp={onlyNumbers} />
                </FormContext.Provider>,
            )

            const onChange = mocks.getLastFormInputProps()?.onChange as (e: React.ChangeEvent<HTMLInputElement>) => void

            onChange({target: {name: "field", value: "a"}} as React.ChangeEvent<HTMLInputElement>)
            onChange({target: {name: "field", value: "12"}} as React.ChangeEvent<HTMLInputElement>)
            onChange({target: {name: "field", value: ""}} as React.ChangeEvent<HTMLInputElement>)

            expect(mocks.onInputChange).toHaveBeenCalledTimes(2)
        })
    })

    describe("when input blurs", () => {
        it("should call onBlur", () => {
            renderWithFormContext({
                values: {field: ""},
            })

            fireEvent.blur(
                document.querySelector('[data-testid="mock-form-input"]') as Element,
            )

            expect(mocks.onBlur).toHaveBeenCalledTimes(1)
        })
    })

    describe("when input receives focus", () => {
        it("should scroll the focused input into view on mobile", () => {
            renderWithFormContext({
                values: {field: ""},
            })

            const input = document.querySelector('[data-testid="mock-form-input"]') as HTMLElement
            fireEvent.focus(input)

            expect(mockHandleScrollFocusedInputIntoView).toHaveBeenCalledTimes(1)
            expect(mockHandleScrollFocusedInputIntoView).toHaveBeenCalledWith(
                expect.objectContaining({ type: "focus" }),
            )
        })

        it("should call the external onFocus handler", () => {
            const onFocus = vi.fn()

            render(
                <FormContext.Provider value={{
                    values: {field: ""},
                    errors: {},
                    touched: {},
                    disabled: false,
                    isSubmitting: false,
                    submitCount: 0,
                    hasErrors: false,
                    hasVisibleErrors: false,
                    alert: null,
                    onInputChange: mocks.onInputChange,
                    setFieldValue: vi.fn(),
                    setFieldTouched: vi.fn(),
                    setFieldError: vi.fn(),
                    validateForm: vi.fn(),
                    onBlur: mocks.onBlur,
                }}>
                    <FormInputContainer name="field" label="Campo" onFocus={onFocus} />
                </FormContext.Provider>,
            )

            const input = document.querySelector('[data-testid="mock-form-input"]') as HTMLElement
            fireEvent.focus(input)

            expect(onFocus).toHaveBeenCalledTimes(1)
            expect(mockHandleScrollFocusedInputIntoView).toHaveBeenCalledTimes(1)
        })
    })

    describe("when input has value and error", () => {
        it("should include value in words and error in aria-label", () => {
            renderWithFormContext({
                values: {field: "123"},
                errors: {field: "Requerido"},
                submitCount: 1,
            })

            const input = document.querySelector('[data-testid="mock-form-input"]') as HTMLElement
            expect(input).toHaveAttribute("aria-label")
            const ariaLabel = input.getAttribute("aria-label") || ""
            expect(ariaLabel).toContain("1, 2, 3")
            expect(ariaLabel).toContain("Requerido")
        })
    })

    describe("when input has value", () => {
        it("should announce value to screen reader", () => {
            renderWithFormContext({
                values: {field: "123"},
            })

            expect(mocks.info).toHaveBeenCalledWith("Ingresaste el número [1, 2, 3]")
        })
    })

    describe("when field value is null or undefined", () => {
        it("should pass empty string to FormInput", () => {
            renderWithFormContext({
                values: { field: null },
            })

            expect(mocks.getLastFormInputProps()?.value).toBe("")
        })
    })

    describe("when field is touched and has error", () => {
        it("should show error even without value or submit", () => {
            renderWithFormContext({
                values: { field: "" },
                errors: { field: "Requerido" },
                touched: { field: true },
                submitCount: 0,
            })

            const props = mocks.getLastFormInputProps()
            expect(props?.isInvalid).toBe(true)
            expect(props?.errorMessage).toBeTruthy()
        })
    })

    describe("when field has value without error", () => {
        it("should include value in aria-label without error text", () => {
            renderWithFormContext({
                values: { field: "456" },
                errors: {},
                submitCount: 0,
            })

            const input = document.querySelector('[data-testid="mock-form-input"]') as HTMLElement
            const ariaLabel = input.getAttribute("aria-label") || ""
            expect(ariaLabel).toContain("4, 5, 6")
            expect(ariaLabel).not.toContain("Error:")
        })
    })

    describe("when displayValue is provided", () => {
        it("should pass displayValue to FormInput instead of the context value", () => {
            renderWithFormContext({
                values: {field: "context value"},
            })

            const props = mocks.getLastFormInputProps()
            expect(props?.value).toBe("context value")

            render(
                <FormContext.Provider value={{
                    values: {field: "context value"},
                    errors: {},
                    touched: {},
                    disabled: false,
                    isSubmitting: false,
                    submitCount: 0,
                    hasErrors: false,
                    hasVisibleErrors: false,
                    alert: null,
                    onInputChange: mocks.onInputChange,
                    setFieldValue: vi.fn(),
                    setFieldTouched: vi.fn(),
                    setFieldError: vi.fn(),
                    validateForm: vi.fn(),
                    onBlur: mocks.onBlur,
                }}>
                    <FormInputContainer name="field" label="Campo" displayValue="displayed value" />
                </FormContext.Provider>,
            )

            const propsWithDisplay = mocks.getLastFormInputProps()
            expect(propsWithDisplay?.value).toBe("displayed value")
        })

        it("should use displayValue even when context value is empty", () => {
            render(
                <FormContext.Provider value={{
                    values: {field: ""},
                    errors: {},
                    touched: {},
                    disabled: false,
                    isSubmitting: false,
                    submitCount: 0,
                    hasErrors: false,
                    hasVisibleErrors: false,
                    alert: null,
                    onInputChange: mocks.onInputChange,
                    setFieldValue: vi.fn(),
                    setFieldTouched: vi.fn(),
                    setFieldError: vi.fn(),
                    validateForm: vi.fn(),
                    onBlur: mocks.onBlur,
                }}>
                    <FormInputContainer name="field" label="Campo" displayValue="override" />
                </FormContext.Provider>,
            )

            const props = mocks.getLastFormInputProps()
            expect(props?.value).toBe("override")
        })
    })
})
