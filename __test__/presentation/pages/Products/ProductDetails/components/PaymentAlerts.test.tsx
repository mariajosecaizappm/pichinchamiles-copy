import { Banner } from "@/domain/entity/Banner/banner"
import { Basket } from "@/domain/entity/Basket/structure/basket"
import { ProgramCurrency } from "@/domain/entity/Currency/currency"
import { AuthMember } from "@/domain/entity/Member/authMember"
import { Consent } from "@/domain/entity/Member/consent"
import { Member } from "@/domain/entity/Member/member"
import { PaymentMethod } from "@/domain/entity/Payment/payment"
import { Variation } from "@/domain/entity/Product/variation"
import Form from "@/presentation/components/Form/context/Form"
import useSession from "@/presentation/hooks/useSession"
import PaymentAlerts from "@/presentation/pages/Products/ProductDetails/components/PaymentAlerts"
import { defaultProductFormValues } from "@/presentation/pages/Products/ProductDetails/components/ProductForm/ProductFormConfig"
import { ProductDetailsContextType } from "@/presentation/pages/Products/ProductDetails/context/ProductDetailsContext"
import { useProductDetailsContext } from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext"
import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

// Mock useProductDetailsContext
vi.mock("@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext", () => ({
    useProductDetailsContext: vi.fn(),
}))

// Mock useSession
vi.mock("@/presentation/hooks/useSession", () => ({
    default: vi.fn(),
}))

// Helper to render with Form context
const renderWithForm = (ui: React.ReactElement, formValues = {}) => {
    return render(
        <Form initialValues={{ ...defaultProductFormValues, ...formValues }} onSubmit={vi.fn()}>
            {ui}
        </Form>
    )
}

interface MockAlertProps {
    children: React.ReactNode
    variant?: string
}

interface MockSessionReturn {
    onOpenAuthModal: () => void
    onCloseAuthModal: () => void
    initSession: (authMember: AuthMember) => void
    closeSession: () => Promise<void>
    updateBasket: (basket: Basket | null) => void
    updateBalance: (balance: number) => void
    updateGender: (gender: string) => void
    updateEmail: (email: string) => void
    filterBanners: (banners: Banner[]) => Banner[]
    clearConsent: () => void
    member: Member | null
    isLogged: boolean
    balance: number
    basket: Basket | null
    programCurrency: ProgramCurrency | null
    isValidatingSession: boolean
    consent: Consent | null
    cif: string
}

// Mock Alert
vi.mock("@/presentation/components/Alert", () => ({
    default: ({ children, variant }: MockAlertProps) => (
        <div data-testid="alert" data-variant={variant}>
            {children}
        </div>
    ),
}))

describe("PaymentAlerts", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should return null if not logged in", () => {
        vi.mocked(useSession).mockReturnValue({
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
            clearConsent: vi.fn(),
            member: null,
            isLogged: false,
            balance: 1000,
            basket: null,
            programCurrency: null,
            isValidatingSession: false,
            consent: null,
            cif: '',
        } as MockSessionReturn)

        vi.mocked(useProductDetailsContext).mockReturnValue({
            pointsPrice: 500,
            minCopaymentPoints: 0,
            copaymentPercentage: 20,
            variation: null,
        } as unknown as ProductDetailsContextType)

        renderWithForm(<PaymentAlerts />, { paymentType: PaymentMethod.POINTS, quantity: 1 })
        expect(screen.queryByTestId("alert")).not.toBeInTheDocument()
    })

    it("should return null if user has enough points under POINTS method", () => {
        vi.mocked(useSession).mockReturnValue({
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
            clearConsent: vi.fn(),
            member: null,
            isLogged: true,
            balance: 1000,
            basket: null,
            programCurrency: null,
            isValidatingSession: false,
            consent: null,
            cif: '',
        } as MockSessionReturn)

        vi.mocked(useProductDetailsContext).mockReturnValue({
            pointsPrice: 500,
            minCopaymentPoints: 0,
            copaymentPercentage: 20,
            variation: null,
        } as unknown as ProductDetailsContextType)

        // quantity=2, pointsPrice=500, so total=1000 which equals user balance
        renderWithForm(<PaymentAlerts />, { paymentType: PaymentMethod.POINTS, quantity: 2 })
        expect(screen.queryByTestId("alert")).not.toBeInTheDocument()
    })

    it("should render info alert under POINTS method if user can use copayment but lacks total points", () => {
        vi.mocked(useSession).mockReturnValue({
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
            clearConsent: vi.fn(),
            member: null,
            isLogged: true,
            balance: 500,
            basket: null,
            programCurrency: null,
            isValidatingSession: false,
            consent: null,
            cif: '',
        } as MockSessionReturn)

        vi.mocked(useProductDetailsContext).mockReturnValue({
            pointsPrice: 1000,
            minCopaymentPoints: 200, // variation.copayment.initialization.points * quantity = 200 * 1
            copaymentPercentage: 20,
            variation: {
                copayment: {
                    initialization: { points: 200, coins: 10 },
                },
            } as unknown as Variation,
        } as unknown as ProductDetailsContextType)

        // quantity=1, pointsPrice=1000, userBalance=500 -> user can use copayment (balance >= minCopaymentPoints)
        renderWithForm(<PaymentAlerts />, { paymentType: PaymentMethod.POINTS, quantity: 1 })

        const alert = screen.getByTestId("alert")
        expect(alert).toBeInTheDocument()
        expect(alert).toHaveAttribute("data-variant", "info")
        expect(alert).toHaveTextContent("pago con millas + tarjeta de crédito para completar el canje")
    })

    it("should render warning alert under POINTS method if user cannot afford copayment", () => {
        vi.mocked(useSession).mockReturnValue({
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
            clearConsent: vi.fn(),
            member: null,
            isLogged: true,
            balance: 100, // min copayment = 200 * 1 = 200, user has 100
            basket: null,
            programCurrency: null,
            isValidatingSession: false,
            consent: null,
            cif: '',
        } as MockSessionReturn)

        vi.mocked(useProductDetailsContext).mockReturnValue({
            pointsPrice: 1000,
            minCopaymentPoints: 200, // 200 * 1
            copaymentPercentage: 20,
            variation: {
                copayment: {
                    initialization: { points: 200, coins: 10 },
                },
            } as unknown as Variation,
        } as unknown as ProductDetailsContextType)

        // quantity=1, pointsPrice=1000, userBalance=100 -> missing 900 miles
        renderWithForm(<PaymentAlerts />, { paymentType: PaymentMethod.POINTS, quantity: 1 })

        const alert = screen.getByTestId("alert")
        expect(alert).toBeInTheDocument()
        expect(alert).toHaveAttribute("data-variant", "warning")
        expect(alert).toHaveTextContent("Te faltan 900 millas")
    })

    it("should render warning alert under COPAYMENT method if user balance is below min copayment points", () => {
        vi.mocked(useSession).mockReturnValue({
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
            clearConsent: vi.fn(),
            member: null,
            isLogged: true,
            balance: 100, // min copayment = 200 * 1 = 200, user has 100
            basket: null,
            programCurrency: null,
            isValidatingSession: false,
            consent: null,
            cif: '',
        } as MockSessionReturn)

        vi.mocked(useProductDetailsContext).mockReturnValue({
            pointsPrice: 1000,
            minCopaymentPoints: 200, // 200 * 1
            copaymentPercentage: 20,
            variation: {
                copayment: {
                    initialization: { points: 200, coins: 10 },
                },
            } as unknown as Variation,
        } as unknown as ProductDetailsContextType)

        renderWithForm(<PaymentAlerts />, { paymentType: PaymentMethod.COPAYMENT, quantity: 1 })

        const alert = screen.getByTestId("alert")
        expect(alert).toBeInTheDocument()
        expect(alert).toHaveAttribute("data-variant", "warning")
        expect(alert).toHaveTextContent("Lo sentimos, no tienes suficientes millas para realizar el canje. Necesitas al menos el 20% de tu compra en millas")
    })

    it("should return null under COPAYMENT method if user balance is enough", () => {
        vi.mocked(useSession).mockReturnValue({
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
            clearConsent: vi.fn(),
            member: null,
            isLogged: true,
            balance: 300, // min copayment = 200 * 1 = 200
            basket: null,
            programCurrency: null,
            isValidatingSession: false,
            consent: null,
            cif: '',
        } as MockSessionReturn)

        vi.mocked(useProductDetailsContext).mockReturnValue({
            pointsPrice: 1000,
            minCopaymentPoints: 200, // 200 * 1
            copaymentPercentage: 20,
            variation: {
                copayment: {
                    initialization: { points: 200, coins: 10 },
                },
            } as unknown as Variation,
        } as unknown as ProductDetailsContextType)

        renderWithForm(<PaymentAlerts />, { paymentType: PaymentMethod.COPAYMENT, quantity: 1 })
        expect(screen.queryByTestId("alert")).not.toBeInTheDocument()
    })

    it("should render stock alert when cart already has the max available units", () => {
        vi.mocked(useSession).mockReturnValue({
            onOpenAuthModal: vi.fn(),
            onCloseAuthModal: vi.fn(),
            initSession: vi.fn(),
            closeSession: vi.fn(),
            updateBasket: vi.fn(),
            updateBalance: vi.fn(),
            updateGender: vi.fn(),
            updateEmail: vi.fn(),
            filterBanners: vi.fn(),
            clearConsent: vi.fn(),
            member: null,
            isLogged: true,
            balance: 10000,
            basket: {
                buyerId: "buyer-1",
                items: [{ variationId: "var-1", quantity: 1 } as Basket["items"][number]],
            },
            programCurrency: null,
            isValidatingSession: false,
            consent: null,
            cif: "",
        } as MockSessionReturn)

        vi.mocked(useProductDetailsContext).mockReturnValue({
            pointsPrice: 500,
            minCopaymentPoints: 0,
            variation: { id: "var-1", stock: 1 } as Variation,
        } as unknown as ProductDetailsContextType)

        renderWithForm(<PaymentAlerts />, { paymentType: PaymentMethod.POINTS, quantity: 1 })

        const alert = screen.getByTestId("alert")
        expect(alert).toBeInTheDocument()
        expect(alert).toHaveAttribute("data-variant", "warning")
        expect(alert).toHaveTextContent("¡Ya lo tienes en tu carrito! Es la última unidad disponible.")
    })
})
