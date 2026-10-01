import { describe, it, expect } from "vitest"
import ShoppingCart from "@/domain/entity/Basket/models/ShoppingCart"
import { Basket, BasketProduct } from "@/domain/entity/Basket/structure/basket"
import { PaymentMethod } from "@/domain/entity/Payment/payment"

const makeProduct = (overrides: Partial<BasketProduct> = {}): BasketProduct => ({
    product: {
        id: "prod-1",
        name: "Test Product",
        slug: "test-product",
        description: "desc",
        brand: { name: "Brand" },
        store: { id: "store-1" },
        supplierId: "supplier-1",
        categories: [{ id: "cat-1", name: "Category" }],
        productType: "physical",
        searchEngine: { queryID: "qid-1" },
        assets: [],
        tags: [],
        features: [],
        minPointsPrice: 500,
    } as unknown as BasketProduct["product"],
    variation: {
        id: "var-1",
        pointsPrice: 500,
        price: 100,
        stock: 10,
        taxes: 0,
        copayment: null,
        assets: [],
        features: [{ name: "Color", option: "Red" }],
    } as unknown as BasketProduct["variation"],
    coinsCurrencyId: "coins-ccy",
    pointsCurrencyId: "points-ccy",
    paymentType: PaymentMethod.POINTS,
    points: 500,
    coins: 0,
    quantity: 1,
    ...overrides,
})

describe("ShoppingCart", () => {
    it("should create an empty basket when initialized with null", () => {
        const cart = new ShoppingCart(null)
        const result = cart.addProduct(makeProduct())
        expect(result.items).toHaveLength(1)
    })

    it("should initialize from an existing basket", () => {
        const existing: Basket = {
            buyerId: "buyer-1",
            items: [],
        }
        const cart = new ShoppingCart(existing)
        const result = cart.addProduct(makeProduct())
        expect(result.items).toHaveLength(1)
    })

    it("should add a new item when basket is empty", () => {
        const cart = new ShoppingCart(null)
        const result = cart.addProduct(makeProduct())
        expect(result.items).toHaveLength(1)
        expect(result.items[0].variationId).toBe("var-1")
        expect(result.items[0].quantity).toBe(1)
    })

    it("should add a new item with correct product info", () => {
        const cart = new ShoppingCart(null)
        const result = cart.addProduct(makeProduct())
        const item = result.items[0]
        expect(item.productId).toBe("prod-1")
        expect(item.storeId).toBe("store-1")
        expect(item.brandName).toBe("Brand")
        expect(item.categoryId).toBe("cat-1")
        expect(item.categoryName).toBe("Category")
        expect(item.slug).toBe("test-product")
        expect(item.variationInfo.productName).toBe("Test Product")
        expect(item.variationInfo.pointsPrice).toBe(500)
    })

    it("should add points payment type correctly", () => {
        const cart = new ShoppingCart(null)
        const result = cart.addProduct(makeProduct({ points: 500, coins: 0 }))
        const item = result.items[0]
        expect(item.paymentTypes.points.amount).toBe(500)
        expect(item.paymentTypes.points.currencyId).toBe("points-ccy")
        expect(item.paymentTypes.coin).toBeUndefined()
    })

    it("should add coin payment type when coins > 0", () => {
        const cart = new ShoppingCart(null)
        const result = cart.addProduct(makeProduct({
            paymentType: PaymentMethod.COPAYMENT,
            points: 300,
            coins: 50,
        }))
        const item = result.items[0]
        expect(item.paymentTypes.coin?.amount).toBe(50)
        expect(item.paymentTypes.coin?.currencyId).toBe("coins-ccy")
    })

    it("should not add coin entry when coins is 0", () => {
        const cart = new ShoppingCart(null)
        const result = cart.addProduct(makeProduct({ coins: 0 }))
        expect(result.items[0].paymentTypes.coin).toBeUndefined()
    })

    it("should increment quantity when adding same variation and paymentType", () => {
        const existing: Basket = {
            buyerId: "buyer-1",
            items: [{
                id: "item-1",
                variationId: "var-1",
                paymentMethod: PaymentMethod.POINTS,
                quantity: 1,
                productId: "prod-1",
                storeId: "store-1",
                supplierId: "supplier-1",
                categoryId: "cat-1",
                categoryName: "Category",
                brandName: "Brand",
                slug: "test-product",
                description: "desc",
                productType: "physical",
                isAvailability: true,
                queryId: "qid-1",
                comments: "",
                variationInfo: {
                    productName: "Test Product",
                    productSlug: "test-product",
                    stock: 10,
                    price: 100,
                    pointsPrice: 500,
                    taxes: 0,
                    assets: [],
                    features: [],
                },
                paymentTypes: {
                    points: { currencyId: "points-ccy", amount: 500 },
                },
            }],
        } as unknown as Basket

        const cart = new ShoppingCart(existing)
        const result = cart.addProduct(makeProduct({ quantity: 1, points: 500, coins: 0 }))
        expect(result.items).toHaveLength(1)
        expect(result.items[0].quantity).toBe(2)
        expect(result.items[0].paymentTypes.points.amount).toBe(1000)
    })

    it("should add coin entry on existing item when coins were 0 but now > 0", () => {
        const existing: Basket = {
            buyerId: "buyer-1",
            items: [{
                id: "item-1",
                variationId: "var-1",
                paymentMethod: PaymentMethod.COPAYMENT,
                quantity: 1,
                productId: "prod-1",
                storeId: "store-1",
                supplierId: "supplier-1",
                categoryId: "cat-1",
                categoryName: "Category",
                brandName: "Brand",
                slug: "test-product",
                description: "desc",
                productType: "physical",
                isAvailability: true,
                queryId: "qid-1",
                comments: "",
                variationInfo: {
                    productName: "Test Product",
                    productSlug: "test-product",
                    stock: 10,
                    price: 100,
                    pointsPrice: 500,
                    taxes: 0,
                    assets: [],
                    features: [],
                },
                paymentTypes: {
                    points: { currencyId: "points-ccy", amount: 300 },
                },
            }],
        } as unknown as Basket

        const cart = new ShoppingCart(existing)
        const result = cart.addProduct(makeProduct({
            paymentType: PaymentMethod.COPAYMENT,
            quantity: 1,
            points: 300,
            coins: 50,
        }))
        expect(result.items[0].paymentTypes.coin?.amount).toBe(50)
    })

    it("should add a separate item for different variation id", () => {
        const cart = new ShoppingCart(null)
        const result = cart.addProduct(makeProduct())
        // Second call with same cart but different variation
        const cart2 = new ShoppingCart(result)
        const result2 = cart2.addProduct(makeProduct({
            variation: { id: "var-2", pointsPrice: 600, price: 120, stock: 5, taxes: 0, copayment: null, assets: [], features: [] } as unknown as BasketProduct["variation"]
        }))
        expect(result2.items).toHaveLength(2)
    })

    it("should add a separate item for different payment type", () => {
        const cart = new ShoppingCart(null)
        const result1 = cart.addProduct(makeProduct({ paymentType: PaymentMethod.POINTS }))
        const cart2 = new ShoppingCart(result1)
        const result2 = cart2.addProduct(makeProduct({ paymentType: PaymentMethod.COPAYMENT }))
        expect(result2.items).toHaveLength(2)
    })

    it("should consolidate items with same variation and paymentType but different quantity", () => {
        const cart = new ShoppingCart(null)
        const result1 = cart.addProduct(makeProduct({ quantity: 1, points: 500 }))
        const cart2 = new ShoppingCart(result1)
        const result2 = cart2.addProduct(makeProduct({ quantity: 2, points: 1000 }))
        expect(result2.items).toHaveLength(1)
        expect(result2.items[0].quantity).toBe(3)
        expect(result2.items[0].paymentTypes.points.amount).toBe(1500)
    })

    it("should not mutate the original basket passed in", () => {
        const original: Basket = { buyerId: "buyer-1", items: [] }
        const cart = new ShoppingCart(original)
        cart.addProduct(makeProduct())
        expect(original.items).toHaveLength(0)
    })

    it("should generate unique ids for new items", () => {
        const cart = new ShoppingCart(null)
        const result1 = cart.addProduct(makeProduct())
        const cart2 = new ShoppingCart(result1)
        const result2 = cart2.addProduct(makeProduct({
            variation: { id: "var-2", pointsPrice: 600, price: 120, stock: 5, taxes: 0, copayment: null, assets: [], features: [] } as unknown as BasketProduct["variation"]
        }))
        expect(result2.items[0].id).not.toBe(result2.items[1].id)
    })

    it("should use empty string categoryId when product has no categories", () => {
        const product = makeProduct({ product: { ...makeProduct().product, categories: [] } as unknown as BasketProduct["product"] })
        const cart = new ShoppingCart(null)
        const result = cart.addProduct(product)
        expect(result.items[0].categoryId).toBe("")
        expect(result.items[0].categoryName).toBe("")
    })

    it("should strip asset id in variationInfo assets", () => {
        const variation = {
            id: "var-1",
            pointsPrice: 500,
            price: 100,
            stock: 10,
            taxes: 0,
            copayment: null,
            assets: [{ id: "asset-1", desktopUrl: "http://example.com/1.jpg", type: "image", order: 1 }],
            features: [],
        } as unknown as BasketProduct["variation"]
        const cart = new ShoppingCart(null)
        const result = cart.addProduct(makeProduct({ variation }))
        const asset = result.items[0].variationInfo.assets[0] as Record<string, unknown>
        expect(asset.id).toBeUndefined()
        expect(asset.desktopUrl).toBe("http://example.com/1.jpg")
    })

    it("should increment coin amount when existing item already has coin payment", () => {
        const existing: Basket = {
            buyerId: "buyer-1",
            items: [{
                id: "item-1",
                variationId: "var-1",
                paymentMethod: PaymentMethod.COPAYMENT,
                quantity: 1,
                productId: "prod-1",
                storeId: "store-1",
                supplierId: "supplier-1",
                categoryId: "cat-1",
                categoryName: "Category",
                brandName: "Brand",
                slug: "test-product",
                description: "desc",
                productType: "physical",
                isAvailability: true,
                queryId: "qid-1",
                comments: "",
                variationInfo: {
                    productName: "Test Product",
                    productSlug: "test-product",
                    stock: 10,
                    price: 100,
                    pointsPrice: 500,
                    taxes: 0,
                    assets: [],
                    features: [],
                },
                paymentTypes: {
                    points: { currencyId: "points-ccy", amount: 300 },
                    coin: { currencyId: "coins-ccy", amount: 25 },
                },
            }],
        } as unknown as Basket

        const cart = new ShoppingCart(existing)
        const result = cart.addProduct(makeProduct({
            paymentType: PaymentMethod.COPAYMENT,
            quantity: 1,
            points: 300,
            coins: 25,
        }))
        expect(result.items[0].paymentTypes.coin?.amount).toBe(50)
        expect(result.items[0].paymentTypes.points.amount).toBe(600)
    })

    it("should preserve copayment info in variationInfo when product has copayment", () => {
        const copayment = {
            initialization: { points: 200, coins: 10 },
            minimumPointsValue: 200,
            pointsConversionRatePercentage: "test",
        }
        const variation = {
            id: "var-1",
            pointsPrice: 500,
            price: 100,
            stock: 10,
            taxes: 12,
            copayment,
            assets: [],
            features: [],
        } as unknown as BasketProduct["variation"]
        const cart = new ShoppingCart(null)
        const result = cart.addProduct(makeProduct({ variation }))
        expect(result.items[0].variationInfo.copayment).toEqual(copayment)
        expect(result.items[0].variationInfo.taxes).toBe(12)
    })

    it("should store variation features in variationInfo", () => {
        const variation = {
            id: "var-1",
            pointsPrice: 500,
            price: 100,
            stock: 10,
            taxes: 0,
            copayment: null,
            assets: [],
            features: [{ name: "Color", option: "Red" }, { name: "Size", option: "M" }],
        } as unknown as BasketProduct["variation"]
        const cart = new ShoppingCart(null)
        const result = cart.addProduct(makeProduct({ variation }))
        expect(result.items[0].variationInfo.features).toEqual([
            { name: "Color", option: "Red" },
            { name: "Size", option: "M" },
        ])
    })

    it("should use empty string queryId when searchEngine has no queryID", () => {
        const product = makeProduct({
            product: {
                ...makeProduct().product,
                searchEngine: { queryID: "" },
            } as unknown as BasketProduct["product"],
        })
        const cart = new ShoppingCart(null)
        const result = cart.addProduct(product)
        expect(result.items[0].queryId).toBe("")
    })

    it("should set isAvailability to true for new items", () => {
        const cart = new ShoppingCart(null)
        const result = cart.addProduct(makeProduct())
        expect(result.items[0].isAvailability).toBe(true)
    })

    it("should set paymentMethod from paymentType on new item", () => {
        const cart = new ShoppingCart(null)
        const result = cart.addProduct(makeProduct({ paymentType: PaymentMethod.COPAYMENT }))
        expect(result.items[0].paymentMethod).toBe(PaymentMethod.COPAYMENT)
    })

    it("should return same basket reference after adding product", () => {
        const cart = new ShoppingCart(null)
        const result = cart.addProduct(makeProduct())
        expect(Array.isArray(result.items)).toBe(true)
        expect(result.items).toHaveLength(1)
    })

    it("should deep-clone initial basket so mutations on result don't affect a second addProduct call", () => {
        const base: Basket = { buyerId: "b", items: [] }
        const cart = new ShoppingCart(base)
        const result1 = cart.addProduct(makeProduct())
        result1.items.push({ id: "injected" } as unknown as typeof result1.items[0])
        const cart2 = new ShoppingCart(base)
        const result2 = cart2.addProduct(makeProduct())
        expect(result2.items).toHaveLength(1)
    })
})

describe("ShoppingCart updateBasketItem", () => {
    it("isAddedProduct returns false with null basket", () => {
        const cart = new ShoppingCart(null);
        expect(cart.isAddedProduct("v1", PaymentMethod.POINTS)).toBe(false);
    });

    it("isAddedProduct matches by variation and payment method", () => {
        const cart = new ShoppingCart({
            buyerId: "b",
            items: [
                { variationId: "v1", paymentMethod: PaymentMethod.POINTS },
                { variationId: "v1", paymentMethod: PaymentMethod.COPAYMENT },
            ],
        } as any);

        expect(cart.isAddedProduct("v1", PaymentMethod.COPAYMENT)).toBe(true);
        expect(cart.isAddedProduct("v2", PaymentMethod.POINTS)).toBe(false);
    });

    it("updateBasketItem increments quantity and points for points method", () => {
        const basket = {
            buyerId: "b",
            items: [
                {
                    variationId: "v1",
                    paymentMethod: PaymentMethod.POINTS,
                    quantity: 1,
                    paymentTypes: { points: { currencyId: "PTS", amount: 1000 } },
                },
            ],
        } as any;

        const result = ShoppingCart.updateBasketItem(
            {
                variation: { id: "v1" },
                quantity: 2,
                pointsTotal: 2000,
            } as any,
            basket,
        );

        expect(result.items[0].quantity).toBe(3);
        expect(result.items[0].paymentTypes.points.amount).toBe(3000);
    });

    it("updateBasketItem applies copayment totals when coin exists", () => {
        const basket = {
            buyerId: "b",
            items: [
                {
                    variationId: "v1",
                    paymentMethod: PaymentMethod.COPAYMENT,
                    quantity: 1,
                    paymentTypes: {
                        points: { currencyId: "PTS", amount: 100 },
                        coin: { currencyId: "USD", amount: 1 },
                    },
                },
            ],
        } as any;

        const result = ShoppingCart.updateBasketItem(
            {
                variation: { id: "v1" },
                quantity: 2,
                pointsTotal: 100,
                coinsTotal: 2,
            } as any,
            basket,
        );

        expect(result.items[0].quantity).toBe(3);
        expect(result.items[0].paymentTypes.points.amount).toBe(200);
        expect(result.items[0].paymentTypes.coin.amount).toBe(3);
    });

    it("updateBasketItem keeps non-target items unchanged", () => {
        const originalItem = {
            variationId: "other",
            paymentMethod: PaymentMethod.POINTS,
            quantity: 1,
            paymentTypes: { points: { currencyId: "PTS", amount: 10 } },
        };
        const basket = { buyerId: "b", items: [originalItem] } as any;

        const result = ShoppingCart.updateBasketItem(
            { variation: { id: "v1" }, quantity: 1, pointsTotal: 100 } as any,
            basket,
        );

        expect(result.items[0]).toBe(originalItem);
    });
});
