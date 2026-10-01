import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi, afterEach} from "vitest"
import FormContext, {
    FormContextValues,
} from "@/presentation/components/Form/context/FormContext"
import PasswordComparator, {Rule} from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/PasswordComparator/PasswordComparator"

const mockRules: Rule[] = [
    { label: "Al menos 8 caracteres", test: (pwd: string) => pwd.length >= 8, announcement: "" },
    { label: "Una letra mayúscula", test: (pwd: string) => /[A-Z]/.test(pwd), announcement: "" },
    { label: "Un número", test: (pwd: string) => /\d/.test(pwd), announcement: "" },
    { label: "Un carácter especial", test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), announcement: "" },
]

const renderWithContext = (
    password: string,
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
            <PasswordComparator rules={mockRules} />
        </FormContext.Provider>,
    )
}

describe("PasswordComparator", () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when password is empty", () => {
        it("should report as not invalid", () => {
            renderWithContext("")

            expect(screen.getByText("Al menos 8 caracteres")).toBeInTheDocument()
            expect(screen.getByText("Una letra mayúscula")).toBeInTheDocument()
            expect(screen.getByText("Un número")).toBeInTheDocument()
            expect(screen.getByText("Un carácter especial")).toBeInTheDocument()
        })
    })

    describe("when password has content but fails any rule", () => {
        it("should report as invalid", () => {
            renderWithContext("abc")

            expect(screen.getByText("Al menos 8 caracteres")).toBeInTheDocument()
            expect(screen.getByText("Una letra mayúscula")).toBeInTheDocument()
            expect(screen.getByText("Un número")).toBeInTheDocument()
            expect(screen.getByText("Un carácter especial")).toBeInTheDocument()
        })
    })

    describe("when password satisfies all rules", () => {
        it("should report as not invalid", () => {
            renderWithContext("Abcdef1!")

            expect(screen.getByText("Al menos 8 caracteres")).toBeInTheDocument()
            expect(screen.getByText("Una letra mayúscula")).toBeInTheDocument()
            expect(screen.getByText("Un número")).toBeInTheDocument()
            expect(screen.getByText("Un carácter especial")).toBeInTheDocument()
        })
    })
})

