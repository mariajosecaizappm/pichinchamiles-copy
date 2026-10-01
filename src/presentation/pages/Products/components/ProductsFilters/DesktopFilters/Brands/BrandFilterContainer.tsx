"use client"

import { useProductsContext } from "@/presentation/pages/Products/context/useProductsContext"
import BrandFilterBaseContainer from "./BrandFilterBaseContainer"
import { useState } from "react"

const BrandFilterContainer = () => {
    const { productBrands } = useProductsContext()
    const [isAccordionOpen, setIsAccordionOpen] = useState(false)
    return (
        <BrandFilterBaseContainer
            brandIds={productBrands}
            enabled={isAccordionOpen}
            onAccordionOpenChange={setIsAccordionOpen}
        />
    )
}

export default BrandFilterContainer