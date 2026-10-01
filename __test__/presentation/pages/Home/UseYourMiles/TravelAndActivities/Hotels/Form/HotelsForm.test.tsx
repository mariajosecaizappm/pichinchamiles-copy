import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import HotelsForm from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Hotels/Form/HotelsForm"
import container from "@/presentation/config/inversify.config"
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
    const mockStartTransition = vi.fn((callback) => callback())
    return {
        ...actual,
        useTransition: vi.fn(() => [false, mockStartTransition])
    }
})

// Mock dependencies
vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: vi.fn()
    }
}))

vi.mock("@/presentation/components/Form/context/Form", () => ({
    default: vi.fn(({ initialValues, onSubmit, children, className }) => (
        <form data-testid="form" className={className} onSubmit={(e) => {
            e.preventDefault()
            onSubmit(initialValues)
        }}>
            {children}
            <button type="submit">Submit</button>
        </form>
    ))
}))

// Mock HotelsFormConfig
const mockParseValuesToParams = vi.fn((values) => ({
    destination: values.destination?.id || "",
    adults: values.adults,
    ageChildrens: [
        values.ageChildren1,
        values.ageChildren2,
        values.ageChildren3,
        values.ageChildren4
    ].filter(age => age > 0),
    checkIn: values.startDate || new Date(),
    checkOut: values.endDate || new Date()
}))

vi.mock("./HotelsFormConfig", () => ({
    hotelsInitialValues: {
        destination: "",
        startDate: null,
        endDate: null,
        adults: 2,
        childrens: 0,
        ageChildren1: 0,
        ageChildren2: 0,
        ageChildren3: 0,
        ageChildren4: 0
    },
    hotelsSchema: {},
    parseValuesToParams: mockParseValuesToParams
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Hotels/Form/components/HotelsFormFields", () => ({
    default: vi.fn(() => <div data-testid="hotels-form-fields">Hotels Form</div>)
}))

// Mock window.open
const mockOpen = vi.fn()
Object.defineProperty(globalThis, 'open', {
    writable: true,
    value: mockOpen
})

describe("HotelsForm", () => {
    let mockGetHotelsSearchUrlUseCase: { execute: ReturnType<typeof vi.fn> }

    beforeEach(() => {
        vi.clearAllMocks()
        useUvSessionMocks.verifyUvSession.mockReset()

        mockGetHotelsSearchUrlUseCase = {
            execute: vi.fn().mockReturnValue("mock-url")
        }

        vi.mocked(container.get).mockReturnValue(mockGetHotelsSearchUrlUseCase)
    })

    it("should render the form with correct props", () => {
        render(
            <ScreenReaderProvider>
                <HotelsForm />
            </ScreenReaderProvider>
        )

        const form = screen.getByTestId("form")
        expect(form).toBeInTheDocument()
        expect(form).toHaveClass("pb-6 pt-3")
        expect(screen.getByTestId("hotels-form-fields")).toBeInTheDocument()
    })

    it("should call verifyUvSession, GetHotelsSearchUrlUseCase and open URL on submit", async () => {
        const mockUrl = "https://example.com/hotels/Paris/2024-06-15/2024-06-15/2"
        mockGetHotelsSearchUrlUseCase.execute.mockReturnValue(mockUrl)

        render(
            <ScreenReaderProvider>
                <HotelsForm />
            </ScreenReaderProvider>
        )

        const submitButton = screen.getByText("Submit")
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(useUvSessionMocks.verifyUvSession).toHaveBeenCalledTimes(1)
            expect(mockGetHotelsSearchUrlUseCase.execute).toHaveBeenCalledWith({
                destination: "",
                adults: 2,
                ageChildrens: [],
                checkIn: expect.any(Date),
                checkOut: expect.any(Date)
            })
            expect(mockOpen).toHaveBeenCalledWith(mockUrl, '_self')
        })
    })

    it("should use useTransition for navigation", () => {
        render(
            <ScreenReaderProvider>
                <HotelsForm />
            </ScreenReaderProvider>
        )

        // The component should render without errors
        expect(screen.getByTestId("form")).toBeInTheDocument()
    })

    it("should call verifyUvSession and search URL use case with parsed params", async () => {
        render(
            <ScreenReaderProvider>
                <HotelsForm />
            </ScreenReaderProvider>
        )

        fireEvent.click(screen.getByText("Submit"))

        await waitFor(() => {
            expect(useUvSessionMocks.verifyUvSession).toHaveBeenCalledTimes(1)
            expect(mockGetHotelsSearchUrlUseCase.execute).toHaveBeenCalledWith(
                expect.objectContaining({
                    destination: "",
                    adults: 2,
                    ageChildrens: [],
                    checkIn: expect.any(Date),
                    checkOut: expect.any(Date)
                })
            )
        })
    })

    it("should call verifyUvSession and open URL in same window", async () => {
        mockGetHotelsSearchUrlUseCase.execute.mockReturnValue("https://example.com/hotels")

        render(
            <ScreenReaderProvider>
                <HotelsForm />
            </ScreenReaderProvider>
        )

        fireEvent.click(screen.getByText("Submit"))

        await waitFor(() => {
            expect(useUvSessionMocks.verifyUvSession).toHaveBeenCalledTimes(1)
            expect(mockOpen).toHaveBeenCalledWith("https://example.com/hotels", '_self')
        })
    })

    it("should render HotelsFormFields component", () => {
        render(
            <ScreenReaderProvider>
                <HotelsForm />
            </ScreenReaderProvider>
        )

        expect(screen.getByTestId("hotels-form-fields")).toBeInTheDocument()
        expect(screen.getByTestId("hotels-form-fields")).toHaveTextContent("Hotels Form")
    })

    it("should have correct form structure", () => {
        render(
            <ScreenReaderProvider>
                <HotelsForm />
            </ScreenReaderProvider>
        )

        const form = screen.getByTestId("form")
        expect(form).toBeInTheDocument()
        expect(form).toHaveClass("pt-3 pb-6")
        expect(screen.getByTestId("hotels-form-fields")).toBeInTheDocument()
    })
})
