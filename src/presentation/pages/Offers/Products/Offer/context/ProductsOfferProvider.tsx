"use client"

import { useMemo, useState } from "react"
import { ProductsOfferContext } from "./ProductsOfferContext"

const ProductsOfferProvider = ({ children }: { children: React.ReactNode }) => {
    const [brandIds, setBrandIds] = useState<string[]>([])

    const providerValues: ProductsOfferContext = useMemo(() => ({
        brandIds,
        setBrandIds,
    }), [brandIds])
    
    return (
        <ProductsOfferContext.Provider value={providerValues}>
            {children}
        </ProductsOfferContext.Provider>
    )
}

export default ProductsOfferProvider