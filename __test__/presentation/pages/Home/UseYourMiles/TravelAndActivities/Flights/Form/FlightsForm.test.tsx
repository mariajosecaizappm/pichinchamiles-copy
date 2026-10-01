import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import FlightsForm from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/FlightsForm"
import container from "@/presentation/config/inversify.config"
import { ScreenReaderProvider } from "@/presentation/components/providers/ScreenReaderProvider"

const mocks = vi.hoisted(() => {
    const verifyUvSession = vi.fn()
    const mockParseValuesToParams = vi.fn((values: any) => ({
        tripType: values.flightTravelType || "ROUND",
        trips: [
            {
                origin: values.oneWayTrip?.origin?.id || "",
                destination: values.oneWayTrip?.destination?.id || "",
                startDate: values.oneWayTrip?.startDate || new Date(),
                endDate: values.oneWayTrip?.endDate || new Date(),
            },
        ],
        adults: values.adults,
        childrens: values.childrens || 0,
        infants: values.infants || 0,
    }))
    const mockOnFlightsFormError = vi.fn(() => <></>)
    return { verifyUvSession, mockParseValuesToParams, mockOnFlightsFormError }
})

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/hooks/useUvSession", () => ({
    default: () => ({
        verifyUvSession: mocks.verifyUvSession,
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

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/FlightsFormConfig", () => ({
    flightsInitialValues: {
        flightTravelType: "ROUND",
        oneWayTrip: {
            id: "mock-trip-id",
            origin: null,
            destination: null,
            startDate: null,
            endDate: null,
        },
        multidestinationTrips: [
            {
                id: "mock-multi-id",
                origin: null,
                destination: null,
                startDate: null,
            },
        ],
        showAdvancedOptions: false,
        passengersInfo: "1 Pasajero",
        adults: 1,
        childrens: 0,
        infants: 0,
        stops: "ALL_STOPS",
        class: "ANY",
        airline: "all",
    },
    flightsSchema: {},
    parseValuesToParams: mocks.mockParseValuesToParams,
    onFlightsFormError: mocks.mockOnFlightsFormError,
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/Form/components/FlightsFormFields", () => ({
    default: vi.fn(() => <div data-testid="flights-form-fields">Flights Form</div>)
}))

const mockOpen = vi.fn()
Object.defineProperty(globalThis, 'open', {
    writable: true,
    value: mockOpen
})

describe("FlightsForm", () => {
    let mockGetFlightsSearchUrlUseCase: { execute: ReturnType<typeof vi.fn> }

    beforeEach(() => {
        vi.clearAllMocks()

        mockGetFlightsSearchUrlUseCase = {
            execute: vi.fn().mockReturnValue("mock-url")
        }

        vi.mocked(container.get).mockReturnValue(mockGetFlightsSearchUrlUseCase)
    })

    it("should render the form with correct props", () => {
        render(
            <ScreenReaderProvider>
                <FlightsForm />
            </ScreenReaderProvider>
        )

        const form = screen.getByTestId("form")
        expect(form).toBeInTheDocument()
        expect(form).toHaveClass("pb-6 pt-3")
        expect(screen.getByTestId("flights-form-fields")).toBeInTheDocument()
    })

    it("should call verifyUvSession before navigating on submit", async () => {
        const mockUrl = "https://example.com/flights/UIO/MIA/2024-06-15/2024-06-20/1"
        mockGetFlightsSearchUrlUseCase.execute.mockReturnValue(mockUrl)

        render(
            <ScreenReaderProvider>
                <FlightsForm />
            </ScreenReaderProvider>
        )

        const submitButton = screen.getByText("Submit")
        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mocks.verifyUvSession).toHaveBeenCalledTimes(1)
            expect(mockGetFlightsSearchUrlUseCase.execute).toHaveBeenCalled()
            expect(mockOpen).toHaveBeenCalledWith(mockUrl, '_self')
        })
    })

    it("should call GetFlightsSearchUrlUseCase with parsed params on submit", async () => {
        render(
            <ScreenReaderProvider>
                <FlightsForm />
            </ScreenReaderProvider>
        )

        fireEvent.click(screen.getByText("Submit"))

        await waitFor(() => {
            expect(mocks.verifyUvSession).toHaveBeenCalledTimes(1)
            expect(mockGetFlightsSearchUrlUseCase.execute).toHaveBeenCalledWith(
                expect.objectContaining({
                    tripType: "ROUND",
                    trips: expect.arrayContaining([
                        expect.objectContaining({
                            origin: "",
                            destination: "",
                        }),
                    ]),
                    adults: 1,
                    childrens: 0,
                    infants: 0,
                })
            )
        })
    })

    it("should open URL in same window on submit", async () => {
        mockGetFlightsSearchUrlUseCase.execute.mockReturnValue("https://example.com/flights")

        render(
            <ScreenReaderProvider>
                <FlightsForm />
            </ScreenReaderProvider>
        )

        fireEvent.click(screen.getByText("Submit"))

        await waitFor(() => {
            expect(mockOpen).toHaveBeenCalledWith("https://example.com/flights", '_self')
        })
    })

    it("should render FlightsFormFields component", () => {
        render(
            <ScreenReaderProvider>
                <FlightsForm />
            </ScreenReaderProvider>
        )

        expect(screen.getByTestId("flights-form-fields")).toBeInTheDocument()
        expect(screen.getByTestId("flights-form-fields")).toHaveTextContent("Flights Form")
    })

    it("should have correct form structure and className", () => {
        render(
            <ScreenReaderProvider>
                <FlightsForm />
            </ScreenReaderProvider>
        )

        const form = screen.getByTestId("form")
        expect(form).toBeInTheDocument()
        expect(form).toHaveClass("pt-3 pb-6")
        expect(screen.getByTestId("flights-form-fields")).toBeInTheDocument()
    })

    it("should resolve GetFlightsSearchUrlUseCase from container", () => {
        render(
            <ScreenReaderProvider>
                <FlightsForm />
            </ScreenReaderProvider>
        )

        expect(container.get).toHaveBeenCalled()
    })
})
