import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { useProductDetailsContext } from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext"
import { PaymentMethod } from "@/domain/entity/Payment/payment"
import { Variation } from "@/domain/entity/Product/variation"
import { ProductDetailsContextType } from "@/presentation/pages/Products/ProductDetails/context/ProductDetailsContext"
import Form from "@/presentation/components/Form/context/Form"
import { defaultProductFormValues } from "@/presentation/pages/Products/ProductDetails/components/ProductForm/ProductFormConfig"
import PaymentOptions from "@/presentation/pages/Products/ProductDetails/components/ProductForm/components/PaymentOptions"

// Mock useProductDetailsContext
vi.mock("@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext", () => ({
    useProductDetailsContext: vi.fn(),
}))

interface MockCopaymentSectionProps {
    productUnitPoinsPrice: number
    productUnitPrice: number
}

interface MockAlertProps {
    children: React.ReactNode
    variant?: string
    icon?: string
    className?: string
    title?: string
    contentClassName?: string
}

interface MockRadioProps {
    children: React.ReactNode
    value: string
    classNames?: Record<string, string>
}

interface MockRadioGroupProps {
    children: React.ReactNode
    value: string
    onValueChange?: (val: string) => void
    classNames?: Record<string, string>
}

// Mock CopaymentSection with absolute alias path
vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductForm/components/PaymentOptions/CopaymentSection", () => ({
    default: ({ productUnitPoinsPrice, productUnitPrice }: MockCopaymentSectionProps) => (
        <div data-testid="copayment-section">
            Copayment Section (points: {productUnitPoinsPrice}, price: {productUnitPrice})
        </div>
    )
}))

// Mock PaymentOptionsSkeleton with absolute alias path
vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductForm/components/PaymentOptions/PaymentOptionsSkeleton", () => ({
    default: () => <div data-testid="payment-options-skeleton">PaymentOptionsSkeleton</div>,
}))

// Mock Alert
vi.mock("@/presentation/components/Alert", () => ({
    default: ({ children, variant, icon, className, title, contentClassName }: MockAlertProps) => (
        <div data-testid="alert" data-variant={variant} data-icon={icon} className={className}>
            {title && <div data-testid="alert-title">{title}</div>}
            <div data-testid="alert-content" className={contentClassName}>{children}</div>
        </div>
    )
}))

// Mock Radio and RadioGroup from heroui
vi.mock("@/presentation/components/Form/components/Radio", () => ({
    Radio: ({ children, value, classNames }: MockRadioProps) => (
        <div data-testid={`radio-${value}`} className={classNames?.base}>
            {children}
        </div>
    ),
}))

vi.mock("@heroui/react", () => ({
    RadioGroup: ({ children, value, classNames }: MockRadioGroupProps) => (
        <div data-testid="radio-group" data-value={value} className={classNames?.wrapper}>
            {children}
        </div>
    ),
    Skeleton: ({ className }: { className?: string }) => <div className={className} data-testid="skeleton" />,
    cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
}))

// Helper to render with Form context
const renderWithForm = (ui: React.ReactElement, formValues = {}) => {
    return render(
        <Form initialValues={{ ...defaultProductFormValues, ...formValues }} onSubmit={vi.fn()}>
            {ui}
        </Form>
    )
}

const makeContext = (overrides: Partial<ProductDetailsContextType> = {}): ProductDetailsContextType => ({
    pointsPrice: 500,
    variation: null,
    isLoading: false,
    copaymentPercentage: 0,
    minCopaymentPoints: 0,
    tags: [],
    assets: [],
    setVariation: vi.fn(),
    selectedFeatures: [],
    setSelectedFeatures: vi.fn(),
    addProductToCart: vi.fn(),
    ...overrides,
} as unknown as ProductDetailsContextType)

describe("PaymentOptions", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should render loading skeleton when isLoading is true", () => {
        vi.mocked(useProductDetailsContext).mockReturnValue(makeContext({ isLoading: true }))

        renderWithForm(<PaymentOptions basePointsPrice={500} />)
        expect(screen.getByTestId("payment-options-skeleton")).toBeInTheDocument()
    })

    it("should not render skeleton when isLoading is false", () => {
        vi.mocked(useProductDetailsContext).mockReturnValue(makeContext({ isLoading: false }))

        renderWithForm(<PaymentOptions basePointsPrice={500} />)
        expect(screen.queryByTestId("payment-options-skeleton")).not.toBeInTheDocument()
    })

    it("should render POINTS option only when hasCopayment is false", () => {
        vi.mocked(useProductDetailsContext).mockReturnValue(makeContext({
            variation: { id: "var-1", copayment: null } as unknown as Variation,
        }))

        renderWithForm(<PaymentOptions basePointsPrice={500} />, { quantity: 2 })

        expect(screen.getByText("¿Cómo quieres realizar el canje?")).toBeInTheDocument()
        expect(screen.getByTestId("radio-points")).toBeInTheDocument()
        expect(screen.getByTestId("radio-points")).toHaveTextContent("Solo con millas: 1.000 millas")
        expect(screen.queryByTestId("radio-copayment")).not.toBeInTheDocument()
        expect(screen.queryByTestId("copayment-section")).not.toBeInTheDocument()
    })

    it("should render both options when variation has copayment", () => {
        vi.mocked(useProductDetailsContext).mockReturnValue(makeContext({
            variation: { id: "var-1", copayment: {} } as unknown as Variation,
        }))

        renderWithForm(<PaymentOptions basePointsPrice={500} />)

        expect(screen.getByTestId("radio-points")).toBeInTheDocument()
        expect(screen.getByTestId("radio-copayment")).toBeInTheDocument()
    })

    it("should render CopaymentSection and Alert when COPAYMENT is selected and variation has copayment", () => {
        vi.mocked(useProductDetailsContext).mockReturnValue(makeContext({
            pointsPrice: 400,
            variation: { id: "var-1", price: 100, copayment: {} } as unknown as Variation,
        }))

        renderWithForm(<PaymentOptions basePointsPrice={400} />, { paymentType: PaymentMethod.COPAYMENT })

        expect(screen.getByTestId("copayment-section")).toBeInTheDocument()
        expect(screen.getByTestId("copayment-section")).toHaveTextContent("Copayment Section (points: 400, price: 100)")
        expect(screen.getByTestId("alert")).toBeInTheDocument()
    })

    it("should NOT render CopaymentSection when paymentType is POINTS even if variation has copayment", () => {
        vi.mocked(useProductDetailsContext).mockReturnValue(makeContext({
            variation: { id: "var-1", price: 100, copayment: {} } as unknown as Variation,
        }))

        renderWithForm(<PaymentOptions basePointsPrice={500} />, { paymentType: PaymentMethod.POINTS })

        expect(screen.queryByTestId("copayment-section")).not.toBeInTheDocument()
        expect(screen.queryByTestId("alert")).not.toBeInTheDocument()
    })

    it("should NOT render CopaymentSection when paymentType is COPAYMENT but variation has no copayment", () => {
        vi.mocked(useProductDetailsContext).mockReturnValue(makeContext({
            variation: { id: "var-1", price: 100, copayment: null } as unknown as Variation,
        }))

        renderWithForm(<PaymentOptions basePointsPrice={500} />, { paymentType: PaymentMethod.COPAYMENT })

        expect(screen.queryByTestId("copayment-section")).not.toBeInTheDocument()
    })

    it("should show copaymentPercentage in the info Alert", () => {
        vi.mocked(useProductDetailsContext).mockReturnValue(makeContext({
            pointsPrice: 500,
            variation: { id: "var-1", price: 100, copayment: {} } as unknown as Variation,
        }))

        renderWithForm(<PaymentOptions basePointsPrice={500} />, { paymentType: PaymentMethod.COPAYMENT })

        expect(screen.getByText(/20%/)).toBeInTheDocument()
    })

    it("should use basePointsPrice when pointsPrice is 0", () => {
        vi.mocked(useProductDetailsContext).mockReturnValue(makeContext({
            pointsPrice: 0,
            variation: { id: "var-1", copayment: null } as unknown as Variation,
        }))

        renderWithForm(<PaymentOptions basePointsPrice={300} />, { quantity: 1 })

        expect(screen.getByTestId("radio-points")).toHaveTextContent("300 millas")
    })

    it("should render with null variation (no copayment option)", () => {
        vi.mocked(useProductDetailsContext).mockReturnValue(makeContext({ variation: null }))

        renderWithForm(<PaymentOptions basePointsPrice={500} />)

        expect(screen.getByTestId("radio-points")).toBeInTheDocument()
        expect(screen.queryByTestId("radio-copayment")).not.toBeInTheDocument()
    })
})
