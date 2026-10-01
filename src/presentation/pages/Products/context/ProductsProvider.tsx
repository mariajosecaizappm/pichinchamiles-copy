"use client"

import { useMemo, useState } from "react"
import { ProductsContext } from "./ProductsContext"
import { Category } from "@/domain/entity/Category/structure/category"
import Categorization from "@/domain/entity/Category/models/Categorization"

type Props = {
    children: React.ReactNode
    categories: Category[]
}

const ProductsProvider = ({ children, categories }: Props) => {

    const [productCategories, setProductCategories] = useState<string[]>([])
    const [productBrands, setProductBrands] = useState<string[]>([])

    const value = useMemo(
        () => ({ categorization: new Categorization(categories) }),
        [categories],
    )

    const providerValues: ProductsContext = useMemo(() => ({
        productCategories,
        setProductCategories,
        productBrands,
        setProductBrands,
        categorization: value.categorization,
    }), [productCategories, setProductCategories, productBrands, setProductBrands, value.categorization])

    return (
        <ProductsContext.Provider
            value={providerValues}
        >
            {children}
        </ProductsContext.Provider>
    )
}

export default ProductsProvider