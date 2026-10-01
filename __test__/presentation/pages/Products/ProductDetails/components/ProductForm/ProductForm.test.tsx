import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import ProductForm from "@/presentation/pages/Products/ProductDetails/components/ProductForm"
import { useProductDetailsContext } from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext"
import useSession from "@/presentation/hooks/useSession"
import { ProductVariation } from "@/domain/entity/Product/product"
import { EventName } from "@/presentation/analytics/types"

const mockTrack = vi.fn()

vi.mock("@/presentation/hooks/useAnalytics", () => ({
    default: () => ({
        track: mockTrack,
    }),
}))

vi.mock("@/presentation/analytics/MountTracker", () => ({
    MountTracker: ({ name, payload }: { name: string; payload: unknown }) => (
        <div data-testid="mount-tracker" data-name={name} data-payload={JSON.stringify(payload)} />
    ),
}))

vi.mock("@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext", () => ({
    useProductDetailsContext: vi.fn(),
}))

vi.mock("@/presentation/hooks/useSession", () => ({
    default: vi.fn(),
}))

vi.mock("react-redux", () => ({
    useDispatch: vi.fn(() => vi.fn()),
    useSelector: vi.fn(() => null),
}))

vi.mock("@/presentation/redux/features/authModalSlice", () => ({
    openAuthModal: vi.fn(() => ({ type: "authModal/open" })),
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductForm/ProductFormLogic", () => ({
    default: () => null,
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductForm/components/PaymentOptions", () => ({
    default: () => <div data-testid="payment-options" />,
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductForm/components/ProductCustomization/ProductCustomization", () => ({
    default: () => <div data-testid="product-customization" />,
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/ProductForm/components/AddToCart", () => ({
    default: ({ isLoading }: { isLoading: boolean }) => (
        <button type="submit" data-testid="add-to-cart" disabled={isLoading}>
            {isLoading ? "Cargando..." : "Agregar"}
        </button>
    ),
}))

vi.mock("@/presentation/pages/Products/ProductDetails/components/PaymentAlerts", () => ({
    default: () => <div data-testid="payment-alerts" />,
}))

const mockProductVariation: ProductVariation = {
    product: {
        id: "prod-1",
        name: "Test Product",
        slug: "test-product",
        features: [],
        minPointsPrice: 500,
        assets: [],
        tags: [],
    },
    variations: [{
        id: "var-1",
        pointsPrice: 500,
        features: [],
        assets: [],
        tags: [],
        copayment: null,
    }],
} as unknown as ProductVariation

describe("ProductForm", () => {
    const mockAddProductToCart = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useProductDetailsContext).mockReturnValue({
            variation: { id: "var-1" } as unknown as ReturnType<typeof useProductDetailsContext>["variation"],
            addProductToCart: mockAddProductToCart,
            isLoading: false,
            assets: [],
            tags: [],
            setVariation: vi.fn(),
            selectedFeatures: [],
            setSelectedFeatures: vi.fn(),
            pointsPrice: 500,
            minCopaymentPoints: 0,
            rootCategory: "Tecnologia",
        } as unknown as ReturnType<typeof useProductDetailsContext>)
        vi.mocked(useSession).mockReturnValue({
            isLogged: true,
            basket: { buyerId: "buyer-1", items: [] },
            programCurrency: { coinsCurrencyId: "coins", pointsCurrencyId: "points" },
        } as unknown as ReturnType<typeof useSession>)
    })

    it("should render all child components", () => {
        render(<ProductForm productVariation={mockProductVariation} />)
        expect(screen.getByTestId("product-customization")).toBeInTheDocument()
        expect(screen.getByTestId("payment-options")).toBeInTheDocument()
        expect(screen.getByTestId("add-to-cart")).toBeInTheDocument()
        expect(screen.getByTestId("payment-alerts")).toBeInTheDocument()
    })

    it("should call addProductToCart and track ADDED_PRODUCT event on submit when user is logged in", async () => {
        mockAddProductToCart.mockResolvedValue(undefined)

        render(<ProductForm productVariation={mockProductVariation} />)
        fireEvent.click(screen.getByTestId("add-to-cart"))

        await waitFor(() => {
            expect(mockAddProductToCart).toHaveBeenCalledOnce()
        })
        expect(mockTrack).toHaveBeenCalledWith(EventName.ADDED_PRODUCT, {
            product: mockProductVariation.product,
            category: "Tecnologia",
            pointsAmount: 0,
        })
    })

    it("should render MountTracker for VIEWED_PRODUCT when rootCategory is defined", () => {
        render(<ProductForm productVariation={mockProductVariation} />)

        const mountTracker = screen.getByTestId("mount-tracker")
        expect(mountTracker).toBeInTheDocument()
        expect(mountTracker).toHaveAttribute("data-name", EventName.VIEWED_PRODUCT)
        expect(JSON.parse(mountTracker.getAttribute("data-payload") || "{}")).toEqual({
            category: "Tecnologia",
            product: mockProductVariation.product,
        })
    })

    it("should not render MountTracker when rootCategory is empty/falsy", () => {
        vi.mocked(useProductDetailsContext).mockReturnValue({
            variation: { id: "var-1" } as unknown as ReturnType<typeof useProductDetailsContext>["variation"],
            addProductToCart: mockAddProductToCart,
            isLoading: false,
            assets: [],
            tags: [],
            setVariation: vi.fn(),
            selectedFeatures: [],
            setSelectedFeatures: vi.fn(),
            pointsPrice: 500,
            minCopaymentPoints: 0,
            rootCategory: undefined,
        } as unknown as ReturnType<typeof useProductDetailsContext>)

        render(<ProductForm productVariation={mockProductVariation} />)

        expect(screen.queryByTestId("mount-tracker")).not.toBeInTheDocument()
    })

    it("should dispatch openAuthModal when user is not logged in", async () => {
        const mockDispatch = vi.fn()
        const { useDispatch } = await import("react-redux")
        vi.mocked(useDispatch).mockReturnValue(mockDispatch)

        vi.mocked(useSession).mockReturnValue({
            isLogged: false,
            basket: null,
            programCurrency: null,
        } as unknown as ReturnType<typeof useSession>)

        render(<ProductForm productVariation={mockProductVariation} />)
        fireEvent.click(screen.getByTestId("add-to-cart"))

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith({ type: "authModal/open" })
        })
        expect(mockAddProductToCart).not.toHaveBeenCalled()
        expect(mockTrack).not.toHaveBeenCalled()
    })

    it("should not show modal when basket is empty", async () => {
        mockAddProductToCart.mockResolvedValue(undefined)

        render(<ProductForm productVariation={mockProductVariation} />)
        fireEvent.click(screen.getByTestId("add-to-cart"))

        await waitFor(() => {
            expect(mockAddProductToCart).toHaveBeenCalled()
        })
        expect(screen.queryByTestId("on-basket-modal")).not.toBeInTheDocument()
    })

    it("should apply custom className to wrapper", () => {
        const { container } = render(
            <ProductForm productVariation={mockProductVariation} className="custom-class" />
        )
        expect(container.querySelector(".custom-class")).toBeInTheDocument()
    })

    it("should show loading state on add-to-cart button during submit", async () => {
        let resolveCart: () => void
        const pendingPromise = new Promise<void>((res) => { resolveCart = res })
        mockAddProductToCart.mockReturnValue(pendingPromise)

        render(<ProductForm productVariation={mockProductVariation} />)
        fireEvent.click(screen.getByTestId("add-to-cart"))

        await waitFor(() => {
            expect(screen.getByTestId("add-to-cart")).toBeDisabled()
        })

        resolveCart!()
    })

    it("should not open modal when basket is null", async () => {
        mockAddProductToCart.mockResolvedValue(undefined)
        vi.mocked(useSession).mockReturnValue({
            isLogged: true,
            basket: null,
            programCurrency: null,
        } as unknown as ReturnType<typeof useSession>)

        render(<ProductForm productVariation={mockProductVariation} />)
        fireEvent.click(screen.getByTestId("add-to-cart"))

        await waitFor(() => {
            expect(mockAddProductToCart).toHaveBeenCalled()
        })
        expect(screen.queryByTestId("on-basket-modal")).not.toBeInTheDocument()
    })
})
