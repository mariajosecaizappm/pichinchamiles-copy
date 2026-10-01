import {render} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach} from "vitest"
import React from "react"
import FormContext from "@/presentation/components/Form/context/FormContext"
import FormTextAreaContainer from "@/presentation/components/Form/controls/FormTextArea/FormTextAreaContainer"
import type {FormContextValues} from "@/presentation/components/Form/context/FormContext"

const mocks = vi.hoisted(() => ({
    onInputChange: vi.fn(),
    onBlur: vi.fn(),
    getLastProps: vi.fn(),
}))

vi.mock("@/presentation/components/Form/controls/FormTextArea/FormTextArea", () => ({
    default: (props: Record<string, unknown>) => {
        mocks.getLastProps(props)
        return <textarea data-testid="mock-textarea" {...props} />
    },
}))

const renderWithContext = (ctx: Partial<FormContextValues> = {}) => {
    const value: FormContextValues = {
        values: {description: ""},
        errors: {},
        touched: {},
        onInputChange: mocks.onInputChange,
        setFieldValue: vi.fn(),
        setFieldTouched: vi.fn(),
        setFieldError: vi.fn(),
        onBlur: mocks.onBlur,
        validateForm: vi.fn(),
        isSubmitting: false,
        submitCount: 0,
        disabled: false,
        hasErrors: false,
        hasVisibleErrors: false,
        alert: null,
        ...ctx,
    }

    return render(
        <FormContext.Provider value={value}>
            <FormTextAreaContainer name="description" label="Description" />
        </FormContext.Provider>,
    )
}

describe("FormTextAreaContainer", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should pass the current value to FormTextArea", () => {
        renderWithContext({
            values: {description: "test description"},
        })

        const props = mocks.getLastProps.mock.calls[0][0]
        expect(props.value).toBe("test description")
    })

    it("should call onInputChange when the textarea value changes", () => {
        renderWithContext({
            values: {description: ""},
        })

        const props = mocks.getLastProps.mock.calls[0][0]
        props.onChange({target: {name: "description", value: "new value"}} as React.ChangeEvent<HTMLInputElement>)

        expect(mocks.onInputChange).toHaveBeenCalled()
    })

    it("should not call onInputChange when value does not match regExp", () => {
        render(
            <FormContext.Provider value={{
                values: {description: ""},
                errors: {},
                touched: {},
                onInputChange: mocks.onInputChange,
                setFieldValue: vi.fn(),
                setFieldTouched: vi.fn(),
                setFieldError: vi.fn(),
                onBlur: mocks.onBlur,
                validateForm: vi.fn(),
                isSubmitting: false,
                submitCount: 0,
                disabled: false,
                hasErrors: false,
                hasVisibleErrors: false,
                alert: null,
            }}>
                <FormTextAreaContainer name="description" label="Description" regExp={/^\d*$/} />
            </FormContext.Provider>,
        )

        const props = mocks.getLastProps.mock.calls[0][0]
        props.onChange({target: {name: "description", value: "abc"}} as React.ChangeEvent<HTMLInputElement>)
        props.onChange({target: {name: "description", value: "123"}} as React.ChangeEvent<HTMLInputElement>)

        expect(mocks.onInputChange).toHaveBeenCalledTimes(1)
    })

    it("should show error when field is touched and has error and was submitted", () => {
        renderWithContext({
            values: {description: ""},
            errors: {description: "Required"},
            touched: {description: true},
            submitCount: 1,
        })

        const props = mocks.getLastProps.mock.calls[0][0]
        expect(props.isInvalid).toBe(true)
        expect(props.errorMessage).toBeTruthy()
    })
})
