import { beforeEach, describe, expect, it, vi } from "vitest"
import algoliaProvider from "@/presentation/analytics/providers/algoliaProvider"
import { EventName } from "@/presentation/analytics/types"
import links from "@/presentation/config/links"
import { Product, ProductType } from "@/domain/entity/Product/product"
import { SearchEngineType } from "@/domain/entity/SearchEngine/structure/SearchEngine"
import { BasketItem } from "@/domain/entity/Basket/structure/basket"
import { PaymentMethod } from "@/domain/entity/Payment/payment"

const aaMock = vi.hoisted(() => vi.fn())

vi.mock("search-insights", () => ({
    default: aaMock,
}))

const baseProduct: Product = {
    id: "product-1",
    name: "Product 1",
    slug: "product-1",
    description: "",
    brand: { id: "brand-1", name: "Brand 1" },
    categories: [],
    minPrice: 0,
    recommended: false,
    segmentCodes: [],
    store: { id: "store-1", name: "Store 1" },
    supplierId: "supplier-1",
    priority: 1,
    maxPrice: 0,
    minPointsPrice: 1000,
    maxPointsPrice: 1500,
    unitPointsPriceWithoutDiscount: 1200,
    assets: [],
    features: [],
    tags: [],
    mostWanted: false,
    productType: ProductType.PHYSICAL_PRODUCT,
    searchEngine: {
        engine: SearchEngineType.ALGOLIA,
        position: 3,
        index: "products_pme",
        queryID: "query-1",
        objectID: "object-1",
    },
}

const buildBasketItem = (index: number): BasketItem => ({
    id: `basket-${index}`,
    storeId: `store-${index}`,
    supplierId: `supplier-${index}`,
    productId: `product-${index}`,
    variationId: `variation-${index}`,
    categoryId: `category-${index}`,
    quantity: 1,
    brandName: "Brand 1",
    categoryName: "Category 1",
    paymentMethod: PaymentMethod.POINTS,
    productType: ProductType.PHYSICAL_PRODUCT,
    description: "",
    slug: `product-${index}`,
    variationInfo: {
        productName: `Product ${index}`,
        productSlug: `product-${index}`,
        stock: 1,
        price: 1,
        pointsPrice: 1,
        taxes: 0,
        assets: [],
        features: [],
    },
    paymentTypes: {
        points: {
            currencyId: "miles",
            amount: 1,
        },
    },
})

describe("algoliaProvider", () => {
    const setCookie = (name: string, value: string) => {
        Object.defineProperty(document, "cookie", {
            writable: true,
            value: `${name}=${value}; path=/`,
        })
    }
    const getCookieValue = (name: string): string | null => {
        const match = document.cookie
            .split(";")
            .map((part) => part.trim())
            .find((part) => part.startsWith(`${name}=`))
        if (!match) return null
        return match.slice(name.length + 1)
    }
    const clearCookies = () => {
        document.cookie.split(";").forEach((part) => {
            const name = part.split("=")[0]?.trim()
            if (name) {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
            }
        })
    }

    beforeEach(() => {
        vi.clearAllMocks()
        sessionStorage.clear()
        localStorage.clear()
        clearCookies()
        window.history.pushState({}, "", links.products)
        vi.spyOn(crypto, "randomUUID").mockReturnValue("uuid-1")
    })

    it("tracks viewed products and stores the query id in session storage", () => {
        const secondProduct = { ...baseProduct, id: "product-2", searchEngine: { ...baseProduct.searchEngine, objectID: "object-2" } }

        algoliaProvider.track({
            name: EventName.VIEWED_PRODUCTS,
            payload: {
                products: [baseProduct, secondProduct],
                identification: "encrypted-identification",
            },
        })

        expect(aaMock).toHaveBeenCalledWith("viewedObjectIDs", {
            userToken: "encrypted-identification",
            authenticatedUserToken: "encrypted-identification",
            eventName: "Hits Viewed",
            index: "products_pme",
            objectIDs: ["object-1", "object-2"],
        })
        expect(sessionStorage.getItem("queryIdKey")).toBe(
            JSON.stringify({ queryID: "query-1", productIds: ["product-1", "product-2"] }),
        )
    })

    it("uses the after-search add to cart event when the viewed query id is available", () => {
        sessionStorage.setItem("queryIdKey", JSON.stringify({ queryID: "query-1", productIds: ["product-1"] }))

        algoliaProvider.track({
            name: EventName.ADDED_PRODUCT,
            payload: {
                product: baseProduct,
                category: "Tecnologia",
                identification: "encrypted-identification",
            },
        })

        expect(aaMock).toHaveBeenCalledWith("addedToCartObjectIDsAfterSearch", {
            userToken: "encrypted-identification",
            authenticatedUserToken: "encrypted-identification",
            eventName: "Product Added To Cart After Search",
            index: "products_pme",
            queryID: "query-1",
            objectIDs: ["object-1"],
        })
    })

    it("falls back to the regular add to cart event when there is no stored query id", () => {
        algoliaProvider.track({
            name: EventName.ADDED_PRODUCT,
            payload: {
                product: baseProduct,
                category: "Tecnologia",
                identification: undefined,
            },
        })

        expect(aaMock).toHaveBeenCalledWith("addedToCartObjectIDs", {
            userToken: "uuid-1",
            authenticatedUserToken: undefined,
            eventName: "Product Added To Cart",
            index: "products_pme",
            objectIDs: ["object-1"],
        })
        expect(getCookieValue("session_id")).toBe("uuid-1")
    })

    it("uses stored userToken from cookie when no identification is provided", () => {
        setCookie("session_id", "stored-token-123")

        algoliaProvider.track({
            name: EventName.ADDED_PRODUCT,
            payload: {
                product: baseProduct,
                category: "Tecnologia",
                identification: undefined,
            },
        })

        expect(aaMock).toHaveBeenCalledWith("addedToCartObjectIDs", {
            userToken: "stored-token-123",
            authenticatedUserToken: undefined,
            eventName: "Product Added To Cart",
            index: "products_pme",
            objectIDs: ["object-1"],
        })
        expect(crypto.randomUUID).not.toHaveBeenCalled()
    })

    it("generates and stores new UUID when no identification and no stored token exist", () => {
        algoliaProvider.track({
            name: EventName.CLICKED_FILTERS,
            payload: {
                filter: { id: "1", name: "Category 1" },
                type: "category",
                identification: undefined,
            },
        })

        expect(getCookieValue("session_id")).toBe("uuid-1")
        expect(aaMock).toHaveBeenCalledWith("clickedFilters", expect.objectContaining({
            userToken: "uuid-1",
        }))
    })

    it("persists the same userToken across multiple events without identification", () => {
        algoliaProvider.track({
            name: EventName.CLICKED_FILTERS,
            payload: {
                filter: { id: "1", name: "Category 1" },
                type: "category",
                identification: undefined,
            },
        })

        algoliaProvider.track({
            name: EventName.ADDED_PRODUCT,
            payload: {
                product: baseProduct,
                category: "Tecnologia",
                identification: undefined,
            },
        })

        expect(crypto.randomUUID).toHaveBeenCalledTimes(1)
        expect(aaMock).toHaveBeenNthCalledWith(1, "clickedFilters", expect.objectContaining({
            userToken: "uuid-1",
        }))
        expect(aaMock).toHaveBeenNthCalledWith(2, "addedToCartObjectIDs", expect.objectContaining({
            userToken: "uuid-1",
        }))
    })

    it("tracks purchased products in batches of 20 items", () => {
        const products = Array.from({ length: 21 }, (_, index) => buildBasketItem(index + 1))

        algoliaProvider.track({
            name: EventName.PURCHASED_PRODUCT,
            payload: {
                products,
                reference: "ORDER-1",
                identification: "encrypted-identification",
            },
        })

        expect(aaMock).toHaveBeenCalledTimes(4)
        expect(aaMock).toHaveBeenNthCalledWith(1, "convertedObjectIDs", expect.objectContaining({
            eventName: "Product Converted",
            objectIDs: expect.arrayContaining(["product-1:store-1:test-program-id"]),
        }))
        expect(aaMock).toHaveBeenNthCalledWith(2, "purchasedObjectIDs", expect.objectContaining({
            eventName: "Product Purchased",
            objectIDs: expect.arrayContaining(["product-1:store-1:test-program-id"]),
        }))
        expect(aaMock).toHaveBeenNthCalledWith(3, "convertedObjectIDs", expect.objectContaining({
            objectIDs: ["product-21:store-21:test-program-id"],
        }))
        expect(aaMock).toHaveBeenNthCalledWith(4, "purchasedObjectIDs", expect.objectContaining({
            objectIDs: ["product-21:store-21:test-program-id"],
        }))
    })
})
