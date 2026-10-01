"use client"

import { useState } from "react"
import useProductsOfferContext from "@/presentation/pages/Offers/Products/Offer/context/useProductsOfferContext"
import BrandFilterBaseContainer from "@/presentation/pages/Products/components/ProductsFilters/DesktopFilters/Brands/BrandFilterBaseContainer"

const CampaignBrandFilter = () => {
    const { brandIds } = useProductsOfferContext()
    const [isAccordionOpen, setIsAccordionOpen] = useState(false)

    if (!brandIds.length) {
        return null
    }

    return (
        <BrandFilterBaseContainer
            brandIds={brandIds}
            enabled={isAccordionOpen}
            onAccordionOpenChange={setIsAccordionOpen}
        />
    )
}

export default CampaignBrandFilter