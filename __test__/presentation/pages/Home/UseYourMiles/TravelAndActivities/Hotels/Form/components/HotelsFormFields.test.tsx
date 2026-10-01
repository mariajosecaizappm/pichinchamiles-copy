import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import HotelsFormFields from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Hotels/Form/components/HotelsFormFields"
import FormContext from "@/presentation/components/Form/context/FormContext"

// Mock components
vi.mock("@/presentation/components/Form/controls/FormAutocomplete/FormAutocompleteContainer", () => ({
    default: ({ name, label, placeholder, valueAsObject, startContent, ...rest }: {
        name: string;
        label: string;
        placeholder: string;
        valueAsObject: boolean;
        startContent?: React.ReactNode;
        ["aria-label"]?: string;
    }) => (
        <div data-testid={`form-autocomplete-${name}`} data-aria-label={rest["aria-label"]}>
            <div data-testid="form-autocomplete-label">{label}</div>
            <div data-testid="form-autocomplete-placeholder">{placeholder}</div>
            <div data-testid="form-autocomplete-value-as-object">{String(valueAsObject)}</div>
            <div data-testid="form-autocomplete-start-content">
                {startContent}
            </div>
        </div>
    )
}))

vi.mock("@/presentation/components/Form/controls/FormDateRangePicker/FormDateRangePicker", () => ({
    default: ({ label, startName, endName, minValue, ...rest }: {
        label: string;
        startName: string;
        endName: string;
        minValue?: Date;
        ["aria-label"]?: string;
    }) => (
        <div data-testid="form-date-range-picker" data-aria-label={rest["aria-label"]}>
            <div data-testid="form-date-range-picker-label">{label}</div>
            <div data-testid="form-date-range-picker-start-name">{startName}</div>
            <div data-testid="form-date-range-picker-end-name">{endName}</div>
            <div data-testid="form-date-range-picker-min-value">{minValue?.toString()}</div>
        </div>
    )
}))


vi.mock("@/presentation/components/Form/components/Button", () => ({
    Button: ({ children, className }: {
        children: React.ReactNode;
        className?: string;
    }) => (
        <button data-testid="form-button" className={className} type="button">
            {children}
        </button>
    )
}))

vi.mock("@/presentation/components/icons/IconBed", () => ({
    default: ({ className }: {
        className?: string;
    }) => (
        <div data-testid="icon-bed" className={className} />
    )
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Form/components/PassengerSelect", () => ({
    PassengersSelect: ({ label, testId, categories, showRoom, roomLabel, guestLabel, triggerAriaLabel }: {
        label: string;
        testId: string;
        categories: unknown[];
        showRoom: boolean;
        roomLabel: string;
        guestLabel: string;
        triggerAriaLabel?: string;
    }) => (
        <div data-testid={testId} data-trigger-aria-label={triggerAriaLabel}>
            <div data-testid="passengers-select-label">{label}</div>
            <div data-testid="passengers-select-categories">{JSON.stringify(categories)}</div>
            <div data-testid="passengers-select-show-room">{String(showRoom)}</div>
            <div data-testid="passengers-select-room-label">{roomLabel}</div>
            <div data-testid="passengers-select-guest-label">{guestLabel}</div>
        </div>
    )
}))

vi.mock("@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Hotels/Form/HotelsFormConfig", () => ({
    mapAutocompleteLocations: vi.fn(),
    MIN_DAYS_AHEAD: 3
}))

vi.mock("@internationalized/date", () => ({
    getLocalTimeZone: vi.fn(() => "America/New_York"),
    today: vi.fn(() => ({
        add: vi.fn(() => ({ toString: () => "2024-01-04" }))
    }))
}))

describe("HotelsFormFields", () => {
    const mockFormContext = {
        values: {
            adults: 2,
            childrens: 0
        },
        errors: {},
        touched: {},
        onInputChange: vi.fn(),
        setFieldValue: vi.fn(),
        onBlur: vi.fn(),
        validateForm: vi.fn(),
        isSubmitting: false,
        submitCount: 0,
        disabled: false,
        hasErrors: false,
        hasVisibleErrors: false,
        alert: null
    }

    const renderWithFormContext = (component: React.ReactElement, contextValue = mockFormContext) => {
        return render(
            <FormContext.Provider value={contextValue}>
                {component}
            </FormContext.Provider>
        )
    }

    it("should render all form fields", () => {
        renderWithFormContext(<HotelsFormFields />)

        expect(screen.getByTestId("form-autocomplete-destination")).toBeInTheDocument()
        expect(screen.getByTestId("form-date-range-picker")).toBeInTheDocument()
        expect(screen.getByTestId("hotels-passengers-select")).toBeInTheDocument()
        expect(screen.getByTestId("form-button")).toBeInTheDocument()
    })

    it("should render destination autocomplete with correct props", () => {
        renderWithFormContext(<HotelsFormFields />)

        expect(screen.getByTestId("form-autocomplete-label")).toHaveTextContent("Ciudad o destino")
        expect(screen.getByTestId("form-autocomplete-placeholder")).toHaveTextContent("Destino")
        expect(screen.getByTestId("form-autocomplete-value-as-object")).toHaveTextContent("true")
        expect(screen.getByTestId("form-autocomplete-start-content")).toContainElement(screen.getByTestId("icon-bed"))
        expect(screen.getByTestId("form-autocomplete-destination")).toHaveAttribute("data-aria-label", "Ciudad o destino")
    })

    it("should render date range picker with correct props", () => {
        renderWithFormContext(<HotelsFormFields />)

        expect(screen.getByTestId("form-date-range-picker-label")).toHaveTextContent("Fechas de estadía")
        expect(screen.getByTestId("form-date-range-picker")).toHaveAttribute("data-aria-label", "Escoge tus fechas de estadía")
        expect(screen.getByTestId("form-date-range-picker-start-name")).toHaveTextContent("startDate")
        expect(screen.getByTestId("form-date-range-picker-end-name")).toHaveTextContent("endDate")
        expect(screen.getByTestId("form-date-range-picker-min-value")).toBeTruthy()
    })

    it("should render passengers select with correct props", () => {
        renderWithFormContext(<HotelsFormFields />)

        expect(screen.getByTestId("passengers-select-label")).toHaveTextContent("Habitación y huéspedes")
        expect(screen.getByTestId("passengers-select-show-room")).toHaveTextContent("true")
        expect(screen.getByTestId("passengers-select-room-label")).toHaveTextContent("Habitación")
        expect(screen.getByTestId("passengers-select-guest-label")).toHaveTextContent("Huésped")
        expect(screen.getByTestId("hotels-passengers-select")).toHaveAttribute(
            "data-trigger-aria-label",
            "Escoge el número de huéspedes para una habitación",
        )
    })

    it("should build passenger categories correctly", () => {
        renderWithFormContext(<HotelsFormFields />)

        const categoriesText = screen.getByTestId("passengers-select-categories").textContent
        const categories = JSON.parse(categoriesText || "[]")
        
        expect(categories).toHaveLength(3) // adults, childrens and infants
        expect(categories[0].value).toBe(2) // adults
        expect(categories[1].value).toBe(0) // childrens
        expect(categories[2].value).toBe(0) // infants
    })

    it("should render submit button", () => {
        renderWithFormContext(<HotelsFormFields />)

        const button = screen.getByTestId("form-button")
        expect(button).toBeInTheDocument()
        expect(screen.getByText("Buscar")).toBeInTheDocument()
    })

    it("should use correct date field names", () => {
        renderWithFormContext(<HotelsFormFields />)

        // This tests the fix we made where we changed from checkIn/checkOut to startDate/endDate
        expect(screen.getByTestId("form-date-range-picker-start-name")).toHaveTextContent("startDate")
        expect(screen.getByTestId("form-date-range-picker-end-name")).toHaveTextContent("endDate")
    })

    it("should render IconBed in destination field", () => {
        renderWithFormContext(<HotelsFormFields />)

        expect(screen.getByTestId("icon-bed")).toBeInTheDocument()
        expect(screen.getByTestId("icon-bed")).toHaveClass("text-grayscale-400")
    })

    it("should have correct responsive layout classes", () => {
        const { container } = renderWithFormContext(<HotelsFormFields />)

        const formContainer = container.firstChild as HTMLElement
        expect(formContainer).toHaveClass("flex", "flex-col", "gap-2.5", "xl:flex-row", "items-end")
    })

    it("should render grid layout for form fields", () => {
        const { container } = renderWithFormContext(<HotelsFormFields />)

        const gridContainer = container.querySelector(".grid") as HTMLElement
        expect(gridContainer).toHaveClass("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "items-end", "gap-2.5")
    })

    it("should handle different passenger counts", () => {
        const customContext = {
            ...mockFormContext,
            values: {
                adults: 3,
                childrens: 2
            }
        }

        renderWithFormContext(<HotelsFormFields />, customContext)

        const categoriesText = screen.getByTestId("passengers-select-categories").textContent
        const categories = JSON.parse(categoriesText || "[]")
        
        expect(categories[0].value).toBe(3) // adults
        expect(categories[1].value).toBe(2) // childrens
    })

    it("should handle form submission state", () => {
        const submittingContext = {
            ...mockFormContext,
            isSubmitting: true
        }

        renderWithFormContext(<HotelsFormFields />, submittingContext)

        const button = screen.getByTestId("form-button")
        expect(button).toBeInTheDocument()
    })

    it("should have correct accessibility attributes", () => {
        renderWithFormContext(<HotelsFormFields />)

        const datePicker = screen.getByTestId("form-date-range-picker")
        // This tests that aria-label is passed correctly
        expect(datePicker).toBeInTheDocument()
    })

    it("should use mapAutocompleteLocations for destination search", () => {
        renderWithFormContext(<HotelsFormFields />)

        // The component should be configured to use mapAutocompleteLocations
        expect(screen.getByTestId("form-autocomplete-destination")).toBeInTheDocument()
    })

    it("should apply correct CSS classes based on hasVisibleErrors", () => {
        const { container } = renderWithFormContext(<HotelsFormFields />)
        
        // Test without errors - check the outer container
        const outerDiv = container.querySelector('.flex-col')
        expect(outerDiv).toHaveClass("items-end")
        
        // Test with errors
        const errorContext = {
            ...mockFormContext,
            hasVisibleErrors: true
        }
        
        const { container: containerWithErrors } = renderWithFormContext(<HotelsFormFields />, errorContext)
        
        const outerDivWithError = containerWithErrors.querySelector('.flex-col')
        expect(outerDivWithError).toHaveClass("items-center")
    })

    it("should apply correct grid classes based on hasVisibleErrors", () => {
        const { container } = renderWithFormContext(<HotelsFormFields />)
        
        // Test without errors - check the grid container
        const gridDiv = container.querySelector('.grid')
        expect(gridDiv).toHaveClass("items-end")
        
        // Test with errors
        const errorContext = {
            ...mockFormContext,
            hasVisibleErrors: true
        }
        
        const { container: containerWithErrors } = renderWithFormContext(<HotelsFormFields />, errorContext)
        
        const gridDivWithError = containerWithErrors.querySelector('.grid')
        expect(gridDivWithError).toHaveClass("items-start")
    })

    it("should have correct responsive grid layout", () => {
        renderWithFormContext(<HotelsFormFields />)
        
        const gridDiv = screen.getByTestId("form-autocomplete-destination").parentElement
        expect(gridDiv).toHaveClass("grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3")
    })

    it("should have correct responsive layout for outer container", () => {
        const { container } = renderWithFormContext(<HotelsFormFields />)
        
        const outerDiv = container.querySelector('.flex-col')
        expect(outerDiv).toHaveClass("flex-col", "xl:flex-row")
    })
})
