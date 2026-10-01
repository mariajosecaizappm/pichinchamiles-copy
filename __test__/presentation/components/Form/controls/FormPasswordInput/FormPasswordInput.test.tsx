import React from "react"
import {render, fireEvent} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import FormContext, {
    FormContextValues,
} from "@/presentation/components/Form/context/FormContext"
import FormPasswordInput from "@/presentation/components/Form/controls/FormPasswordInput/FormPasswordInput"

const mocks = vi.hoisted(() => {
    const onInputChange = vi.fn()
    const onBlur = vi.fn()
    let lastPasswordInputProps: any = null
    return {
        onInputChange,
        onBlur,
        getLastPasswordInputProps: () => lastPasswordInputProps,
        setLastPasswordInputProps: (p: any) => (lastPasswordInputProps = p),
    }
})

vi.mock("@/presentation/components/Form/components/PasswordInput", async () => {
    const React = await import("react")
    return {
        PasswordInput: (props: any) => {
            mocks.setLastPasswordInputProps(props)
            return (
                <input
                    data-testid="mock-password-input"
                    name={props.name}
                    value={props.value ?? ""}
                    onChange={props.onChange}
                    onBlur={props.onBlur}
                />
            )
        },
    }
})

const renderWithFormContext = (ctx: Partial<FormContextValues>) => {
    const value: FormContextValues = {
        values: {},
        errors: {},
        touched: {},
        disabled: false,
        isSubmitting: false,
        submitCount: 0,
        hasErrors: false,
        alert: null,
        onInputChange: mocks.onInputChange,
        onBlur: mocks.onBlur,
        setFieldValue: vi.fn(),
        ...ctx,
    }

    return render(
        <FormContext.Provider value={value}>
            <FormPasswordInput name="password" label="Contraseña" testId="password" />
        </FormContext.Provider>,
    )
}

describe("FormPasswordInput", () => {
    beforeEach(() => {
        mocks.onInputChange.mockReset()
        mocks.onBlur.mockReset()
        mocks.setLastPasswordInputProps(null)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when field is empty and submitCount is zero", () => {
        it("should not show error even if errors has a value", () => {
            renderWithFormContext({
                values: {password: ""},
                errors: {password: "Requerido"},
                submitCount: 0,
            })

            const props = mocks.getLastPasswordInputProps()
            expect(props.isInvalid).toBe(false)
            expect(props.errorMessage).toBeUndefined()
        })
    })

    describe("when submitCount is greater than zero and there is an error", () => {
        it("should show error even if field is empty", () => {
            renderWithFormContext({
                values: {password: ""},
                errors: {password: "Requerido"},
                submitCount: 1,
            })

            const props = mocks.getLastPasswordInputProps()
            expect(props.isInvalid).toBe(true)
            expect(props.errorMessage).toBe("Requerido")
        })
    })

    describe("when input changes and regExp is not provided", () => {
        it("should call onInputChange", () => {
            renderWithFormContext({
                values: {password: ""},
            })

            fireEvent.change(
                document.querySelector('[data-testid="mock-password-input"]') as Element,
                {target: {name: "password", value: "abc"}},
            )

            expect(mocks.onInputChange).toHaveBeenCalledTimes(1)
        })
    })

    describe("when input changes and regExp is provided", () => {
        it("should call onInputChange only for matching values or empty string", () => {
            const onlyNumbers = /^\d*$/
            const value: FormContextValues = {
                values: {password: ""},
                errors: {},
                touched: {},
                disabled: false,
                isSubmitting: false,
                submitCount: 0,
                hasErrors: false,
                alert: null,
                onInputChange: mocks.onInputChange,
                onBlur: mocks.onBlur,
                setFieldValue: vi.fn(),
            }

            render(
                <FormContext.Provider value={value}>
                    <FormPasswordInput
                        name="password"
                        label="Contraseña"
                        regExp={onlyNumbers}
                    />
                </FormContext.Provider>,
            )

            const onChange = mocks.getLastPasswordInputProps()
                .onChange as (e: React.ChangeEvent<HTMLInputElement>) => void

            onChange({target: {name: "password", value: "a"}} as any)
            onChange({target: {name: "password", value: "12"}} as any)
            onChange({target: {name: "password", value: ""}} as any)

            expect(mocks.onInputChange).toHaveBeenCalledTimes(2)
        })
    })

    describe("when input blurs", () => {
        it("should call onBlur", () => {
            renderWithFormContext({
                values: {password: ""},
            })

            fireEvent.blur(
                document.querySelector('[data-testid="mock-password-input"]') as Element,
            )

            expect(mocks.onBlur).toHaveBeenCalledTimes(1)
        })
    })
})

