import {Basket} from "@/domain/entity/Basket/structure/basket";
import { Product } from "@/domain/entity/Product/product";
import { Variation } from "@/domain/entity/Product/variation";

export type DiscontinuedProduct = {
    id: string
    name: string
    imageUrl: string
    features: string
}

export type UpdatedBasket = {
    basket: Basket | null
    discontinuedProducts: DiscontinuedProduct[]
}

export type NewBasketItemInput = {
    coins?: number
}

export type NewBasketItem = {
    product: Product
    variation: Variation
    pointsCurrencyId: string | null
    coinsCurrencyId: string | null
    quantity: number
    copayment: {
        points: number
        coins: number
    } | null
    pointsTotal: number
    coinsTotal: number
}

