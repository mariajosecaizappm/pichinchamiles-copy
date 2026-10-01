import {describe, it, expect} from "vitest"
import {
    addBasketItemAdapter,
    getBasketAdapter,
    updateBasketAdapter,
} from "@/data/adapters/Basket/basketAdapter"

describe("basketAdapter", () => {
    describe("when getBasketAdapter is called", () => {
        it("should map raw basket into domain Basket including optional coin", () => {
            const raw = {
                buyerId: "buyer-1",
                items: [
                    {
                        id: "it-1",
                        storeId: "st-1",
                        supplierId: "sup-1",
                        productId: "p-1",
                        variationId: "v-1",
                        categoryId: "cat-1",
                        quantity: 2,
                        comments: "note",
                        brandName: "Brand",
                        categoryName: "Category",
                        paymentMethod: "points",
                        productType: "physical",
                        description: "desc",
                        slug: "product-slug",
                        isAvailability: true,
                        variationInfo: {
                            productName: "Prod",
                            productNameChanged: false,
                            productSlug: "prod",
                            productSlugChanged: false,
                            stock: 10,
                            stockChanged: false,
                            price: 100,
                            priceChanged: false,
                            pointsPrice: 1000,
                            pointsPriceChanged: false,
                            taxes: 12,
                            copayment: {
                                points: 100,
                                coins: 5,
                                pointsConversionRatePercentage: 10,
                                minimumPointsValue: 50,
                            },
                            assets: [
                                {
                                    type: "image",
                                    htmlAlternative: "alt",
                                    order: 1,
                                    desktopUrl: "d.jpg",
                                    mobileUrl: "m.jpg",
                                },
                            ],
                            features: [{name: "Color", option: "Red"}],
                        },
                        paymentTypes: {
                            points: {amount: 1000, currencyId: "PTS"},
                            coin: {amount: 5, currencyId: "USD"},
                            pointsConversionRatePercentage: "abc",
                        },
                    },
                ],
            }

            const basket = getBasketAdapter(raw as any)

            expect(basket.buyerId).toBe("buyer-1")
            expect(basket.items).toHaveLength(1)
            const item = basket.items[0]
            expect(item.id).toBe("it-1")
            expect(item.variationInfo.assets[0]).toEqual({
                type: "image",
                htmlAlternative: "alt",
                order: 1,
                desktopUrl: "d.jpg",
                mobileUrl: "m.jpg",
            })
            expect(item.paymentTypes.points).toEqual({
                amount: 1000,
                currencyId: "PTS",
            })
            expect(item.paymentTypes.pointsConversionRatePercentage).toBe("abc")
            expect(item.paymentTypes.coin).toEqual({
                amount: 5,
                currencyId: "USD",
            })
            expect(item.variationInfo.copayment?.initialization).toEqual({
                points: 100,
                coins: 5,
            })
        })

        it("should omit coin in paymentTypes when not present", () => {
            const raw = {
                buyerId: "buyer-1",
                items: [
                    {
                        id: "it-1",
                        storeId: "st-1",
                        supplierId: "sup-1",
                        productId: "p-1",
                        variationId: "v-1",
                        categoryId: "cat-1",
                        quantity: 1,
                        comments: "",
                        brandName: "Brand",
                        categoryName: "Category",
                        paymentMethod: "points",
                        productType: "physical",
                        description: "desc",
                        slug: "product-slug",
                        isAvailability: true,
                        variationInfo: {
                            productName: "Prod",
                            productNameChanged: false,
                            productSlug: "prod",
                            productSlugChanged: false,
                            stock: 10,
                            stockChanged: false,
                            price: 100,
                            priceChanged: false,
                            pointsPrice: 1000,
                            pointsPriceChanged: false,
                            taxes: 12,
                            copayment: undefined,
                            assets: [],
                            features: [],
                        },
                        paymentTypes: {
                            points: {amount: 1000, currencyId: "PTS"},
                        },
                    },
                ],
            }

            const basket = getBasketAdapter(raw as any)
            expect(basket.items[0].paymentTypes.coin).toBeUndefined()
        })
    })

    describe("when updateBasketAdapter is called", () => {
        it("should filter unavailable items and produce API payload shape", () => {
            const basket = {
                items: [
                    {
                        storeId: "st-1",
                        supplierId: "sup-1",
                        productId: "p-1",
                        variationId: "v-1",
                        categoryId: "cat-1",
                        quantity: 2,
                        comments: "note",
                        productType: "physical",
                        brandName: "Brand",
                        categoryName: "Category",
                        slug: "product-slug",
                        isAvailability: true,
                        description: "desc",
                        variationInfo: {
                            productName: "Prod",
                            productSlug: "prod",
                            stock: 10,
                            price: 100,
                            pointsPrice: 1000,
                            taxes: 12,
                            copayment: {
                                initialization: {points: 100, coins: 5},
                                pointsConversionRatePercentage: 10,
                                minimumPointsValue: 50,
                            },
                            assets: [
                                {
                                    type: "image",
                                    desktopUrl: "d.jpg",
                                    mobileUrl: "m.jpg",
                                    order: 1,
                                },
                            ],
                            features: [{name: "Color", option: "Red"}],
                        },
                        paymentTypes: {
                            points: {currencyId: "PTS", amount: 1000},
                            coin: {currencyId: "USD", amount: 5},
                            pointsConversionRatePercentage: "rate",
                        },
                    },
                    {
                        storeId: "st-2",
                        supplierId: "sup-2",
                        productId: "p-2",
                        variationId: "v-2",
                        categoryId: "cat-2",
                        quantity: 1,
                        comments: "",
                        productType: "virtual",
                        brandName: "Brand2",
                        categoryName: "Category2",
                        slug: "product-2",
                        isAvailability: false,
                        description: "desc2",
                        variationInfo: {
                            productName: "Prod2",
                            productSlug: "prod2",
                            stock: 5,
                            price: 50,
                            pointsPrice: 500,
                            taxes: 8,
                            copayment: undefined,
                            assets: [],
                            features: [],
                        },
                        paymentTypes: {
                            points: {currencyId: "PTS", amount: 500},
                        },
                    },
                ],
            }

            const payload = updateBasketAdapter(basket as any)

            expect(payload.items).toHaveLength(1)
            const item = payload.items[0]
            expect(item.variationInfo.copayment).toEqual({
                points: 100,
                coins: 5,
                pointsConversionRatePercentage: 10,
                minimumPointsValue: 50,
            })
            expect(item.paymentTypes.points).toEqual({
                currencyId: "PTS",
                amount: 1000,
            })
            expect(item.paymentTypes.coin).toEqual({
                currencyId: "USD",
                amount: 5,
            })
            expect(item.paymentTypes.pointsConversionRatePercentage).toBe("rate")
            expect(item.variationInfo.assets[0]).toEqual({
                type: "image",
                desktopUrl: "d.jpg",
                mobileUrl: "m.jpg",
                order: 1,
            })
            expect(item.variationInfo.features[0]).toEqual({
                name: "Color",
                option: "Red",
            })
        })
    })

    describe("when addBasketItemAdapter is called", () => {
        it("should create payload with item when basket is null", () => {
            const newBasketItem = {
                product: {
                    id: "p1",
                    slug: "prod-1",
                    name: "Prod",
                    description: "Desc",
                    supplierId: "s1",
                    store: { id: "store-1" },
                    brand: { name: "Brand" },
                    categories: [{ id: "cat-1", name: "Cat" }],
                    productType: "physical",
                    assets: [{ type: "image", desktopUrl: "d", mobileUrl: "m", order: 1 }],
                    searchEngine: { queryID: "q1" },
                },
                variation: {
                    id: "v1",
                    stock: 2,
                    price: 20,
                    taxes: 1,
                    pointsPrice: 100,
                    copayment: {
                        initialization: { points: 50, coins: 2 },
                        pointsConversionRatePercentage: "x",
                        minimumPointsValue: 20,
                    },
                    features: [{ name: "Color", option: "Red" }],
                    assets: [],
                },
                pointsCurrencyId: "PTS",
                pointsTotal: 200,
                coinsCurrencyId: "USD",
                coinsTotal: 5,
                quantity: 2,
            } as any

            const payload = addBasketItemAdapter(newBasketItem, null)
            expect(payload.items).toHaveLength(1)
            expect(payload.items[0].paymentTypes.coin).toEqual({ currencyId: "USD", amount: 5 })
        })

        it("should append item when basket already exists", () => {
            const existingBasket = {
                items: [
                    {
                        isAvailability: true,
                        storeId: "st-1",
                        supplierId: "sup-1",
                        productId: "p-1",
                        variationId: "v-1",
                        categoryId: "c-1",
                        quantity: 1,
                        comments: "",
                        productType: "physical",
                        brandName: "B",
                        categoryName: "C",
                        slug: "s",
                        queryId: "q",
                        description: "d",
                        variationInfo: {
                            productName: "P",
                            productSlug: "ps",
                            stock: 1,
                            price: 1,
                            pointsPrice: 1,
                            taxes: 0,
                            copayment: undefined,
                            assets: [],
                            features: [],
                        },
                        paymentTypes: {
                            points: { currencyId: "PTS", amount: 1 },
                        },
                    },
                ],
            } as any
            const newBasketItem = {
                product: {
                    id: "p2",
                    slug: "prod-2",
                    name: "Prod2",
                    description: "Desc2",
                    supplierId: "s2",
                    store: { id: "store-2" },
                    brand: { name: "Brand2" },
                    categories: [{ id: "cat-2", name: "Cat2" }],
                    productType: "physical",
                    assets: [{ type: "image", desktopUrl: "d", mobileUrl: "m", order: 1 }],
                    searchEngine: { queryID: "q2" },
                },
                variation: {
                    id: "v2",
                    stock: 2,
                    price: 20,
                    taxes: 1,
                    pointsPrice: 200,
                    copayment: undefined,
                    features: [],
                    assets: [],
                },
                pointsCurrencyId: "PTS",
                pointsTotal: 200,
                quantity: 1,
            } as any

            const payload = addBasketItemAdapter(newBasketItem, existingBasket)
            expect(payload.items).toHaveLength(2)
        })
    })

})
