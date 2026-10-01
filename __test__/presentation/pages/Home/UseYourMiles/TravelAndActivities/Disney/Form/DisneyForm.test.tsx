import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

const useUvSessionMocks = vi.hoisted(() => {
    const verifyUvSession = vi.fn()
    const execute = vi.fn()
    return { verifyUvSession, execute }
})

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/hooks/useUvSession", () => ({
    default: () => ({
        verifyUvSession: useUvSessionMocks.verifyUvSession,
    }),
}))

vi.mock("react", async () => {
    const actual = await vi.importActual("react")
    const mockStartTransition = vi.fn((callback) => callback())
    return {
        ...actual,
        useTransition: vi.fn(() => [false, mockStartTransition])
    }
})

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: vi.fn(() => ({ execute: useUvSessionMocks.execute })),
    },
}))

vi.mock("@/presentation/components/Form/context/Form", () => ({
    default: ({ children, initialValues, onSubmit, formErrorId, className }: {
        children: React.ReactNode
        initialValues: unknown
        onSubmit: (values: unknown) => void
        formErrorId: string
        className: string
    }) => (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(initialValues) }} className={className} data-testid="form">
            <div data-testid={formErrorId}></div>
            {children}
        </form>
    ),
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Disney/Form/components/DisneyFormFields", () => ({
    default: () => <div data-testid="disney-form-fields">DisneyFormFields</div>,
}))

import DisneyForm from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Disney/Form/DisneyForm"

describe("DisneyForm", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        useUvSessionMocks.verifyUvSession.mockReset()
        useUvSessionMocks.execute.mockReset()
    })

    it("should render form with DisneyFormFields", () => {
        render(<DisneyForm />)
        
        expect(screen.getByTestId("form")).toBeInTheDocument()
        expect(screen.getByTestId("disney-form-fields")).toBeInTheDocument()
        expect(screen.getByTestId("disneyFormError")).toBeInTheDocument()
    })

    it("should have correct form className", () => {
        render(<DisneyForm />)
        
        const form = screen.getByTestId("form")
        expect(form).toHaveClass("pt-3", "pb-6",)
    })

    it("should call verifyUvSession and use case with parsed values when form is submitted", async () => {
        useUvSessionMocks.execute.mockReturnValueOnce("https://example.com/disney")

        const { container } = render(<DisneyForm />)

        const form = container.querySelector('form')
        if (form) {
            form.dispatchEvent(new Event("submit", { bubbles: true }))
        }

        await new Promise((r) => setTimeout(r, 0))

        expect(useUvSessionMocks.verifyUvSession).toHaveBeenCalledTimes(1)
        expect(useUvSessionMocks.execute).toHaveBeenCalled()
    })
})
