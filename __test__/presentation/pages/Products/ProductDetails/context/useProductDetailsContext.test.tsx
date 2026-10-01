import {describe, it, expect, vi} from "vitest"
import {renderHook} from "@testing-library/react"
import {ReactNode} from "react"
import {useProductDetailsContext} from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext"
import {ProductDetailsContext, ProductDetailsContextType} from "@/presentation/pages/Products/ProductDetails/context/ProductDetailsContext"
import {PaymentMethod} from "@/domain/entity/Payment/payment"
import {ProductAsset, ProductTag} from "@/domain/entity/Product/product"
import {Variation} from "@/domain/entity/Product/variation"

// Create a mock context value
const createMockContextValue = (): ProductDetailsContextType => ({
    tags: [] as ProductTag[],
    assets: [] as ProductAsset[],
    variation: null as Variation | null,
    setVariation: vi.fn(),
    selectedFeatures: [] as Array<{name: string; option: string | null}>,
    setSelectedFeatures: vi.fn(),
    quantity: 1,
    setQuantity: vi.fn(),
    isLoading: false,
    pointsPrice: 100,
    paymentMethod: PaymentMethod.POINTS,
    setPaymentMethod: vi.fn(),
    points: 0,
    setPoints: vi.fn(),
    coins: null as number | null,
    setCoins: vi.fn(),
    minCopaymentPoints: 0,
    copaymentPercentage: 20,
    updatedBasket: null,
    checkBasketUpdates: vi.fn(),
})

// Wrapper component for providing context
const createWrapper = (value: ProductDetailsContextType) => {
    return function Wrapper({children}: {children: ReactNode}) {
        return (
            <ProductDetailsContext.Provider value={value}>
                {children}
            </ProductDetailsContext.Provider>
        )
    }
}

describe("useProductDetailsContext", () => {
    it("should return context value when used within provider", () => {
        const mockValue = createMockContextValue()
        const Wrapper = createWrapper(mockValue)

        const {result} = renderHook(() => useProductDetailsContext(), {
            wrapper: Wrapper,
        })

        expect(result.current).toBe(mockValue)
        expect(result.current.quantity).toBe(1)
        expect(result.current.paymentMethod).toBe(PaymentMethod.POINTS)
        expect(result.current.isLoading).toBe(false)
    })

    it("should return correct context values", () => {
        const mockValue = createMockContextValue()
        mockValue.quantity = 5
        mockValue.pointsPrice = 500
        mockValue.isLoading = true

        const Wrapper = createWrapper(mockValue)

        const {result} = renderHook(() => useProductDetailsContext(), {
            wrapper: Wrapper,
        })

        expect(result.current.quantity).toBe(5)
        expect(result.current.pointsPrice).toBe(500)
        expect(result.current.isLoading).toBe(true)
    })

    it("should return setter functions", () => {
        const mockValue = createMockContextValue()
        const Wrapper = createWrapper(mockValue)

        const {result} = renderHook(() => useProductDetailsContext(), {
            wrapper: Wrapper,
        })

        expect(typeof result.current.setQuantity).toBe("function")
        expect(typeof result.current.setVariation).toBe("function")
        expect(typeof result.current.setSelectedFeatures).toBe("function")
        expect(typeof result.current.setPaymentMethod).toBe("function")
        expect(typeof result.current.setPoints).toBe("function")
        expect(typeof result.current.setCoins).toBe("function")
    })

    it("should throw error when used outside of provider", () => {
        // Suppress console.error for this test since we expect an error
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

        expect(() => {
            renderHook(() => useProductDetailsContext())
        }).toThrow("useProductDetailsContext must be used within a ProductDetailsProvider")

        consoleSpy.mockRestore()
    })

    it("should handle null variation", () => {
        const mockValue = createMockContextValue()
        mockValue.variation = null

        const Wrapper = createWrapper(mockValue)

        const {result} = renderHook(() => useProductDetailsContext(), {
            wrapper: Wrapper,
        })

        expect(result.current.variation).toBeNull()
    })

    it("should handle with variation data", () => {
        const mockVariation = {
            id: "test-variation-id",
            sku: "TEST-SKU",
            price: 100,
            pointsPrice: 500,
            stock: 10,
            assets: [],
            features: [],
            tags: [],
        } as unknown as Variation

        const mockValue = createMockContextValue()
        mockValue.variation = mockVariation
        mockValue.points = 250
        mockValue.coins = 12.5

        const Wrapper = createWrapper(mockValue)

        const {result} = renderHook(() => useProductDetailsContext(), {
            wrapper: Wrapper,
        })

        expect(result.current.variation).toBe(mockVariation)
        expect(result.current.variation?.id).toBe("test-variation-id")
        expect(result.current.points).toBe(250)
        expect(result.current.coins).toBe(12.5)
    })

    it("should handle copayment method", () => {
        const mockValue = createMockContextValue()
        mockValue.paymentMethod = PaymentMethod.COPAYMENT

        const Wrapper = createWrapper(mockValue)

        const {result} = renderHook(() => useProductDetailsContext(), {
            wrapper: Wrapper,
        })

        expect(result.current.paymentMethod).toBe(PaymentMethod.COPAYMENT)
    })
})
