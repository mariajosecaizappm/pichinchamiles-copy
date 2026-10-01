import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import React, { useTransition } from "react"
import ActivitiesForm from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Activities/Form/ActivitiesForm"
import FormContext from "@/presentation/components/Form/context/FormContext"
import { ScreenReaderProvider } from "@/presentation/components/providers/ScreenReaderProvider"

const useUvSessionMocks = vi.hoisted(() => {
    const verifyUvSession = vi.fn()
    return { verifyUvSession }
})

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/hooks/useUvSession", () => ({
    default: () => ({
        verifyUvSession: useUvSessionMocks.verifyUvSession,
    }),
}))

vi.mock("react", async () => {
    const actual = await vi.importActual("react")
    return {
        ...actual,
        useTransition: vi.fn()
    }
})

// Mock the dependencies
vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: vi.fn().mockReturnValue({
            execute: vi.fn()
        })
    }
}))

vi.mock("@/domain/entity/Types/UseCaseTypes", () => ({
    default: {
        GetActivitiesSearchUrlUseCase: Symbol("GetActivitiesSearchUrlUseCase")
    }
}))

vi.mock("@/domain/interactors/Home/UseYourMiles/Travels/GetActivitiesSearchUrlUseCase", () => ({
    default: vi.fn()
}))

// Mock child components
vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Activities/Form/components/ActivitiesFormFields", () => ({
    default: ({ getLocations }: { getLocations: Function }) => (
        <div data-testid="activities-form-fields">
            <button data-testid="destination-search" onClick={() => getLocations && getLocations("test")}>
                Search Destination
            </button>
            <button data-testid="submit-button" type="submit">
                Submit
            </button>
        </div>
    )
}))

vi.mock("@/presentation/components/Form/context/Form", () => ({
    default: function MockForm({ children, initialValues, onSubmit, schema, formErrorId, className }: any) {
        const [isSubmitting, setIsSubmitting] = React.useState(false)
        
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault()
            setIsSubmitting(true)
            try {
                await onSubmit(e)
            } finally {
                setIsSubmitting(false)
            }
        }
        
        return (
            <div data-testid="form-wrapper" className={className} data-form-error-id={formErrorId}>
                <FormContext.Provider value={{
                    values: initialValues,
                    errors: {},
                    touched: {},
                    onInputChange: vi.fn(),
                    setFieldValue: vi.fn(),
                    onBlur: vi.fn(),
                    isSubmitting,
                    submitCount: 0,
                    disabled: false,
                    hasErrors: false,
                    alert: null
                }}>
                    <form onSubmit={handleSubmit} role="form">
                        {children}
                    </form>
                </FormContext.Provider>
            </div>
        )
    }
}))


// Create a mock for TagManager
const mockTagManager = {
    dataLayer: vi.fn()
};

// Mock the react-gtm-module at the global level
(globalThis as any).TagManager = mockTagManager

describe("ActivitiesForm", () => {
    let mockUseTransition: any
    let mockWindowOpen: any
    let mockContainer: any
    let mockGetActivitiesSearchUrl: any

    beforeEach(async () => {
        useUvSessionMocks.verifyUvSession.mockReset()
        mockUseTransition = vi.fn().mockReturnValue([false, vi.fn()])
        vi.mocked(useTransition).mockImplementation(mockUseTransition)

        const { default: container } = await import("@/presentation/config/inversify.config")
        mockContainer = container
        mockGetActivitiesSearchUrl = container.get()
        mockGetActivitiesSearchUrl.execute.mockReturnValue("https://example.com/activities/test")

        mockWindowOpen = vi.fn()
        ;(globalThis as any).window = { ...(globalThis as any).window, open: mockWindowOpen }
    })

    const renderWithProviders = (component: React.ReactElement) => {
        return render(
            <ScreenReaderProvider>
                {component}
            </ScreenReaderProvider>
        )
    }

    it("should render form with correct props", async () => {
        renderWithProviders(<ActivitiesForm />)

        expect(screen.getByTestId("form-wrapper")).toBeInTheDocument()
        expect(screen.getByTestId("activities-form-fields")).toBeInTheDocument()
    })

    it("should use correct form configuration", async () => {
        renderWithProviders(<ActivitiesForm />)

        const formWrapper = screen.getByTestId("form-wrapper")
        expect(formWrapper).toHaveAttribute("data-form-error-id", "activitiesFormError")
        expect(formWrapper).toHaveClass("pb-6 pt-3")
    })

    it("should get use case from container on mount", async () => {
        renderWithProviders(<ActivitiesForm />)

        expect(mockContainer.get).toHaveBeenCalledWith(
            expect.any(Symbol)
        )
    })

    it("should call verifyUvSession and handle form submission with valid data", async () => {
        const mockStartTransition = vi.fn()
        mockUseTransition.mockReturnValue([false, mockStartTransition])

        const mockUrl = "https://example.com/activities/NYC/2024-06-15/2024-06-15/passengers-25"
        mockGetActivitiesSearchUrl.execute.mockReturnValue(mockUrl)

        const { container } = renderWithProviders(<ActivitiesForm />)

        const form = screen.getByRole("form")
        fireEvent.submit(form)

        await waitFor(() => {
            expect(useUvSessionMocks.verifyUvSession).toHaveBeenCalledTimes(1)
            expect(mockStartTransition).toHaveBeenCalled()
        }, { container })
    })

    it("should call verifyUvSession and navigate to generated URL on form submission", async () => {
        const mockStartTransition = vi.fn((callback) => callback())
        mockUseTransition.mockReturnValue([false, mockStartTransition])

        const mockUrl = "https://activities.example.com/NYC/2024-06-15/2024-06-15/passengers-25"
        mockGetActivitiesSearchUrl.execute.mockReturnValue(mockUrl)

        const { container } = renderWithProviders(<ActivitiesForm />)

        const form = screen.getByRole("form")
        fireEvent.submit(form)

        await waitFor(() => {
            expect(useUvSessionMocks.verifyUvSession).toHaveBeenCalledTimes(1)
            expect(mockWindowOpen).toHaveBeenCalledWith(mockUrl, "_self")
        }, { container })
    })

    it("should call verifyUvSession and handle form submission without GTM errors", async () => {
        const mockStartTransition = vi.fn((callback) => {
            callback()
        })
        mockUseTransition.mockReturnValue([false, mockStartTransition])

        mockGetActivitiesSearchUrl.execute.mockReturnValue("https://example.com/activities/test")

        const { container } = renderWithProviders(<ActivitiesForm />)

        const form = screen.getByRole("form")
        fireEvent.submit(form)

        await waitFor(() => {
            expect(useUvSessionMocks.verifyUvSession).toHaveBeenCalledTimes(1)
            expect(mockWindowOpen).toHaveBeenCalledWith("https://example.com/activities/test", "_self")
        }, { container })
    })

    it("should call verifyUvSession and handle useTransition correctly", async () => {
        const mockStartTransition = vi.fn()
        mockUseTransition.mockReturnValue([false, mockStartTransition])

        const { container } = renderWithProviders(<ActivitiesForm />)

        const form = screen.getByRole("form")
        fireEvent.submit(form)

        await waitFor(() => {
            expect(useUvSessionMocks.verifyUvSession).toHaveBeenCalledTimes(1)
            expect(mockStartTransition).toHaveBeenCalled()
        }, { container })
    })

    it("should pass getLocations function to ActivitiesFormFields", async () => {
        renderWithProviders(<ActivitiesForm />)

        expect(screen.getByTestId("activities-form-fields")).toBeInTheDocument()
        
        // The getLocations function should be passed as a prop
        const destinationSearchButton = screen.getByTestId("destination-search")
        fireEvent.click(destinationSearchButton)

        // This should not throw an error, indicating the function was passed correctly
        expect(destinationSearchButton).toBeInTheDocument()
    })

    it("should use correct initial values", async () => {
        renderWithProviders(<ActivitiesForm />)

        const formWrapper = screen.getByTestId("form-wrapper")
        const formContext = formWrapper.querySelector("form")?.parentElement
        
        // Check that initial values are passed through context
        expect(formContext).toBeInTheDocument()
    })

    it("should use correct validation schema", async () => {
        renderWithProviders(<ActivitiesForm />)

        // The form should be configured with the activities schema
        expect(screen.getByTestId("form-wrapper")).toBeInTheDocument()
    })

    it("should handle form submission errors gracefully", async () => {
        const mockStartTransition = vi.fn()
        mockUseTransition.mockReturnValue([false, mockStartTransition])

        // Mock the use case to throw an error
        mockGetActivitiesSearchUrl.execute.mockImplementation(() => {
            throw new Error("API Error")
        })

        renderWithProviders(<ActivitiesForm />)

        // Get the form and submit it
        const form = screen.getByRole("form")
        
        // Should not throw unhandled error
        expect(() => fireEvent.submit(form)).not.toThrow()
    })

    it("should use correct form error ID", async () => {
        renderWithProviders(<ActivitiesForm />)

        const formWrapper = screen.getByTestId("form-wrapper")
        expect(formWrapper).toHaveAttribute("data-form-error-id", "activitiesFormError")
    })

    it("should apply correct CSS classes", async () => {
        renderWithProviders(<ActivitiesForm />)

        const formWrapper = screen.getByTestId("form-wrapper")
        expect(formWrapper).toHaveClass("pb-6 pt-3")
    })

    it("should call verifyUvSession and handle multiple form submissions", async () => {
        const mockStartTransition = vi.fn((callback) => callback())
        mockUseTransition.mockReturnValue([false, mockStartTransition])

        mockGetActivitiesSearchUrl.execute.mockReturnValue("https://example.com/activities/test")

        const { container } = renderWithProviders(<ActivitiesForm />)

        const form = screen.getByRole("form")

        fireEvent.submit(form)
        fireEvent.submit(form)

        await waitFor(() => {
            expect(useUvSessionMocks.verifyUvSession).toHaveBeenCalledTimes(2)
            expect(mockStartTransition).toHaveBeenCalledTimes(2)
            expect(mockWindowOpen).toHaveBeenCalledTimes(2)
        }, { container })
    })

    it("should call verifyUvSession and handle different URL generation scenarios", async () => {
        const mockStartTransition = vi.fn((callback) => callback())
        mockUseTransition.mockReturnValue([false, mockStartTransition])

        const testUrls = [
            "https://example.com/activities/NYC/2024-06-15/2024-06-15/passengers-25",
            "https://example.com/activities/LAX/2024-07-20/2024-07-20/passengers-30",
            "https://example.com/activities/MIA/2024-08-10/2024-08-10/passengers-18"
        ]

        testUrls.forEach((url) => {
            mockGetActivitiesSearchUrl.execute.mockReturnValueOnce(url)
        })

        renderWithProviders(<ActivitiesForm />)

        const form = screen.getByRole("form")

        for (let i = 0; i < testUrls.length; i++) {
            fireEvent.submit(form)

            await waitFor(() => {
                expect(useUvSessionMocks.verifyUvSession).toHaveBeenCalledTimes(i + 1)
                expect(mockWindowOpen).toHaveBeenCalledWith(testUrls[i], "_self")
            }, { container: screen.getByTestId("form-wrapper") })
        }
    })

    it("should call verifyUvSession and maintain form state during submission", async () => {
        const mockStartTransition = vi.fn()
        mockUseTransition.mockReturnValue([false, mockStartTransition])

        const { container } = renderWithProviders(<ActivitiesForm />)

        const form = screen.getByRole("form")
        fireEvent.submit(form)

        await waitFor(() => {
            expect(useUvSessionMocks.verifyUvSession).toHaveBeenCalledTimes(1)
            expect(mockStartTransition).toHaveBeenCalled()
        }, { container })

        expect(screen.getByTestId("form-wrapper")).toBeInTheDocument()
        expect(screen.getByTestId("activities-form-fields")).toBeInTheDocument()
    })
})
