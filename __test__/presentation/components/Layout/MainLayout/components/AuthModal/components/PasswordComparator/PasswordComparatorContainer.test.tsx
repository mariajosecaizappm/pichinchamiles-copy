import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, afterEach} from "vitest"
import FormContext, {
    FormContextValues,
} from "@/presentation/components/Form/context/FormContext"
import PasswordComparatorContainer from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/PasswordComparator/PasswordComparatorContainer"

vi.mock("@/presentation/components/providers/ScreenReaderProvider", () => ({
    ScreenReaderContext: { current: null },
    useScreenReader: () => ({
        info: vi.fn()
    }),
}))

const renderWithContext = (
    password: string,
    onChange?: (isInvalid: boolean) => void,
) => {
    const value: FormContextValues = {
        values: {password},
        errors: {},
        touched: {},
        disabled: false,
        isSubmitting: false,
        submitCount: 0,
        hasErrors: false,
        alert: null,
        onInputChange: vi.fn(),
        onBlur: vi.fn(),
        setFieldValue: vi.fn(),
    }

    return render(
        <FormContext.Provider value={value}>
            <PasswordComparatorContainer name="password" onChange={onChange} />
        </FormContext.Provider>,
    )
}

describe("PasswordComparatorContainer", () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when password is empty", () => {
        it("should show all password requirements", () => {
            renderWithContext("")

            expect(screen.getByText("Tiene entre 8 a 16 caracteres")).toBeInTheDocument()
            expect(screen.getByText("Incluye al menos 1 letra mayúscula y minúscula")).toBeInTheDocument()
            expect(screen.getByText("Incluye al menos un carácter numérico")).toBeInTheDocument()
            expect(screen.getByText("Debe contener al menos un caracter especial")).toBeInTheDocument()
        })

        it("should not call onChange callback", () => {
            const onChange = vi.fn()
            renderWithContext("", onChange)

            expect(onChange).not.toHaveBeenCalled()
        })
    })

    describe("when password has content but fails some rules", () => {
        it("should call onChange with true for invalid password", () => {
            const onChange = vi.fn()
            renderWithContext("abc", onChange)

            expect(onChange).toHaveBeenCalledWith(true)
        })

        it("should show all password requirements", () => {
            renderWithContext("abc")

            expect(screen.getByText("Tiene entre 8 a 16 caracteres")).toBeInTheDocument()
            expect(screen.getByText("Incluye al menos 1 letra mayúscula y minúscula")).toBeInTheDocument()
            expect(screen.getByText("Incluye al menos un carácter numérico")).toBeInTheDocument()
            expect(screen.getByText("Debe contener al menos un caracter especial")).toBeInTheDocument()
        })
    })

    describe("when password satisfies all rules", () => {
        it("should call onChange with false for valid password", () => {
            const onChange = vi.fn()
            renderWithContext("Abcdef1!", onChange)

            expect(onChange).toHaveBeenCalledWith(false)
        })

        it("should show all password requirements", () => {
            renderWithContext("Abcdef1!")

            expect(screen.getByText("Tiene entre 8 a 16 caracteres")).toBeInTheDocument()
            expect(screen.getByText("Incluye al menos 1 letra mayúscula y minúscula")).toBeInTheDocument()
            expect(screen.getByText("Incluye al menos un carácter numérico")).toBeInTheDocument()
            expect(screen.getByText("Debe contener al menos un caracter especial")).toBeInTheDocument()
        })
    })

    describe("when password is too long", () => {
        it("should call onChange with true for invalid password", () => {
            const onChange = vi.fn()
            renderWithContext("Abcdef1!Abcdef1!Abcdef1!", onChange)

            expect(onChange).toHaveBeenCalledWith(true)
        })
    })

    describe("when password meets length but fails other rules", () => {
        it("should call onChange with true for invalid password", () => {
            const onChange = vi.fn()
            renderWithContext("abcdefgh", onChange)

            expect(onChange).toHaveBeenCalledWith(true)
        })
    })

    describe("when password has uppercase but no lowercase", () => {
        it("should call onChange with true for invalid password", () => {
            const onChange = vi.fn()
            renderWithContext("ABCDEFG1!", onChange)

            expect(onChange).toHaveBeenCalledWith(true)
        })
    })

    describe("when password has lowercase but no uppercase", () => {
        it("should call onChange with true for invalid password", () => {
            const onChange = vi.fn()
            renderWithContext("abcdef1!", onChange)

            expect(onChange).toHaveBeenCalledWith(true)
        })
    })

    describe("when password has letters and numbers but no special character", () => {
        it("should call onChange with true for invalid password", () => {
            const onChange = vi.fn()
            renderWithContext("Abcdef12", onChange)

            expect(onChange).toHaveBeenCalledWith(true)
        })
    })

    describe("when password has letters and special but no numbers", () => {
        it("should call onChange with true for invalid password", () => {
            const onChange = vi.fn()
            renderWithContext("Abcdefg!", onChange)

            expect(onChange).toHaveBeenCalledWith(true)
        })
    })

    describe("when password is exactly 8 characters and valid", () => {
        it("should call onChange with false for valid password", () => {
            const onChange = vi.fn()
            renderWithContext("Abcdef1!", onChange)

            expect(onChange).toHaveBeenCalledWith(false)
        })
    })

    describe("when password is exactly 16 characters and valid", () => {
        it("should call onChange with false for valid password", () => {
            const onChange = vi.fn()
            renderWithContext("Abcdef1!Abcdef1!", onChange)

            expect(onChange).toHaveBeenCalledWith(false)
        })
    })

    describe("when onChange is not provided", () => {
        it("should not throw error", () => {
            expect(() => {
                renderWithContext("Abcdef1!")
            }).not.toThrow()
        })
    })

    describe("when password value changes", () => {
        it("should call onChange multiple times", () => {
            const onChange = vi.fn()
            const { rerender } = renderWithContext("", onChange)
            
            rerender(
                <FormContext.Provider value={{
                    values: {password: "a"},
                    errors: {},
                    touched: {},
                    disabled: false,
                    isSubmitting: false,
                    submitCount: 0,
                    hasErrors: false,
                    alert: null,
                    onInputChange: vi.fn(),
                    onBlur: vi.fn(),
                    setFieldValue: vi.fn(),
                }}>
                    <PasswordComparatorContainer name="password" onChange={onChange} />
                </FormContext.Provider>
            )

            rerender(
                <FormContext.Provider value={{
                    values: {password: "Abcdef1!"},
                    errors: {},
                    touched: {},
                    disabled: false,
                    isSubmitting: false,
                    submitCount: 0,
                    hasErrors: false,
                    alert: null,
                    onInputChange: vi.fn(),
                    onBlur: vi.fn(),
                    setFieldValue: vi.fn(),
                }}>
                    <PasswordComparatorContainer name="password" onChange={onChange} />
                </FormContext.Provider>
            )

            expect(onChange).toHaveBeenCalledTimes(2)
            expect(onChange).toHaveBeenNthCalledWith(1, true)
            expect(onChange).toHaveBeenNthCalledWith(2, false)
        })
    })
})
