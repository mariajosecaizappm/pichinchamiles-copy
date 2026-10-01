import { ListParams } from "../List/list"
import SearchEngine from "../SearchEngine/structure/SearchEngine"
import { ProductAsset, ProductTag } from "./product"

export type VariationCopayment = {
    initialization: {
        points: number
        coins: number
    }
    minimumPointsValue: number
    pointsConversionRatePercentage: string
}

export type VariationFeature = {
    name: string
    option: string
}

export enum DiscountType {
    PERCENTAGE = 'percentage'
}

export enum DiscountStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

export type Variation = {
    id: string
    reference: string
    stock: number
    storeStock?: number
    price: number
    discountType: DiscountType
    discountValue?: number
    discountValidTo?: string
    discountValidFrom?: string
    discountTag?: string
    discountTagTextColor?: string
    discountTagBackgroundColor?: string
    discountStatus: DiscountStatus
    pointsPrice: number
    width?: number
    weight: number
    length?: number
    height?: number
    taxes: number
    tags: ProductTag[]
    assets: ProductAsset[]
    features: VariationFeature[]
    copayment?: VariationCopayment
    searchEngine: SearchEngine
}

export interface VariationListParams extends ListParams {
    productId: string
}