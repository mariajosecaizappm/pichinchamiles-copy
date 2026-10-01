import { describe, it, expect, vi, beforeEach } from "vitest"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { CurrencyType } from "@/domain/entity/Currency/currency"
import Form from "@/presentation/components/Form/context/Form"
import { defaultProductFormValues } from "@/presentation/pages/Products/ProductDetails/components/ProductForm/ProductFormConfig"
import CopaymentCounterContainer from "@/presentation/pages/Products/ProductDetails/components/ProductForm/components/PaymentOptions/CopaymentCounter"
import { useProductDetailsContext } from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext"

interface MockCounterProps {
    count: number
    onChange: (value: number) => void
    min?: number
    max?: number
}

const sessionMocks = vi.hoisted(() => ({
    balance: 10000 as number | null,
    isLogged: true,
    lastCounterProps: null as MockCounterProps | null,
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({ balance: sessionMocks.balance, isLogged: sessionMocks.isLogged }),
}))

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        refresh: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        prefetch: vi.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
}))

vi.mock("react-redux", () => ({
    useDispatch: () => vi.fn(),
    useSelector: (selector: (state: unknown) => unknown) => {
        const mockState = {
            user: {
                information: null,
                isLogged: false,
                balance: 0,
                isValidatingSession: false,
                basket: null,
                programCurrency: null,
                consent: null,
                cif: '',
            }
        }
        return selector(mockState)
    },
}))

vi.mock("@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext")

const mockUseProductDetailsContext = useProductDetailsContext as unknown as ReturnType<typeof vi.fn>

mockUseProductDetailsContext.mockReturnValue({
    isLoading: false,
    variation: null,
    pointsPrice: 500,
    quantity: 1,
    paymentMethod: "points",
    setPaymentMethod: vi.fn(),
    setVariation: vi.fn(),
    selectedFeatures: [],
    setSelectedFeatures: vi.fn(),
    setQuantity: vi.fn(),
    tags: [],
    paymentOptionsVariation: null,
    points: 0,
    setPoints: vi.fn(),
    coins: null,
    setCoins: vi.fn(),
})

const renderWithForm = (ui: React.ReactElement, formValues = {}) => {
    return render(
        <Form initialValues={{ ...defaultProductFormValues, ...formValues }} onSubmit={vi.fn()}>
            {ui}
        </Form>
    )
}

vi.mock("@/presentation/components/Form/components/Counter", () => ({
    default: (props: MockCounterProps) => {
        const { count, onChange, min = -9999, max = 99999 } = props
        sessionMocks.lastCounterProps = props
        return (
            <div data-testid="mock-counter">
                Count: {count}
                <button onClick={() => onChange(count + 1)}>Increment</button>
                <button onClick={() => onChange(count - 1)}>Decrement</button>
            </div>
        )
    },
}))

describe("CopaymentCounterContainer", () => {
    const doubleEncodedRate = btoa("MC4wNQ==")
    const mockCopayment = {
        initialization: {points: 100, coins: 10},
        minimumPointsValue: 200,
        pointsConversionRatePercentage: doubleEncodedRate,
    }

    beforeEach(() => {
        sessionMocks.balance = 10000
        sessionMocks.isLogged = true
        sessionMocks.lastCounterProps = null
    })

    it("should render points counter", () => {
        const { container } = renderWithForm(
            <CopaymentCounterContainer
                type={CurrencyType.POINTS}
                productUnitPoinsPrice={500}
                productUnitPrice={25}
                copayment={mockCopayment}
            />,
            { points: 100, coins: 10 }
        )
        expect(container.firstChild).toBeInTheDocument()
    })

    it("should render coins counter", () => {
        const { container } = renderWithForm(
            <CopaymentCounterContainer
                type={CurrencyType.COINS}
                productUnitPoinsPrice={500}
                productUnitPrice={25}
                copayment={mockCopayment}
            />,
            { points: 100, coins: 10 }
        )
        expect(container.firstChild).toBeInTheDocument()
    })

    it("should handle handleChange with points", async () => {
        renderWithForm(
            <CopaymentCounterContainer
                type={CurrencyType.POINTS}
                productUnitPoinsPrice={500}
                productUnitPrice={25}
                copayment={mockCopayment}
            />,
            { points: 100, coins: 10 }
        )

        await act(async () => {
            fireEvent.click(screen.getByText("Increment"))
        })

        await waitFor(() => {
            expect(screen.getByText(/Count: 101/)).toBeInTheDocument()
        })
    })

    it("should handle handleChange with coins", async () => {
        renderWithForm(
            <CopaymentCounterContainer
                type={CurrencyType.COINS}
                productUnitPoinsPrice={500}
                productUnitPrice={25}
                copayment={mockCopayment}
            />,
            { points: 100, coins: 10 }
        )

        await act(async () => {
            fireEvent.click(screen.getByText("Increment"))
        })

        await waitFor(() => {
            expect(screen.getByText(/Count: 11/)).toBeInTheDocument()
        })
    })

    it("should prevent coins counter from causing points overflow beyond user balance", () => {
        const productPrice = 4991
        const userBalance = 1000

        sessionMocks.balance = userBalance

        renderWithForm(
            <CopaymentCounterContainer
                type={CurrencyType.COINS}
                productUnitPoinsPrice={productPrice}
                productUnitPrice={249.55}
                copayment={mockCopayment}
            />,
            { points: 998, coins: 59.9 }
        )

        expect(screen.getByTestId("mock-counter")).toBeInTheDocument()
        expect(sessionMocks.lastCounterProps?.min).toBe(59.9)
    })

    it("should lock coins counter when decrementing would exceed user balance", async () => {
        const productPrice = 4991
        const userBalance = 1000

        sessionMocks.balance = userBalance

        renderWithForm(
            <CopaymentCounterContainer
                type={CurrencyType.COINS}
                productUnitPoinsPrice={productPrice}
                productUnitPrice={249.55}
                copayment={mockCopayment}
            />,
            { points: 998, coins: 59.9 }
        )

        await act(async () => {
            fireEvent.click(screen.getByText("Decrement"))
        })

        expect(screen.getByText(/Count: 59.9/)).toBeInTheDocument()
        expect(sessionMocks.lastCounterProps?.min).toBe(59.9)
    })

    it("should handle coins decrement with rounding", async () => {
        renderWithForm(
            <CopaymentCounterContainer
                type={CurrencyType.COINS}
                productUnitPoinsPrice={500}
                productUnitPrice={25}
                copayment={mockCopayment}
            />,
            { points: 100, coins: 15 }
        )

        await act(async () => {
            fireEvent.click(screen.getByText("Decrement"))
        })

        await waitFor(() => {
            expect(screen.getByText(/Count: 14/)).toBeInTheDocument()
        })
    })

    it("should render counter with initial form values", () => {
        renderWithForm(
            <CopaymentCounterContainer
                type={CurrencyType.POINTS}
                productUnitPoinsPrice={500}
                productUnitPrice={25}
                copayment={mockCopayment}
            />,
            { points: 250, coins: 12.5 }
        )

        expect(screen.getByText(/Count: 250/)).toBeInTheDocument()
    })

    it("should use coins default min when user has no balance", () => {
        sessionMocks.balance = null

        renderWithForm(
            <CopaymentCounterContainer
                type={CurrencyType.COINS}
                productUnitPoinsPrice={500}
                productUnitPrice={25}
                copayment={mockCopayment}
            />,
            { points: 100, coins: 10 }
        )

        expect(sessionMocks.lastCounterProps?.min).toBe(1)
    })

    it("should cap max by balance when balance is lower than copayment max", () => {
        sessionMocks.balance = 50

        renderWithForm(
            <CopaymentCounterContainer
                type={CurrencyType.POINTS}
                productUnitPoinsPrice={500}
                productUnitPrice={25}
                copayment={mockCopayment}
            />,
            { points: 100, coins: 10 }
        )

        expect(sessionMocks.lastCounterProps?.max).toBe(50)
    })

    it("should use commercial max for coins when balance is zero", () => {
        sessionMocks.balance = 0

        renderWithForm(
            <CopaymentCounterContainer
                type={CurrencyType.COINS}
                productUnitPoinsPrice={500}
                productUnitPrice={25}
                copayment={mockCopayment}
            />,
            { points: 100, coins: 10 }
        )

        expect(sessionMocks.lastCounterProps?.max).toBe(20)
    })

    it("should use commercial max for points when balance is zero", () => {
        sessionMocks.balance = 0

        renderWithForm(
            <CopaymentCounterContainer
                type={CurrencyType.POINTS}
                productUnitPoinsPrice={500}
                productUnitPrice={25}
                copayment={mockCopayment}
            />,
            { points: 100, coins: 10 }
        )

        expect(sessionMocks.lastCounterProps?.max).toBe(480)
    })

    it("should clamp coins to commercial max and keep points above minimum", async () => {
        renderWithForm(
            <CopaymentCounterContainer
                type={CurrencyType.COINS}
                productUnitPoinsPrice={1000}
                productUnitPrice={100}
                copayment={{
                    initialization: { points: 200, coins: 40 },
                    minimumPointsValue: 200,
                    pointsConversionRatePercentage: doubleEncodedRate,
                }}
            />,
            { points: 221, coins: 38.95 }
        )

        await act(async () => {
            fireEvent.click(screen.getByText("Increment"))
        })

        await act(async () => {
            fireEvent.click(screen.getByText("Increment"))
        })

        await waitFor(() => {
            expect(screen.getByText(/Count: 40/)).toBeInTheDocument()
        })
    })

    it("should render coins counter with zero when coins value is null", () => {
        sessionMocks.balance = 10000

        renderWithForm(
            <CopaymentCounterContainer
                type={CurrencyType.COINS}
                productUnitPoinsPrice={500}
                productUnitPrice={25}
                copayment={mockCopayment}
            />,
            { points: 100, coins: null }
        )

        expect(screen.getByText(/Count: 0/)).toBeInTheDocument()
    })

    it("should fallback to quantity 1 when form quantity is falsy", () => {
        sessionMocks.balance = 10000

        renderWithForm(
            <CopaymentCounterContainer
                type={CurrencyType.COINS}
                productUnitPoinsPrice={500}
                productUnitPrice={25}
                copayment={mockCopayment}
            />,
            { points: 100, coins: 10, quantity: 0 }
        )

        expect(screen.getByTestId("mock-counter")).toBeInTheDocument()
    })
})

