"use client"

import ProductsContentSkeleton from "@/presentation/pages/Products/components/skeletons/ProductsContentSkeleton"
import ProductOfferBannerSkeleton from "./components/Banner/ProductOfferBannerSkeleton"
import { cn } from "@heroui/react"

type Props = {
    className?: string
}

const ProductsOfferCampaignSkeleton = ({ className }: Props) => {
    return (
        <div className={cn("py-4", className)}>
            <div className="body-container py-2">
                <ProductOfferBannerSkeleton />
            </div>
            <ProductsContentSkeleton />
        </div>
    )
}

export default ProductsOfferCampaignSkeleton