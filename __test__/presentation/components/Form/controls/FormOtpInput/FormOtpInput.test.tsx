import React from "react"
import {render, screen, fireEvent} from "@testing-library/react"
import {afterEach, describe, expect, it, vi} from "vitest"
import FormContext, {
    FormContextValues,
} from "@/presentation/components/Form/context/FormContext"
import FormOtpInput from "@/presentation/components/Form/controls/FormOtpInput/FormOtpInput"
import {ScreenReaderProvider} from "@/presentation/components/providers/ScreenReaderProvider"

const mocks = vi.hoisted(() => {
    let lastOtpInputProps: any = null
    return {
        getLastOtpInputProps: () => lastOtpInputProps,
        setLastOtpInputProps: (p: any) => (lastOtpInputProps = p),
        reset: () => {
            lastOtpInputProps = null
        },
    }
})

vi.mock("@/presentation/components/Form/components/OtpInput/OtpInputContainer", async () => {
    const React = await import("react")
    return {
        default: (props: any) => {
            mocks.setLastOtpInputProps(props)
            return (
                <div data-testid="mock-otp-input">
                    <button
                        type="button"
                        data-testid="trigger-change"
                        onClick={() => props.onValueChange?.("123456")}
                    >
                        change
                    </button>
                </div>
            )
        },
    }
})

const renderWithFormContext = (ctx: Partial<FormContextValues>) => {
    const value: FormContextValues = {
        values: ctx.values ?? {code: ""},
        errors: ctx.errors ?? {},
        touched: ctx.touched ?? {},
        disabled: ctx.disabled ?? false,
        isSubmitting: ctx.isSubmitting ?? false,
        submitCount: ctx.submitCount ?? 0,
        hasErrors: ctx.hasErrors ?? false,
        alert: ctx.alert ?? null,
        onInputChange: ctx.onInputChange ?? vi.fn(),
        setFieldValue: ctx.setFieldValue ?? vi.fn(),
        onBlur: ctx.onBlur ?? vi.fn(),
    }

    return render(
        <ScreenReaderProvider>
            <FormContext.Provider value={value}>
                <FormOtpInput name="code" testId="otpCode" length={6} />
            </FormContext.Provider>
        </ScreenReaderProvider>,
    )
}

describe("FormOtpInput", () => {
    afterEach(() => {
        vi.clearAllMocks()
        mocks.reset()
    })

    describe("when isSubmitting is true", () => {
        it("should disable the otp input", () => {
            renderWithFormContext({isSubmitting: true})

            const props = mocks.getLastOtpInputProps()
            expect(props.disabled).toBe(true)
            expect(props.testId).toBe("otpCode")
        })
    })

    describe("when the otp value changes", () => {
        it("should map it to a change event and call onInputChange", () => {
            const onInputChange = vi.fn()
            renderWithFormContext({onInputChange})

            fireEvent.click(screen.getByTestId("trigger-change"))

            expect(onInputChange).toHaveBeenCalledTimes(1)
            const eventLike = onInputChange.mock.calls[0][0] as any
            expect(eventLike.target.name).toBe("code")
            expect(eventLike.target.value).toBe("123456")
        })

        it("should call external onValueChange callback when provided", () => {
            const externalOnValueChange = vi.fn()
            render(
                <ScreenReaderProvider>
                    <FormContext.Provider value={{
                        values: {code: ""},
                        errors: {},
                        touched: {},
                        disabled: false,
                        isSubmitting: false,
                        submitCount: 0,
                        hasErrors: false,
                        alert: null,
                        onInputChange: vi.fn(),
                        setFieldValue: vi.fn(),
                        onBlur: vi.fn(),
                    }}>
                        <FormOtpInput name="code" testId="otpCode" length={6} onValueChange={externalOnValueChange} />
                    </FormContext.Provider>
                </ScreenReaderProvider>
            )

            const props = mocks.getLastOtpInputProps()
            props.onValueChange("123456")

            expect(externalOnValueChange).toHaveBeenCalledWith("123456")
        })
    })

    describe("when there are validation errors", () => {
        it("should show error when has value and submit count > 0", () => {
            renderWithFormContext({
                values: {code: "123"},
                errors: {code: "Invalid code"},
                submitCount: 1
            })

            const props = mocks.getLastOtpInputProps()
            expect(props.isInvalid).toBe(true)
            expect(props.errorId).toBe("code-error")
        })

        it("should not show error when no value and no submit count", () => {
            renderWithFormContext({
                values: {code: ""},
                errors: {code: "Invalid code"},
                submitCount: 0
            })

            const props = mocks.getLastOtpInputProps()
            // hasValue is false, submitCount is 0, so showError should be false
            expect(props.isInvalid).toBe(false)
        })

        it("should not show error when no error present", () => {
            renderWithFormContext({
                values: {code: "123"},
                errors: {},
                submitCount: 1
            })

            const props = mocks.getLastOtpInputProps()
            // error is undefined, so showError should be false
            expect(props.isInvalid).toBe(false)
        })
    })
})
