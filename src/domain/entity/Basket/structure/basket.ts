import { PaymentMethod } from "@/domain/entity/Payment/payment";
import { Product, ProductAsset, ProductType } from "@/domain/entity/Product/product";
import { Variation, VariationCopayment, VariationFeature } from "@/domain/entity/Product/variation";

export type BasketItem = {
    id: string
    storeId: string
    supplierId: string
    productId: string
    variationId: string
    categoryId: string
    quantity: number
    comments?: string
    brandName: string
    categoryName: string
    paymentMethod: PaymentMethod
    productType: ProductType
    description: string
    slug: string
    isAvailability?: boolean
    queryId?: string
    variationInfo: {
        productName: string
        productNameChanged?: boolean
        productSlug: string
        productSlugChanged?: boolean
        stock: number
        stockChanged?: boolean
        price: number
        priceChanged?: boolean
        pointsPrice: number
        pointsPriceChanged?: boolean
        taxes: number
        copayment?: VariationCopayment
        assets: Omit<ProductAsset, 'id'>[]
        features: VariationFeature[]
    }
    paymentTypes: {
        coin?: {
            currencyId: string
            amount: number
        },
        points: {
            currencyId: string
            amount: number
        }
        pointsConversionRatePercentage?: string
    }
}

export type Basket = {
    buyerId: string
    items: BasketItem[]
}

export type BasketProduct = {
    product: Product
    variation: Variation
    coinsCurrencyId: string
    pointsCurrencyId: string
    paymentType: string
    points: number
    coins: number
    quantity: number
}

export type AddedBasketItem = {
    copayment: {
        points: number
        coins: number
    } | null
    product: Product
    variation: Variation
    coinsCurrencyId: string
    pointsCurrencyId: string
    quantity: number
    pointsTotal: number
    coinsTotal: number
}
