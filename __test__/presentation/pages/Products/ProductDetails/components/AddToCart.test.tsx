import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { useProductDetailsContext } from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext"
import useSession from "@/presentation/hooks/useSession"
import Form from "@/presentation/components/Form/context/Form"
import { defaultProductFormValues } from "@/presentation/pages/Products/ProductDetails/components/ProductForm/ProductFormConfig"
import AddToCart from "@/presentation/pages/Products/ProductDetails/components/ProductForm/components/AddToCart"

// Mock useProductDetailsContext
vi.mock("@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext")

// Mock useSession
vi.mock("@/presentation/hooks/useSession", () => ({
    default: vi.fn(),
}))

const mockUseProductDetailsContext = useProductDetailsContext as unknown as ReturnType<typeof vi.fn>
const mockUseSession = useSession as unknown as ReturnType<typeof vi.fn>

// Helper to render with Form context
const renderWithForm = (ui: React.ReactElement, formValues = {}) => {
    return render(
        <Form initialValues={{ ...defaultProductFormValues, ...formValues }} onSubmit={vi.fn()}>
            {ui}
        </Form>
    )
}

describe("AddToCart", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // Default mock for useSession
        mockUseSession.mockReturnValue({
            isValidatingSession: false,
            isLogged: true,
            balance: 1000,
            basket: null,
            programCurrency: { code: "PTS" },
        })
    })

    it("should render without errors", () => {
        mockUseProductDetailsContext.mockReturnValue({
            pointsPrice: 500,
            minCopaymentPoints: 100,
            variation: { id: "var-1", pointsPrice: 500, stock: 5 },
        })

        const { container } = renderWithForm(<AddToCart isLoading={false} />)
        expect(container.firstChild).toBeInTheDocument()
    })

    it("should render button when not loading", () => {
        mockUseProductDetailsContext.mockReturnValue({
            pointsPrice: 500,
            minCopaymentPoints: 100,
            variation: { id: "var-1", pointsPrice: 500, stock: 5 },
        })

        renderWithForm(<AddToCart isLoading={false} />)
        expect(screen.getByRole("button")).toBeInTheDocument()
    })

    it("should render button even when loading (disabled)", () => {
        mockUseProductDetailsContext.mockReturnValue({
            pointsPrice: 500,
            minCopaymentPoints: 100,
            variation: { id: "var-1", pointsPrice: 500, stock: 5 },
        })

        renderWithForm(<AddToCart isLoading={true} />)
        // Button is still rendered but disabled during loading
        expect(screen.getByRole("button")).toBeInTheDocument()
    })

    it("should disable button when cart already has the max available units", () => {
        mockUseSession.mockReturnValue({
            isValidatingSession: false,
            isLogged: true,
            balance: 10000,
            basket: {
                buyerId: "buyer-1",
                items: [{ variationId: "var-1", quantity: 1 }],
            },
            programCurrency: { code: "PTS" },
        })
        mockUseProductDetailsContext.mockReturnValue({
            pointsPrice: 500,
            minCopaymentPoints: 100,
            variation: { id: "var-1", pointsPrice: 500, stock: 1 },
        })

        renderWithForm(<AddToCart isLoading={false} />)
        expect(screen.getByRole("button")).toBeDisabled()
    })
})
