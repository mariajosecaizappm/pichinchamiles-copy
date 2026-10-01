import { beforeEach, describe, expect, it, vi } from "vitest"
import gtmProvider from "@/presentation/analytics/providers/gtmProvider/gtmProvider"
import { EventName } from "@/presentation/analytics/types"
import { Category } from "@/domain/entity/Category/structure/category"
import { PaymentMethod } from "@/domain/entity/Payment/payment"
import { ProductType } from "@/domain/entity/Product/product"
import { BasketItem } from "@/domain/entity/Basket/structure/basket"

const sendGTMEventMock = vi.hoisted(() => vi.fn())

vi.mock("@next/third-parties/google", () => ({
    sendGTMEvent: sendGTMEventMock,
}))

const buildBasketItem = (overrides: Partial<BasketItem> = {}): BasketItem => ({
    id: "basket-1",
    storeId: "store-1",
    supplierId: "supplier-1",
    productId: "product-1",
    variationId: "variation-1",
    categoryId: "category-1",
    quantity: 1,
    brandName: "Brand 1",
    categoryName: "Tecnologia",
    paymentMethod: PaymentMethod.POINTS,
    productType: ProductType.PHYSICAL_PRODUCT,
    description: "",
    slug: "product-1",
    variationInfo: {
        productName: "Product 1",
        productSlug: "product-1",
        stock: 1,
        price: 1,
        pointsPrice: 1000,
        taxes: 0,
        assets: [],
        features: [],
    },
    paymentTypes: {
        coin: {
            currencyId: "coins",
            amount: 500,
        },
        points: {
            currencyId: "miles",
            amount: 1000,
        },
    },
    ...overrides,
})

describe("gtmProvider", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
    })

    it("has the correct provider name", () => {
        expect(gtmProvider.name).toBe("gtm")
    })

    it("includes payload identification on GTM events", () => {
        gtmProvider.track({
            name: EventName.VIEWED_HOME,
            payload: { identification: "123456789" },
        })

        expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
            identification: "123456789",
        }))
    })

    it("omits identification when payload has none", () => {
        gtmProvider.track({
            name: EventName.VIEWED_HOME,
            payload: { identification: undefined },
        })

        const sent = sendGTMEventMock.mock.calls[0][0]
        expect(sent).not.toHaveProperty("identification")
    })

    describe("login funnel events", () => {
        it("tracks OPEN_AUTH_MODAL event", () => {
            gtmProvider.track({
                name: EventName.OPEN_AUTH_MODAL,
                payload: { identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                event: "onclick",
                step_name: "01_PrincipalLogin",
                sub_product: "Login",
            }))
        })

        it("tracks VIEWED_HOME event", () => {
            gtmProvider.track({
                name: EventName.VIEWED_HOME,
                payload: { identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                event: "funnel_step",
                step_name: "01_PrincipalLogin",
                sub_product: "Login",
            }))
        })

        it("tracks VIEWED_IDENTIFICATION_FORM event", () => {
            gtmProvider.track({
                name: EventName.VIEWED_IDENTIFICATION_FORM,
                payload: { identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "02_LoginID",
                event: "funnel_step",
            }))
        })

        it("tracks VERIFY_IDENTIFICATION event", () => {
            gtmProvider.track({
                name: EventName.VERIFY_IDENTIFICATION,
                payload: { identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "02_LoginID",
                event: "onclick",
            }))
        })

        it("tracks VIEWED_PASSWORD_FORM event", () => {
            gtmProvider.track({
                name: EventName.VIEWED_PASSWORD_FORM,
                payload: { identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "03_LoginPass",
                event: "funnel_step",
            }))
        })

        it("tracks VERIFY_PASSWORD event", () => {
            gtmProvider.track({
                name: EventName.VERIFY_PASSWORD,
                payload: { identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "03_LoginPass",
                event: "onclick",
            }))
        })

        it("tracks VIEWED_LOGIN_OTP event", () => {
            gtmProvider.track({
                name: EventName.VIEWED_LOGIN_OTP,
                payload: { identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "04_LoginCodigoVerif",
                event: "funnel_step",
            }))
        })

        it("tracks VERIFY_LOGIN_OTP event", () => {
            gtmProvider.track({
                name: EventName.VERIFY_LOGIN_OTP,
                payload: { identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "04_LoginCodigoVerif",
                event: "onclick",
            }))
        })

        it("tracks LOGIN success with funnel_aux=exito", () => {
            gtmProvider.track({
                name: EventName.LOGIN,
                payload: { status: "success", identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "05_LoginFinal",
                event: "funnel_step",
                funnel_aux: "exito",
            }))
        })

        it("tracks LOGIN error with funnel_aux=error", () => {
            gtmProvider.track({
                name: EventName.LOGIN,
                payload: { status: "error", identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "05_LoginFinal",
                funnel_aux: "error",
            }))
        })
    })

    describe("activation funnel events", () => {
        it("tracks VIEWED_ACTIVATION_OTP event", () => {
            gtmProvider.track({
                name: EventName.VIEWED_ACTIVATION_OTP,
                payload: { identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "02_CodigoVerifi",
                event: "funnel_step",
                sub_product: "Activation",
            }))
        })

        it("tracks VERIFY_ACTIVATION_OTP event", () => {
            gtmProvider.track({
                name: EventName.VERIFY_ACTIVATION_OTP,
                payload: { identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "02_CodigoVerifi",
                event: "onclick",
                sub_product: "Activation",
            }))
        })

        it("tracks VIEWED_ACTIVATION_PASSWORD event", () => {
            gtmProvider.track({
                name: EventName.VIEWED_ACTIVATION_PASSWORD,
                payload: { identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "03_CreaPass",
                event: "funnel_step",
                sub_product: "Activation",
            }))
        })

        it("tracks VERIFY_ACTIVATION_PASSWORD event", () => {
            gtmProvider.track({
                name: EventName.VERIFY_ACTIVATION_PASSWORD,
                payload: { identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "03_CreaPass",
                event: "onclick",
                sub_product: "Activation",
            }))
        })

        it("tracks ACTIVE_ACCOUNT success with funnel_aux=exito", () => {
            gtmProvider.track({
                name: EventName.ACTIVE_ACCOUNT,
                payload: { status: "success", identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "04_ActivationFinal",
                funnel_aux: "exito",
                sub_product: "Activation",
            }))
        })

        it("tracks ACTIVE_ACCOUNT error with funnel_aux=error", () => {
            gtmProvider.track({
                name: EventName.ACTIVE_ACCOUNT,
                payload: { status: "error", identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "04_ActivationFinal",
                funnel_aux: "error",
                sub_product: "Activation",
            }))
        })
    })

    describe("redemption events", () => {
        it.each([
            ["products", "Productos"],
            ["flights", "Vuelos"],
            ["hotels", "Hoteles"],
            ["cars", "Autos"],
            ["activities", "Actividades"],
            ["disney", "Disney"],
        ])("tracks CLICKED_REDEMPTION for tab %s with funnel_aux=%s", (tab, expected) => {
            gtmProvider.track({
                name: EventName.CLICKED_REDEMPTION,
                payload: { tab, identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "01_Principal",
                event: "onclick",
                funnel_aux: expected,
            }))
        })

        it("tracks CLICKED_REDEMPTION with empty funnel_aux for unknown tab", () => {
            gtmProvider.track({
                name: EventName.CLICKED_REDEMPTION,
                payload: { tab: "unknown-tab", identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                funnel_aux: "",
            }))
        })

        describe("CLICKED_FILTERS category type", () => {
            it("tracks parent category (no parent) with 01_Categoria step", () => {
                const category: Category = {
                    id: "cat-1",
                    name: "Electrónica",
                    slug: "electronica",
                    parent: null,
                }

                gtmProvider.track({
                    name: EventName.CLICKED_FILTERS,
                    payload: {
                        filter: category,
                        type: "category",
                        identification: undefined,
                    },
                })

                expect(sendGTMEventMock).toHaveBeenCalledTimes(1)
                expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                    step_name: "01_Categoria",
                    event: "onclick",
                    funnel_aux: "Electrónica",
                }))
            })

            it("tracks subcategory (has parent) with 02_Subcategoria step (two events)", () => {
                const subcategory: Category = {
                    id: "sub-1",
                    name: "Celulares",
                    slug: "celulares",
                    parent: { id: "cat-1", slug: "electronica" },
                }

                gtmProvider.track({
                    name: EventName.CLICKED_FILTERS,
                    payload: {
                        filter: subcategory,
                        type: "category",
                        identification: undefined,
                    },
                })

                expect(sendGTMEventMock).toHaveBeenCalledTimes(2)
                expect(sendGTMEventMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
                    step_name: "02_Subcategoria",
                    event: "funnel_step",
                    funnel_aux: "Celulares",
                }))
                expect(sendGTMEventMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
                    step_name: "02_Subcategoria",
                    event: "onclick",
                    funnel_aux: "Celulares",
                }))
            })

            it("does not track events for brand type filters", () => {
                gtmProvider.track({
                    name: EventName.CLICKED_FILTERS,
                    payload: {
                        filter: { id: "brand-1", name: "Marca 1", slug: "marca-1" },
                        type: "brand",
                        identification: undefined,
                    },
                })

                expect(sendGTMEventMock).not.toHaveBeenCalled()
            })
        })

        it("tracks VIEWED_PRODUCT with category", () => {
            gtmProvider.track({
                name: EventName.VIEWED_PRODUCT,
                payload: { category: "Tecnologia", identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "03_Shopping",
                event: "funnel_step",
                funnel_aux: "Tecnologia",
            }))
        })

        it("tracks ADDED_PRODUCT with category", () => {
            gtmProvider.track({
                name: EventName.ADDED_PRODUCT,
                payload: {
                    product: {} as any,
                    category: "Tecnologia",
                    identification: undefined,
                },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "03_Shopping_Carrito",
                event: "onclick",
                funnel_aux: "Tecnologia",
            }))
        })

        it("tracks VIEWED_COPAYMENT with category", () => {
            gtmProvider.track({
                name: EventName.VIEWED_COPAYMENT,
                payload: { category: "Hogar", identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "03_Shopping_Copago",
                event: "onclick",
                funnel_aux: "Hogar",
            }))
        })

        it("tracks GO_TO_CHECKOUT with category", () => {
            gtmProvider.track({
                name: EventName.GO_TO_CHECKOUT,
                payload: { category: "Tecnologia", identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                step_name: "03_Shopping_VerCarrito",
                event: "onclick",
                funnel_aux: "Tecnologia",
            }))
        })
    })

    describe("checkout flow events", () => {
        const checkoutTestCases: [EventName, string, string][] = [
            [EventName.VIEWED_CHECKOUT_PRODUCTS, "funnel_step", "04_CarritoCompra"],
            [EventName.GO_TO_CHECKOUT_SHIPPING, "onclick", "04_CarritoCompra"],
            [EventName.VIEWED_CHECKOUT_SHIPPING, "funnel_step", "05_CarritoCompra_Direc"],
            [EventName.GO_TO_CHECKOUT_BILLING, "onclick", "05_CarritoCompra_Direc"],
            [EventName.VIEWED_CHECKOUT_BILLING, "funnel_step", "06_CarritoCompra_Fact"],
            [EventName.GO_TO_CHECKOUT_CONFIRMATION, "onclick", "06_CarritoCompra_Fact"],
            [EventName.VIEWED_CHECKOUT_CONFIRMATION, "funnel_step", "07_CarritoCompra_Resum"],
            [EventName.REDEEM_PRODUCT, "onclick", "07_CarritoCompra_Resum"],
        ]

        it.each(checkoutTestCases)(
            "tracks %s with event=%s and step_name=%s",
            (eventName, expectedEvent, expectedStep) => {
                gtmProvider.track({
                    name: eventName,
                    payload: { identification: undefined } as any,
                })

                expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                    event: expectedEvent,
                    step_name: expectedStep,
                }))
            },
        )
    })

    describe("PURCHASED_PRODUCT - localStorage persistence", () => {
        it("stores redemption summary in localStorage with reference key", () => {
            const products = [
                buildBasketItem({
                    paymentTypes: {
                        coin: { currencyId: "coins", amount: 500 },
                        points: { currencyId: "miles", amount: 1000 },
                    },
                    categoryName: "Tecnologia",
                }),
            ]

            gtmProvider.track({
                name: EventName.PURCHASED_PRODUCT,
                payload: {
                    products,
                    reference: "ORD-12345",
                    identification: undefined,
                },
            })

            const stored = localStorage.getItem("ORD-12345")
            expect(stored).not.toBeNull()
            expect(JSON.parse(stored!)).toEqual({
                points: 1000,
                coins: 500,
                category: "Tecnologia",
            })

            expect(sendGTMEventMock).not.toHaveBeenCalled()
        })

        it("sums points and coins across multiple products", () => {
            const products = [
                buildBasketItem({
                    paymentTypes: {
                        coin: { currencyId: "coins", amount: 100 },
                        points: { currencyId: "miles", amount: 200 },
                    },
                    categoryName: "Tecnologia",
                }),
                buildBasketItem({
                    paymentTypes: {
                        coin: { currencyId: "coins", amount: 50 },
                        points: { currencyId: "miles", amount: 300 },
                    },
                    categoryName: "Tecnologia",
                }),
            ]

            gtmProvider.track({
                name: EventName.PURCHASED_PRODUCT,
                payload: {
                    products,
                    reference: "ORD-SUM",
                    identification: undefined,
                },
            })

            const stored = JSON.parse(localStorage.getItem("ORD-SUM")!)
            expect(stored.points).toBe(500)
            expect(stored.coins).toBe(150)
        })

        it("defaults coins to 0 when paymentTypes.coin is undefined", () => {
            const products = [
                buildBasketItem({
                    paymentTypes: {
                        points: { currencyId: "miles", amount: 1000 },
                    },
                    categoryName: "Tecnologia",
                }),
            ]

            gtmProvider.track({
                name: EventName.PURCHASED_PRODUCT,
                payload: {
                    products,
                    reference: "ORD-NOCOIN",
                    identification: undefined,
                },
            })

            const stored = JSON.parse(localStorage.getItem("ORD-NOCOIN")!)
            expect(stored.coins).toBe(0)
            expect(stored.points).toBe(1000)
        })

        it("uses default key 'points-redemption' when reference is not provided", () => {
            const products = [buildBasketItem()]

            gtmProvider.track({
                name: EventName.PURCHASED_PRODUCT,
                payload: {
                    products,
                    reference: "",
                    identification: undefined,
                },
            })

            expect(localStorage.getItem("points-redemption")).not.toBeNull()
        })
    })

    describe("VIEWED_REDEEM_STATUS - reads from localStorage and sends conversion", () => {
        it("sends success and conversion events when stored summary exists with reference", () => {
            localStorage.setItem(
                "ORD-STATUS",
                JSON.stringify({
                    points: 5000,
                    coins: 250,
                    category: "Tecnologia",
                }),
            )

            gtmProvider.track({
                name: EventName.VIEWED_REDEEM_STATUS,
                payload: {
                    reference: "ORD-STATUS",
                    identification: undefined,
                },
            })

            expect(sendGTMEventMock).toHaveBeenCalledTimes(2)
            expect(sendGTMEventMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
                step_name: "08_CarritoCompra_Exitoso",
                event: "funnel_step",
                funnel_aux: "Tecnologia",
            }))
            expect(sendGTMEventMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
                event: "conversion_pmiles",
                sub_product: "redencion",
                miles: 5000,
                value: 250,
                aux2: "Tecnologia",
            }))
        })

        it("falls back to 'points-redemption' key when no reference is provided", () => {
            localStorage.setItem(
                "points-redemption",
                JSON.stringify({
                    points: 1000,
                    coins: 50,
                    category: "Hogar",
                }),
            )

            gtmProvider.track({
                name: EventName.VIEWED_REDEEM_STATUS,
                payload: {
                    identification: undefined,
                },
            })

            expect(sendGTMEventMock).toHaveBeenCalledTimes(2)
            expect(sendGTMEventMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
                miles: 1000,
                value: 50,
                aux2: "Hogar",
            }))
        })

        it("does not send any events when there is no stored summary", () => {
            gtmProvider.track({
                name: EventName.VIEWED_REDEEM_STATUS,
                payload: {
                    reference: "NO-EXIST",
                    identification: undefined,
                },
            })

            expect(sendGTMEventMock).not.toHaveBeenCalled()
        })
    })

    describe("transfer funnel events", () => {
        it("tracks CLICKED_TRANSFER event", () => {
            gtmProvider.track({
                name: EventName.CLICKED_TRANSFER,
                payload: { identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                event: "onclick",
                step_name: "01_PrincipalTransferir",
                sub_product: "transferir",
            }))
        })

        it("tracks VIEWED_TRANSFER event", () => {
            gtmProvider.track({
                name: EventName.VIEWED_TRANSFER,
                payload: { identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                event: "funnel_step",
                step_name: "01_TransferirMillas",
                sub_product: "transferir",
            }))
        })

        it("tracks TRANSFER event", () => {
            gtmProvider.track({
                name: EventName.TRANSFER,
                payload: { identification: undefined },
            })

            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                event: "onclick",
                step_name: "01_TransferirMillas",
                sub_product: "transferir",
            }))
        })

        it("tracks VIEWED_TRANSFER_STATUS success with conversion event", () => {
            gtmProvider.track({
                name: EventName.VIEWED_TRANSFER_STATUS,
                payload: {
                    amount: 1500,
                    status: "success",
                    identification: undefined,
                },
            })

            expect(sendGTMEventMock).toHaveBeenCalledTimes(2)
            expect(sendGTMEventMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
                funnel_aux: "exito",
            }))
            expect(sendGTMEventMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
                event: "conversion_pmiles",
                sub_product: "transferir",
                miles: 1500,
            }))
        })

        it("tracks VIEWED_TRANSFER_STATUS error without conversion event", () => {
            gtmProvider.track({
                name: EventName.VIEWED_TRANSFER_STATUS,
                payload: {
                    amount: 1500,
                    status: "error",
                    identification: undefined,
                },
            })

            expect(sendGTMEventMock).toHaveBeenCalledTimes(1)
            expect(sendGTMEventMock).toHaveBeenCalledWith(expect.objectContaining({
                funnel_aux: "error",
            }))
        })
    })

    describe("events without handler (default case)", () => {
        it("does not send GTM events for VIEWED_PRODUCTS", () => {
            gtmProvider.track({
                name: EventName.VIEWED_PRODUCTS,
                payload: { products: [], identification: undefined },
            })

            expect(sendGTMEventMock).not.toHaveBeenCalled()
        })

        it("does not send GTM events for VIEWED_FILTER", () => {
            gtmProvider.track({
                name: EventName.VIEWED_FILTER,
                payload: { filters: [], identification: undefined },
            })

            expect(sendGTMEventMock).not.toHaveBeenCalled()
        })

        it("does not send GTM events for CLICKED_PRODUCT", () => {
            gtmProvider.track({
                name: EventName.CLICKED_PRODUCT,
                payload: { product: {} as any, identification: undefined },
            })

            expect(sendGTMEventMock).not.toHaveBeenCalled()
        })
    })
})
