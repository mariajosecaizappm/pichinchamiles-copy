import { beforeEach, describe, expect, it, vi } from "vitest"
import pixelProvider from "@/presentation/analytics/providers/pixelProvider"
import { EventName } from "@/presentation/analytics/types"
import { Product, ProductType } from "@/domain/entity/Product/product"
import { BasketItem } from "@/domain/entity/Basket/structure/basket"
import { PaymentMethod } from "@/domain/entity/Payment/payment"

const buildMockProduct = (overrides: Partial<Product> = {}): Product => ({
    id: "prod-1",
    name: "Smartphone XYZ",
    slug: "smartphone-xyz",
    description: "A great phone",
    brand: {
        id: "brand-1",
        name: "BrandTech",
    },
    categories: [],
    minPointsPrice: 15000,
    features: [],
    assets: [],
    tags: [],
    ...overrides,
} as unknown as Product)

const buildMockBasketItem = (overrides: Partial<BasketItem> = {}): BasketItem => ({
    id: "basket-1",
    storeId: "store-1",
    supplierId: "supplier-1",
    productId: "prod-1",
    variationId: "var-1",
    categoryId: "cat-1",
    quantity: 2,
    brandName: "BrandTech",
    categoryName: "Tecnologia",
    paymentMethod: PaymentMethod.POINTS,
    productType: ProductType.PHYSICAL_PRODUCT,
    description: "A great phone",
    slug: "smartphone-xyz",
    variationInfo: {
        productName: "Smartphone XYZ",
        productSlug: "smartphone-xyz",
        stock: 10,
        price: 300,
        pointsPrice: 15000,
        taxes: 0,
        assets: [],
        features: [],
    },
    paymentTypes: {
        coin: {
            currencyId: "coins",
            amount: 0,
        },
        points: {
            currencyId: "miles",
            amount: 30000,
        },
    },
    ...overrides,
} as unknown as BasketItem)

describe("pixelProvider", () => {
    const mockFbq = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        window.fbq = mockFbq
    })

    it("has the correct provider name", () => {
        expect(pixelProvider.name).toBe("pixelProvider")
    })

    describe("when tracking PURCHASED_PRODUCT event", () => {
        it("calls fbq with Purchase event and mapped product details", () => {
            const item1 = buildMockBasketItem({
                slug: "laptop-pro",
                quantity: 1,
                paymentTypes: {
                    coin: { currencyId: "coins", amount: 0 },
                    points: { currencyId: "miles", amount: 25000 },
                },
            })
            const item2 = buildMockBasketItem({
                slug: "wireless-mouse",
                quantity: 3,
                paymentTypes: {
                    coin: { currencyId: "coins", amount: 0 },
                    points: { currencyId: "miles", amount: 6000 },
                },
            })

            pixelProvider.track({
                name: EventName.PURCHASED_PRODUCT,
                payload: {
                    products: [item1, item2],
                    reference: "REF-12345",
                },
            })

            expect(mockFbq).toHaveBeenCalledTimes(1)
            expect(mockFbq).toHaveBeenCalledWith("track", "Purchase", {
                content_ids: ["laptop-pro", "wireless-mouse"],
                content_type: "product",
                value: 31000,
                num_items: 4,
            })
        })

        it("handles empty products list gracefully", () => {
            pixelProvider.track({
                name: EventName.PURCHASED_PRODUCT,
                payload: {
                    products: [],
                    reference: "REF-EMPTY",
                },
            })

            expect(mockFbq).toHaveBeenCalledWith("track", "Purchase", {
                content_ids: [],
                content_type: "product",
                value: 0,
                num_items: 0,
            })
        })
    })

    describe("when tracking ADDED_PRODUCT event", () => {
        it("calls fbq with AddToCart event and product details", () => {
            const product = buildMockProduct({
                slug: "headphones-bt",
                name: "Bluetooth Headphones",
            })

            pixelProvider.track({
                name: EventName.ADDED_PRODUCT,
                payload: {
                    product,
                    category: "Audio",
                    pointsAmount: 8500,
                },
            })

            expect(mockFbq).toHaveBeenCalledTimes(1)
            expect(mockFbq).toHaveBeenCalledWith("track", "AddToCart", {
                content_ids: ["headphones-bt"],
                content_name: "Bluetooth Headphones",
                content_type: "product",
                value: 8500,
            })
        })
    })

    describe("when tracking VIEWED_PRODUCT event", () => {
        it("calls fbq with ViewContent event and minPointsPrice value", () => {
            const product = buildMockProduct({
                slug: "smart-tv-55",
                name: "Smart TV 55 Inch",
                minPointsPrice: 42000,
            })

            pixelProvider.track({
                name: EventName.VIEWED_PRODUCT,
                payload: {
                    category: "Televisores",
                    product,
                },
            })

            expect(mockFbq).toHaveBeenCalledTimes(1)
            expect(mockFbq).toHaveBeenCalledWith("track", "ViewContent", {
                content_ids: ["smart-tv-55"],
                content_name: "Smart TV 55 Inch",
                content_type: "product",
                value: 42000,
            })
        })
    })

    describe("when tracking other events", () => {
        it("does not call fbq for unhandled events", () => {
            pixelProvider.track({
                name: EventName.CLICKED_PRODUCT,
                payload: {
                    product: buildMockProduct(),
                },
            })

            pixelProvider.track({
                name: EventName.LOGIN,
                payload: {
                    status: "success",
                },
            })

            pixelProvider.track({
                name: EventName.VIEWED_HOME,
                payload: {},
            })

            pixelProvider.track({
                name: EventName.OPEN_AUTH_MODAL,
                payload: {},
            })

            expect(mockFbq).not.toHaveBeenCalled()
        })
    })

    describe("when window or window.fbq is undefined or not a function", () => {
        it("does not throw when window.fbq is undefined", () => {
            delete window.fbq

            expect(() => {
                pixelProvider.track({
                    name: EventName.ADDED_PRODUCT,
                    payload: {
                        product: buildMockProduct(),
                        category: "Audio",
                        pointsAmount: 5000,
                    },
                })
            }).not.toThrow()
        })

        it("does not throw when window.fbq is not a function", () => {
            // @ts-expect-error Assigning non-function for edge-case test
            window.fbq = "not-a-function"

            expect(() => {
                pixelProvider.track({
                    name: EventName.VIEWED_PRODUCT,
                    payload: {
                        category: "Televisores",
                        product: buildMockProduct(),
                    },
                })
            }).not.toThrow()
        })

        it("does not throw when window is undefined (SSR environment)", () => {
            const originalWindow = globalThis.window
            // @ts-expect-error Simulating SSR
            delete globalThis.window

            try {
                expect(() => {
                    pixelProvider.track({
                        name: EventName.PURCHASED_PRODUCT,
                        payload: {
                            products: [buildMockBasketItem()],
                            reference: "REF-SSR",
                        },
                    })
                }).not.toThrow()
            } finally {
                globalThis.window = originalWindow
            }
        })
    })
})
