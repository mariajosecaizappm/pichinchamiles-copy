import { Asset } from "@/domain/entity/Asset/asset";
import SearchEngine from "../SearchEngine/structure/SearchEngine";
import { List, ListParams, NumberComparator, NumberListParam, SortListParam, StringListParam } from "../List/list";
import { Variation } from "./variation";

export enum ProductType {
    PHYSICAL_PRODUCT = 'physicalproduct',
    DIGITAL_CERTIFICATE_WITH_CODE = 'digitalcertificatewithcode',
    DIGITAL_CERTIFICATE_WITHOUT_CODE = 'digitalcertificatewithoutcode',
    DIGITAL_MEMBERSHIP_CERTIFICATE = 'digitalmembershipcertificate',
    GIFT_CARD = 'giftcard',
    HAND_DELIVERY_GIFTCARD = 'handdeliverygiftcard'
}

export type ProductAsset = {
    id: string
    type: 'image' | 'video'
    htmlAlternative?: string
    order: number
} & Asset

export type ProductSuggestion = {
    query: string
    popularity: number
    objectID: string
}

export type Product = {
    id: string
    name: string
    slug: string
    keywords?: string
    seoTitle?: string
    seoKeywords?: string
    seoDescription?: string
    description: string
    summary?: string
    brand: {
         id: string
        name: string
    }
    categories: ProductCategory[]
    minPrice: number
    recommended: boolean
    segmentCodes: string[]
    store: {
        id: string
        name: string
    }
    supplierId: string
    priority: number
    maxPrice: number
    minPointsPrice: number
    maxPointsPrice: number
    unitPointsPriceWithoutDiscount: number
    assets: ProductAsset[]
    features: ProductFeature[]
    tags?: ProductTag[]
    mostWanted: boolean
    productType: ProductType
    searchEngine: SearchEngine
}

export type ProductCategory = {
    id: string
    name: string
    slug: string
}

export type ProductFeature = {
    id: string
    name: string
    options: string[]
    optionsOrdered: OptionOrdered[]
}

export type OptionOrdered = {
    id: string,
    name: string
}

export type ProductTag = {
    tag: string
    textColor: string
    backgroundColor: string
}

export interface ProductListParams extends ListParams {
    id?: string | string[] | StringListParam
    name?: StringListParam
    description?: StringListParam
    brandName?: StringListParam
    keywords?: StringListParam
    seoKeywords?: StringListParam
    seoDescription?: StringListParam
    minPointsPrice?: NumberListParam
    operator?: NumberComparator
    brandSlug?: string
    brandId?: string
    categoryId?: string | string[] | StringListParam
    parentCategoryId?: string
    recommended?: boolean
    segmentCodes?: string[]
    slug?: string
    sort?: SortListParam<'points' | 'priority'>
}

export type ProductSearch = {
    list: List<Product>
    brandIds: string[]
    categoryIds: string[]
    categories: Record<string, number>
}

export type Search = {
    search: string
    category: string[] | string
    sort: string
    brand: string
    points?: number[]
    page: number
    productIds?: string[]
    perPage: number
}

export type ProductVariation = {
    product: Product
    variations: Variation[]
}
