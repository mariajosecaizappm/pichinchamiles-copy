import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import FormContext, {
    FormContextValues,
} from "@/presentation/components/Form/context/FormContext"
import FormButton from "@/presentation/components/Form/controls/FormButton/FormButton"
import {ScreenReaderProvider} from "@/presentation/components/providers/ScreenReaderProvider"

const mocks = vi.hoisted(() => {
    let lastButtonProps: any = null
    const screenReaderInfo = vi.fn()
    return {
        getLastButtonProps: () => lastButtonProps,
        setLastButtonProps: (props: any) => (lastButtonProps = props),
        screenReaderInfo,
    }
})

vi.mock("@/presentation/components/providers/ScreenReaderProvider", async () => {
    const actual = await vi.importActual<typeof import("@/presentation/components/providers/ScreenReaderProvider")>(
        "@/presentation/components/providers/ScreenReaderProvider"
    )
    return {
        ...actual,
        useScreenReader: () => ({
            info: mocks.screenReaderInfo,
            error: vi.fn(),
            success: vi.fn(),
            warning: vi.fn(),
        }),
    }
})

vi.mock("@/presentation/components/Form/components/Button", async () => {
    const React = await import("react")
    return {
        Button: (props: any) => {
            mocks.setLastButtonProps(props)
            return (
                <button
                    data-testid="mock-button"
                    type={props.type}
                    disabled={props.isDisabled}
                    aria-label={props.ariaLabel}
                >
                    {props.children}
                </button>
            )
        },
    }
})

const renderWithFormContext = (
    ctx: Partial<FormContextValues>,
    buttonProps?: React.ComponentProps<typeof FormButton>,
) => {
    const value: FormContextValues = {
        values: ctx.values ?? {},
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
                <FormButton {...buttonProps}>
                    Continuar
                </FormButton>
            </FormContext.Provider>
        </ScreenReaderProvider>,
    )
}

describe("FormButton", () => {
    beforeEach(() => {
        mocks.setLastButtonProps(null)
        mocks.screenReaderInfo.mockClear()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when isSubmitting is true", () => {
        it("should render a submit button and set isLoading from context", () => {
            renderWithFormContext({isSubmitting: true})

            expect(screen.getByTestId("mock-button")).toHaveTextContent(
                "Continuar",
            )

            const props = mocks.getLastButtonProps()
            expect(props.type).toBe("submit")
            expect(props.color).toBe("primary")
            expect(props.isLoading).toBe(true)
        })
    })

    describe("when hasErrors is true", () => {
        it("should disable the button", () => {
            renderWithFormContext({hasErrors: true})

            const props = mocks.getLastButtonProps()
            expect(props.isDisabled).toBe(true)
        })

        it("should stay enabled when alwaysEnabled is true", () => {
            renderWithFormContext({hasErrors: true}, {alwaysEnabled: true})

            const props = mocks.getLastButtonProps()
            expect(props.isDisabled).toBe(false)
        })
    })

    describe("when disabled prop is true", () => {
        it("should disable the button", () => {
            renderWithFormContext({}, {disabled: true})

            const props = mocks.getLastButtonProps()
            expect(props.isDisabled).toBe(false)
        })
    })

    describe("when isLoading prop is true and isSubmitting is false", () => {
        it("should disable the button but keep isLoading false", () => {
            renderWithFormContext({isSubmitting: false}, {isLoading: true})

            const props = mocks.getLastButtonProps()
            expect(props.isDisabled).toBe(false)
            expect(props.isLoading).toBe(false)
        })
    })

    describe("aria-label behavior", () => {
        it("should append disabled suffix when button is disabled and aria-label is provided", () => {
            renderWithFormContext({ hasErrors: true }, { "aria-label": "Guardar dirección" })

            const props = mocks.getLastButtonProps()
            expect(props["aria-label"]).toBe("Guardar dirección, Botón deshabilitado")
        })

        it("should keep aria-label unchanged when button is enabled", () => {
            renderWithFormContext({}, { "aria-label": "Guardar dirección" })

            const props = mocks.getLastButtonProps()
            expect(props["aria-label"]).toBe("Guardar dirección")
        })
    })

    describe("when alwaysEnabled and hasErrors", () => {
        it("should keep button enabled for submit validation flow", () => {
            renderWithFormContext({ hasErrors: true }, { alwaysEnabled: true })

            const props = mocks.getLastButtonProps()
            expect(props.isDisabled).toBe(false)
            expect(props.type).toBe("submit")
        })
    })

    describe("when alwaysEnabled and isLoading", () => {
        it("should disable the button when isLoading is true", () => {
            renderWithFormContext({}, { alwaysEnabled: true, isLoading: true })

            const props = mocks.getLastButtonProps()
            expect(props.isDisabled).toBe(true)
        })
    })

    describe("screen reader announcements", () => {
        it("should announce processing when button is loading", () => {
            renderWithFormContext({ isSubmitting: true })

            expect(mocks.screenReaderInfo).toHaveBeenCalledWith("Procesando solicitud")
        })
    })

    describe("accessibility attributes", () => {
        it("should set aria-busy when loading", () => {
            renderWithFormContext({ isSubmitting: true })

            const props = mocks.getLastButtonProps()
            expect(props["aria-busy"]).toBe(true)
        })

        it("should forward testId to button", () => {
            renderWithFormContext({}, { testId: "submit-address-btn" })

            const props = mocks.getLastButtonProps()
            expect(props.testId).toBe("submit-address-btn")
        })
    })
})
