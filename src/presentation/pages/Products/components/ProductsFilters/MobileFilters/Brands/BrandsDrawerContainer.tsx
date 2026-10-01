"use client"

import { useProductsContext } from "@/presentation/pages/Products/context/useProductsContext"
import BrandsDrawerBaseContainer from "./BrandsDrawerBaseContainer"

const BrandsDrawerContainer = () => {
    const { productBrands: brandIds } = useProductsContext()
    return <BrandsDrawerBaseContainer brandIds={brandIds} />
}

export default BrandsDrawerContainer
