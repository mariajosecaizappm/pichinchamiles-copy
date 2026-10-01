import React from "react"
import {render} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import FormContext, {
    FormContextValues,
} from "@/presentation/components/Form/context/FormContext"
import FormCheckbox from "@/presentation/components/Form/controls/FormCheckbox/FormCheckbox"

const mocks = vi.hoisted(() => {
    const setFieldValue = vi.fn()
    let lastCheckboxProps: any = null
    return {
        setFieldValue,
        getLastCheckboxProps: () => lastCheckboxProps,
        setLastCheckboxProps: (p: any) => (lastCheckboxProps = p),
    }
})

vi.mock("@/presentation/components/Form/components/Checkbox", async () => {
    const React = await import("react")
    return {
        Checkbox: (props: any) => {
            mocks.setLastCheckboxProps(props)
            return (
                <button
                    type="button"
                    data-testid="mock-checkbox"
                    aria-label={props.ariaLabel}
                    onClick={() => props.onValueChange?.(!props.isSelected)}
                >
                    toggle
                </button>
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
        onInputChange: vi.fn(),
        onBlur: vi.fn(),
        setFieldValue: mocks.setFieldValue,
        ...ctx,
    }

    return render(
        <FormContext.Provider value={value}>
            <FormCheckbox name="acceptTermsAndConditions" testId="accept" />
        </FormContext.Provider>,
    )
}

describe("FormCheckbox", () => {
    beforeEach(() => {
        mocks.setFieldValue.mockReset()
        mocks.setLastCheckboxProps(null)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when submitCount is 0 and there is an error", () => {
        it("should not mark checkbox as invalid", () => {
            renderWithFormContext({
                values: {acceptTermsAndConditions: false},
                errors: {acceptTermsAndConditions: "Requerido"},
                submitCount: 0,
            })

            const props = mocks.getLastCheckboxProps()
            expect(props.isInvalid).toBe(false)
        })
    })

    describe("when submitCount is greater than 0 and there is an error", () => {
        it("should mark checkbox as invalid", () => {
            renderWithFormContext({
                values: {acceptTermsAndConditions: false},
                errors: {acceptTermsAndConditions: "Requerido"},
                submitCount: 1,
            })

            const props = mocks.getLastCheckboxProps()
            expect(props.isInvalid).toBe(true)
        })
    })

    describe("when checkbox is toggled", () => {
        it("should call setFieldValue with the new selection", () => {
            renderWithFormContext({
                values: {acceptTermsAndConditions: false},
            })

            const props = mocks.getLastCheckboxProps()
            props.onValueChange(true)

            expect(mocks.setFieldValue).toHaveBeenCalledWith(
                "acceptTermsAndConditions",
                true,
            )
        })
    })

    describe("when ariaLabel prop is provided", () => {
        it("should pass ariaLabel to Checkbox", () => {
            const {container} = renderWithFormContext({
                values: {acceptTermsAndConditions: false},
            })

            const checkbox = container.querySelector('[data-testid="mock-checkbox"]') as HTMLElement
            expect(checkbox).toBeInTheDocument()
        })
    })
})

