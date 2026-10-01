"use client"

import { ProductAsset, ProductTag } from "@/domain/entity/Product/product"
import { Variation } from "@/domain/entity/Product/variation"
import { createContext } from "react"
import { ProductFormValues } from "../components/ProductForm/ProductFormConfig"

export type ProductDetailsContextType = {
    tags: ProductTag[]
    assets: ProductAsset[]
    variation: Variation | null
    setVariation: (variation: Variation | null) => void
    selectedFeatures: Array<{ name: string, option: string | null }>
    setSelectedFeatures: React.Dispatch<React.SetStateAction<Array<{ name: string, option: string | null }>>>
    rootCategory: string
    setRootCategory: (rootCategory: string) => void
    isLoading: boolean
    hasDiscount: boolean
    hasVariants: boolean
    pointsPrice: number
    minCopaymentPoints: number
    addProductToCart: (product: Omit<ProductFormValues, 'features'>) => Promise<void>
}

export const ProductDetailsContext = createContext<ProductDetailsContextType | null>(null)