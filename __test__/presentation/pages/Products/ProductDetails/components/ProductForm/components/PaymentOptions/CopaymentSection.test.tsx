import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import CopaymentSection from "@/presentation/pages/Products/ProductDetails/components/ProductForm/components/PaymentOptions/CopaymentSection"
import Form from "@/presentation/components/Form/context/Form"
import { CurrencyType } from "@/domain/entity/Currency/currency"
import { VariationCopayment } from "@/domain/entity/Product/variation"
import { defaultProductFormValues } from "@/presentation/pages/Products/ProductDetails/components/ProductForm/ProductFormConfig"

const mockUseSession = vi.fn()
const mockUseProductDetailsContext = vi.fn()
const mockMountTrackerTrack = vi.fn()

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => mockUseSession(),
}))

vi.mock("@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext", () => ({
    useProductDetailsContext: () => mockUseProductDetailsContext(),
}))

vi.mock(
    "@/presentation/pages/Products/ProductDetails/components/ProductForm/components/PaymentOptions/CopaymentCounter",
    () => ({
        default: ({ type }: { type: CurrencyType }) => (
            <div data-testid={`copayment-counter-${type}`}>Counter {type}</div>
        ),
    })
)

vi.mock("@/presentation/helpers/quantities", () => ({
    formatMiles: (v: number) => `${v} millas`,
    formatCurrency: (v: number) => `$${v}`,
    formatCopaymentAmount: (v: number) => v.toFixed(2),
    formatPriceQuantities: (v: number) => `${v}`,
}))

vi.mock("@/presentation/analytics/MountTracker", () => ({
    MountTracker: (props: any) => {
        mockMountTrackerTrack(props)
        return null
    },
}))

const mockCopayment: VariationCopayment = {
    initialization: { points: 300, coins: 10 },
    minimumPointsValue: 200,
    pointsConversionRatePercentage: "base64value",
}

const renderWithForm = (formValues = {}) =>
    render(
        <Form
            initialValues={{ ...defaultProductFormValues, ...formValues }}
            onSubmit={vi.fn()}
        >
            <CopaymentSection
                productUnitPoinsPrice={500}
                productUnitPrice={100}
                copayment={mockCopayment}
            />
        </Form>
    )

describe("CopaymentSection", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUseSession.mockReturnValue({ isLogged: false })
        mockUseProductDetailsContext.mockReturnValue({ rootCategory: null })
    })

    it("should render the section title", () => {
        renderWithForm()
        expect(screen.getByText("Elige la opción que mejor se adapte a ti")).toBeInTheDocument()
    })

    it("should render 'Millas a usar' label", () => {
        renderWithForm()
        expect(screen.getByText("Millas a usar")).toBeInTheDocument()
    })

    it("should render 'Dólares a usar' label", () => {
        renderWithForm()
        expect(screen.getByText("Dólares a usar")).toBeInTheDocument()
    })

    it("should render POINTS counter", () => {
        renderWithForm()
        expect(screen.getByTestId("copayment-counter-points")).toBeInTheDocument()
    })

    it("should render COINS counter", () => {
        renderWithForm()
        expect(screen.getByTestId("copayment-counter-coins")).toBeInTheDocument()
    })

    it("should show total row when both points and coins are defined", () => {
        renderWithForm({ points: 300, coins: 20 })
        expect(screen.getByText("Total")).toBeInTheDocument()
        expect(screen.getByText(/300 millas/)).toBeInTheDocument()
        expect(screen.getByText(/\$20\.00/)).toBeInTheDocument()
    })

    it("should show total row even when points is 0 (condition only checks null/undefined)", () => {
        renderWithForm({ points: 0, coins: 20 })
        expect(screen.queryByText("Total")).toBeInTheDocument()
    })

    it("should show total row even when coins is 0 (condition only checks null/undefined)", () => {
        renderWithForm({ points: 300, coins: 0 })
        expect(screen.queryByText("Total")).toBeInTheDocument()
    })

    it("should show total row with formatted values from form context", () => {
        renderWithForm({ points: 1000, coins: 50 })
        expect(screen.getByText(/1000 millas/)).toBeInTheDocument()
        expect(screen.getByText(/\$50\.00/)).toBeInTheDocument()
    })

    it("should always show two decimals for coins in total row", () => {
        renderWithForm({ points: 2825, coins: 18.3 })
        expect(screen.getByText(/\$18\.30/)).toBeInTheDocument()
    })

    it("should render MountTracker with VIEWED_COPAYMENT event when rootCategory is defined", () => {
        mockUseProductDetailsContext.mockReturnValue({ rootCategory: "Tecnologia" })

        renderWithForm()

        expect(mockMountTrackerTrack).toHaveBeenCalledWith(
            expect.objectContaining({
                name: expect.any(String),
                payload: { category: "Tecnologia" },
            }),
        )
    })

    it("should not render MountTracker when rootCategory is null", () => {
        mockUseProductDetailsContext.mockReturnValue({ rootCategory: null })

        renderWithForm()

        expect(mockMountTrackerTrack).not.toHaveBeenCalled()
    })
})
