import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { PaymentMethod } from "@/domain/entity/Payment/payment";
import { ProductType } from "@/domain/entity/Product/product";
import {
    getUpdatedBasketItem,
    useShoppingCartBasket,
} from "@/presentation/pages/ShoppingCartDetail/hooks/useShoppingCartBasket";

const mocks = vi.hoisted(() => {
    const updateBasket = vi.fn();
    const getBasket = vi.fn();
    const updateBasketRepo = vi.fn();
    const removeBasketItem = vi.fn();
    const getBasketUseCase = {
        getBasket,
        updateBasket: updateBasketRepo,
        removeBasketItem,
    };

    return {
        updateBasket,
        getBasket,
        updateBasketRepo,
        removeBasketItem,
        getBasketUseCase,
        containerGet: vi.fn(() => getBasketUseCase),
    };
});

vi.mock("@/presentation/hooks/useSession", () => ({
    default: () => ({
        updateBasket: mocks.updateBasket,
    }),
}));

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}));

describe("useShoppingCartBasket", () => {
    const basket = {
        buyerId: "buyer-1",
        items: [
            {
                id: "1",
                storeId: "store",
                supplierId: "supplier",
                productId: "product",
                variationId: "variation",
                categoryId: "cat",
                quantity: 1,
                brandName: "Truper",
                categoryName: "Herramientas",
                paymentMethod: PaymentMethod.POINTS,
                productType: ProductType.PHYSICAL_PRODUCT,
                description: "desc",
                slug: "slug",
                isAvailability: true,
                queryId: undefined,
                options: [],
                variationInfo: {
                    productName: "Podadora",
                    productSlug: "podadora",
                    stock: 6,
                    price: 10,
                    pointsPrice: 1000,
                    taxes: 0,
                    assets: [],
                    features: [],
                },
                paymentTypes: {
                    points: { currencyId: "pts", amount: 1000 },
                },
            },
        ],
    } as any;

    beforeEach(() => {
        mocks.updateBasket.mockReset();
        mocks.getBasket.mockReset();
        mocks.updateBasketRepo.mockReset();
        mocks.removeBasketItem.mockReset();

        mocks.getBasket.mockResolvedValue(basket);
        mocks.updateBasketRepo.mockResolvedValue(basket);
        mocks.removeBasketItem.mockResolvedValue({ buyerId: "buyer-1", items: [] });
    });

    it("should expose calculated totals", () => {
        const { result } = renderHook(() => useShoppingCartBasket(basket));

        expect(result.current.items).toHaveLength(1);
        expect(result.current.pointsAmountTotal).toBe(1000);
        expect(result.current.copaymentSubtotal).toBe(0);
        expect(result.current.hasDisabledProducts).toBe(false);
    });

    it("should update quantity and persist basket", async () => {
        const { result } = renderHook(() => useShoppingCartBasket(basket));

        await act(async () => {
            await result.current.onChangeQuantity("1", 2);
        });

        expect(mocks.updateBasketRepo).toHaveBeenCalledTimes(1);
        expect(mocks.updateBasket).toHaveBeenCalledWith(basket);
    });

    it("should scale copayment miles and dollars when quantity increases", async () => {
        const copaymentBasket = {
            ...basket,
            items: [
                {
                    ...basket.items[0],
                    paymentMethod: PaymentMethod.COPAYMENT,
                    quantity: 1,
                    variationInfo: {
                        ...basket.items[0].variationInfo,
                        stock: 5,
                        pointsPrice: 45917,
                        price: 512.28,
                        copayment: {
                            initialization: { points: 9326, coins: 512.28 },
                            minimumPointsValue: 9326,
                            pointsConversionRatePercentage: Buffer.from(
                                Buffer.from("0.01").toString("base64")
                            ).toString("base64"),
                        },
                    },
                    paymentTypes: {
                        points: { currencyId: "pts", amount: 9326 },
                        coin: { currencyId: "usd", amount: 512.28 },
                    },
                },
            ],
        } as typeof basket;

        mocks.updateBasketRepo.mockImplementation(async (nextBasket: typeof copaymentBasket) => nextBasket);

        const { result } = renderHook(() => useShoppingCartBasket(copaymentBasket));

        await act(async () => {
            await result.current.onChangeQuantity("1", 2);
        });

        expect(mocks.updateBasketRepo).toHaveBeenCalledWith(
            expect.objectContaining({
                items: [
                    expect.objectContaining({
                        quantity: 2,
                        paymentTypes: expect.objectContaining({
                            points: expect.objectContaining({ amount: 18652 }),
                            coin: expect.objectContaining({ amount: 1024.56 }),
                        }),
                    }),
                ],
            })
        );
    });

    it("should scale customized copayment split proportionally on quantity change", async () => {
        const copaymentBasket = {
            ...basket,
            items: [
                {
                    ...basket.items[0],
                    paymentMethod: PaymentMethod.COPAYMENT,
                    quantity: 1,
                    variationInfo: {
                        ...basket.items[0].variationInfo,
                        stock: 5,
                        pointsPrice: 10000,
                        price: 100,
                        copayment: {
                            initialization: { points: 2000, coins: 80 },
                            minimumPointsValue: 2000,
                            pointsConversionRatePercentage: Buffer.from(
                                Buffer.from("0.01").toString("base64")
                            ).toString("base64"),
                        },
                    },
                    paymentTypes: {
                        points: { currencyId: "pts", amount: 5000 },
                        coin: { currencyId: "usd", amount: 50 },
                    },
                },
            ],
        } as typeof basket;

        mocks.updateBasketRepo.mockImplementation(async (nextBasket: typeof copaymentBasket) => nextBasket);

        const { result } = renderHook(() => useShoppingCartBasket(copaymentBasket));

        await act(async () => {
            await result.current.onChangeQuantity("1", 3);
        });

        expect(mocks.updateBasketRepo).toHaveBeenCalledWith(
            expect.objectContaining({
                items: [
                    expect.objectContaining({
                        quantity: 3,
                        paymentTypes: expect.objectContaining({
                            points: expect.objectContaining({ amount: 15000 }),
                            coin: expect.objectContaining({ amount: 150 }),
                        }),
                    }),
                ],
            })
        );
    });

    it("should remove item and update session basket", async () => {
        const { result } = renderHook(() => useShoppingCartBasket(basket));

        await act(async () => {
            await result.current.onRemoveItem("1");
        });

        expect(mocks.removeBasketItem).toHaveBeenCalledWith("1", basket);
        expect(mocks.updateBasket).toHaveBeenCalledWith({ buyerId: "buyer-1", items: [] });
    });

    it("should calculate copayment totals with taxes", () => {
        const copaymentBasket = {
            ...basket,
            items: [
                {
                    ...basket.items[0],
                    variationInfo: {
                        ...basket.items[0].variationInfo,
                        taxes: 12,
                    },
                    paymentTypes: {
                        points: { currencyId: "pts", amount: 500 },
                        coin: { currencyId: "usd", amount: 11.2 },
                    },
                },
            ],
        } as typeof basket;

        const { result } = renderHook(() => useShoppingCartBasket(copaymentBasket));

        expect(result.current.hasCopayment).toBe(true);
        expect(result.current.copaymentTotal).toBe(11.2);
        expect(result.current.copaymentSubtotal).toBe(10);
        expect(result.current.copaymentTaxes).toBe(1.2);
    });

    it("should detect disabled products when unavailable or out of stock", () => {
        const disabledBasket = {
            ...basket,
            items: [
                { ...basket.items[0], isAvailability: false },
                {
                    ...basket.items[0],
                    id: "2",
                    isAvailability: true,
                    variationInfo: { ...basket.items[0].variationInfo, stock: 0 },
                },
            ],
        } as typeof basket;

        const { result } = renderHook(() => useShoppingCartBasket(disabledBasket));

        expect(result.current.hasDisabledProducts).toBe(true);
    });

    it("should update basket item via onUpdateBasketItem", async () => {
        const { result } = renderHook(() => useShoppingCartBasket(basket));
        const updatedItem = { ...basket.items[0], quantity: 3 };

        await act(async () => {
            await result.current.onUpdateBasketItem(updatedItem);
        });

        expect(mocks.updateBasketRepo).toHaveBeenCalledWith(
            expect.objectContaining({
                items: [expect.objectContaining({ quantity: 3 })],
            })
        );
    });

    it("should clear changed basket items", async () => {
        const changedBasket = {
            ...basket,
            items: [
                {
                    ...basket.items[0],
                    isAvailability: false,
                },
            ],
        };

        mocks.getBasket.mockResolvedValue(changedBasket);
        mocks.updateBasketRepo.mockResolvedValue(changedBasket);

        const { result } = renderHook(() => useShoppingCartBasket(basket));

        await act(async () => {
            await result.current.verifyShoppingCart(false);
        });

        expect(result.current.changedBasketItems).not.toBeNull();

        act(() => {
            result.current.clearChangedBasketItems();
        });

        expect(result.current.changedBasketItems).toBeNull();
    });

    it("should return false from verifyShoppingCart when price changes are detected", async () => {
        const changedBasket = {
            ...basket,
            items: [
                {
                    ...basket.items[0],
                    variationInfo: {
                        ...basket.items[0].variationInfo,
                        priceChanged: true,
                    },
                },
            ],
        };

        mocks.getBasket.mockResolvedValue(changedBasket);
        mocks.updateBasketRepo.mockResolvedValue(changedBasket);

        const { result } = renderHook(() => useShoppingCartBasket(basket));

        let verified = true;
        await act(async () => {
            verified = await result.current.verifyShoppingCart(false);
        });

        expect(verified).toBe(false);
        expect(result.current.changedBasketItems?.changedPriceProducts).toHaveLength(1);
    });

    it("should return true from verifyShoppingCart when no changes exist", async () => {
        mocks.getBasket.mockResolvedValue(basket);

        const { result } = renderHook(() => useShoppingCartBasket(basket));

        let verified = false;
        await act(async () => {
            verified = await result.current.verifyShoppingCart(false);
        });

        expect(verified).toBe(true);
    });

    it("should clamp quantity to stock on change", async () => {
        const { result } = renderHook(() => useShoppingCartBasket(basket));

        await act(async () => {
            await result.current.onChangeQuantity("1", 99);
        });

        expect(mocks.updateBasketRepo).toHaveBeenCalledWith(
            expect.objectContaining({
                items: [expect.objectContaining({ quantity: 6 })],
            })
        );
    });

    it("should clamp quantity using consolidated stock across payment methods", async () => {
        const consolidatedBasket = {
            ...basket,
            items: [
                { ...basket.items[0], id: "1", quantity: 4 },
                {
                    ...basket.items[0],
                    id: "2",
                    quantity: 2,
                    paymentMethod: PaymentMethod.COPAYMENT,
                    variationInfo: {
                        ...basket.items[0].variationInfo,
                        copayment: {
                            initialization: { points: 500, coins: 2 },
                            minimumPointsValue: 100,
                            pointsConversionRatePercentage: "MTAw",
                        },
                    },
                    paymentTypes: {
                        points: { currencyId: "pts", amount: 1000 },
                        coin: { currencyId: "usd", amount: 4 },
                    },
                },
            ],
        } as typeof basket;

        const { result } = renderHook(() => useShoppingCartBasket(consolidatedBasket));

        expect(result.current.getMaxQuantity("1")).toBe(4);
        expect(result.current.getMaxQuantity("2")).toBe(2);

        await act(async () => {
            await result.current.onChangeQuantity("1", 5);
        });

        expect(mocks.updateBasketRepo).toHaveBeenCalledWith(
            expect.objectContaining({
                items: expect.arrayContaining([
                    expect.objectContaining({ id: "1", quantity: 4 }),
                    expect.objectContaining({ id: "2", quantity: 2 }),
                ]),
            })
        );
    });

    it("should detect consolidated stock overflow on verify", async () => {
        const overflowBasket = {
            ...basket,
            items: [
                { ...basket.items[0], id: "1", quantity: 4 },
                {
                    ...basket.items[0],
                    id: "2",
                    quantity: 3,
                    paymentMethod: PaymentMethod.COPAYMENT,
                    variationInfo: {
                        ...basket.items[0].variationInfo,
                        copayment: {
                            initialization: { points: 500, coins: 2 },
                            minimumPointsValue: 100,
                            pointsConversionRatePercentage: "MTAw",
                        },
                    },
                    paymentTypes: {
                        points: { currencyId: "pts", amount: 1500 },
                        coin: { currencyId: "usd", amount: 6 },
                    },
                },
            ],
        } as typeof basket;

        mocks.getBasket.mockResolvedValue(overflowBasket);
        mocks.updateBasketRepo.mockResolvedValue(overflowBasket);

        const { result } = renderHook(() => useShoppingCartBasket(basket));

        let verified = true;
        await act(async () => {
            verified = await result.current.verifyShoppingCart(false);
        });

        expect(verified).toBe(false);
        expect(result.current.changedBasketItems?.changedStockProducts.length).toBeGreaterThan(0);
        expect(mocks.updateBasketRepo).toHaveBeenCalledWith(
            expect.objectContaining({
                items: expect.arrayContaining([
                    expect.objectContaining({ id: "1", quantity: 4 }),
                    expect.objectContaining({ id: "2", quantity: 2 }),
                ]),
            })
        );
    });

    it("should not change quantity when item is not found", async () => {
        const { result } = renderHook(() => useShoppingCartBasket(basket));

        await act(async () => {
            await result.current.onChangeQuantity("missing", 2);
        });

        expect(mocks.updateBasketRepo).not.toHaveBeenCalled();
    });

    it("should clamp quantity below 1 to minimum of 1", async () => {
        mocks.updateBasketRepo.mockImplementation(async (nextBasket: typeof basket) => nextBasket);

        const { result } = renderHook(() => useShoppingCartBasket(basket));

        await act(async () => {
            await result.current.onChangeQuantity("1", 0);
        });

        expect(mocks.updateBasketRepo).toHaveBeenCalledWith(
            expect.objectContaining({
                items: [expect.objectContaining({ quantity: 1 })],
            })
        );
    });

    it("should treat missing points amount as zero in totals", () => {
        const noPointsBasket = {
            ...basket,
            items: [
                {
                    ...basket.items[0],
                    paymentTypes: {},
                },
            ],
        } as typeof basket;

        const { result } = renderHook(() => useShoppingCartBasket(noPointsBasket));

        expect(result.current.pointsAmountTotal).toBe(0);
    });

    it("should default items to empty array when basket items is undefined", () => {
        const emptyBasket = { buyerId: "buyer-1" } as typeof basket;

        const { result } = renderHook(() => useShoppingCartBasket(emptyBasket));

        expect(result.current.items).toEqual([]);
        expect(result.current.pointsAmountTotal).toBe(0);
        expect(result.current.hasCopayment).toBe(false);
    });

    it("should return false from verifyShoppingCart when basket is null", async () => {
        mocks.getBasket.mockResolvedValue(null);

        const { result } = renderHook(() => useShoppingCartBasket(basket));

        let verified = true;
        await act(async () => {
            verified = await result.current.verifyShoppingCart(false);
        });

        expect(verified).toBe(false);
    });

    it("should fall back to nextBasket when updateBasket returns null during verify", async () => {
        const changedBasket = {
            ...basket,
            items: [
                {
                    ...basket.items[0],
                    variationInfo: {
                        ...basket.items[0].variationInfo,
                        priceChanged: true,
                    },
                },
            ],
        };

        mocks.getBasket.mockResolvedValue(changedBasket);
        mocks.updateBasketRepo.mockResolvedValue(null);

        const { result } = renderHook(() => useShoppingCartBasket(basket));

        await act(async () => {
            await result.current.verifyShoppingCart(false);
        });

        expect(mocks.updateBasket).toHaveBeenCalledWith(
            expect.objectContaining({
                items: [expect.objectContaining({ id: "1" })],
            })
        );
    });

    it("should adjust stock-changed items and filter unavailable ones on verify", async () => {
        const changedBasket = {
            ...basket,
            items: [
                {
                    ...basket.items[0],
                    quantity: 5,
                    variationInfo: {
                        ...basket.items[0].variationInfo,
                        stock: 2,
                        stockChanged: true,
                    },
                },
                {
                    ...basket.items[0],
                    id: "2",
                    isAvailability: false,
                },
            ],
        };

        mocks.getBasket.mockResolvedValue(changedBasket);
        mocks.updateBasketRepo.mockImplementation(async (nextBasket: typeof changedBasket) => nextBasket);

        const { result } = renderHook(() => useShoppingCartBasket(basket));

        let verified = true;
        await act(async () => {
            verified = await result.current.verifyShoppingCart(false);
        });

        expect(verified).toBe(false);
        expect(result.current.changedBasketItems?.changedStockProducts).toHaveLength(1);
        expect(result.current.changedBasketItems?.disabledProducts).toHaveLength(1);
        expect(mocks.updateBasketRepo).toHaveBeenCalledWith(
            expect.objectContaining({
                items: [
                    expect.objectContaining({
                        id: "1",
                        quantity: 2,
                    }),
                ],
            })
        );
    });

    it("should detect pointsPriceChanged products on verify", async () => {
        const changedBasket = {
            ...basket,
            items: [
                {
                    ...basket.items[0],
                    variationInfo: {
                        ...basket.items[0].variationInfo,
                        pointsPriceChanged: true,
                    },
                },
            ],
        };

        mocks.getBasket.mockResolvedValue(changedBasket);
        mocks.updateBasketRepo.mockResolvedValue(changedBasket);

        const { result } = renderHook(() => useShoppingCartBasket(basket));

        let verified = true;
        await act(async () => {
            verified = await result.current.verifyShoppingCart(false);
        });

        expect(verified).toBe(false);
        expect(result.current.changedBasketItems?.changedPriceProducts).toHaveLength(1);
    });

    it("should leave unchanged items as-is when verifying mixed basket", async () => {
        const changedBasket = {
            ...basket,
            items: [
                {
                    ...basket.items[0],
                    variationInfo: {
                        ...basket.items[0].variationInfo,
                        priceChanged: true,
                    },
                },
                {
                    ...basket.items[0],
                    id: "2",
                    variationInfo: {
                        ...basket.items[0].variationInfo,
                        stockChanged: false,
                        priceChanged: false,
                        pointsPriceChanged: false,
                    },
                },
            ],
        };

        mocks.getBasket.mockResolvedValue(changedBasket);
        mocks.updateBasketRepo.mockImplementation(async (nextBasket: typeof changedBasket) => nextBasket);

        const { result } = renderHook(() => useShoppingCartBasket(basket));

        await act(async () => {
            await result.current.verifyShoppingCart(false);
        });

        expect(mocks.updateBasketRepo).toHaveBeenCalledWith(
            expect.objectContaining({
                items: expect.arrayContaining([
                    expect.objectContaining({ id: "1" }),
                    expect.objectContaining({ id: "2", quantity: 1 }),
                ]),
            })
        );
    });

    it("should keep other items unchanged when updating one basket item", async () => {
        const multiItemBasket = {
            ...basket,
            items: [
                basket.items[0],
                { ...basket.items[0], id: "2", quantity: 2 },
            ],
        } as typeof basket;

        mocks.updateBasketRepo.mockImplementation(async (nextBasket: typeof multiItemBasket) => nextBasket);

        const { result } = renderHook(() => useShoppingCartBasket(multiItemBasket));
        const updatedItem = { ...basket.items[0], quantity: 4 };

        await act(async () => {
            await result.current.onUpdateBasketItem(updatedItem);
        });

        expect(mocks.updateBasketRepo).toHaveBeenCalledWith(
            expect.objectContaining({
                items: [
                    expect.objectContaining({ id: "1", quantity: 4 }),
                    expect.objectContaining({ id: "2", quantity: 2 }),
                ],
            })
        );
    });

    it("should keep other items unchanged when changing quantity of one item", async () => {
        const multiItemBasket = {
            ...basket,
            items: [
                basket.items[0],
                { ...basket.items[0], id: "2", quantity: 3 },
            ],
        } as typeof basket;

        mocks.updateBasketRepo.mockImplementation(async (nextBasket: typeof multiItemBasket) => nextBasket);

        const { result } = renderHook(() => useShoppingCartBasket(multiItemBasket));

        await act(async () => {
            await result.current.onChangeQuantity("1", 2);
        });

        expect(mocks.updateBasketRepo).toHaveBeenCalledWith(
            expect.objectContaining({
                items: [
                    expect.objectContaining({ id: "1", quantity: 2 }),
                    expect.objectContaining({ id: "2", quantity: 3 }),
                ],
            })
        );
    });

    describe("getUpdatedBasketItem", () => {
        it("should clamp quantity to stock and reformat payment types", () => {
            const item = {
                ...basket.items[0],
                quantity: 2,
                paymentTypes: {
                    points: { currencyId: "pts", amount: 2000 },
                },
                variationInfo: {
                    ...basket.items[0].variationInfo,
                    stock: 3,
                    pointsPrice: 1000,
                },
            };

            const result = getUpdatedBasketItem(item as any, 10);

            expect(result.quantity).toBe(3);
            expect(result.paymentTypes.points.amount).toBe(3000);
        });

        it("should scale copayment amounts when quantity is within stock", () => {
            const item = {
                ...basket.items[0],
                paymentMethod: PaymentMethod.COPAYMENT,
                quantity: 1,
                paymentTypes: {
                    points: { currencyId: "pts", amount: 1000 },
                    coin: { currencyId: "usd", amount: 10 },
                },
                variationInfo: {
                    ...basket.items[0].variationInfo,
                    stock: 5,
                },
            };

            const result = getUpdatedBasketItem(item as any, 2);

            expect(result.quantity).toBe(2);
            expect(result.paymentTypes.points.amount).toBe(2000);
            expect(result.paymentTypes.coin?.amount).toBe(20);
        });

        it("should reformat points payment when quantity is within stock", () => {
            const item = {
                ...basket.items[0],
                paymentMethod: PaymentMethod.POINTS,
                quantity: 1,
                paymentTypes: {
                    points: { currencyId: "pts", amount: 1000 },
                },
                variationInfo: {
                    ...basket.items[0].variationInfo,
                    stock: 5,
                    pointsPrice: 1000,
                },
            };

            const result = getUpdatedBasketItem(item as any, 3);

            expect(result.quantity).toBe(3);
            expect(result.paymentTypes.points.amount).toBe(3000);
        });
    });
});

