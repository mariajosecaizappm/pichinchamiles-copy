import { Search } from "@/domain/entity/Product/product"
import ProductsOfferCampaign from "@/presentation/pages/Offers/Products/Offer"
import ProductsOfferCampaignSkeleton from "@/presentation/pages/Offers/Products/Offer/ProductsOfferCampaignSkeleton"
import { Suspense } from "react"

type Props = {
    params: Promise<{
        slug: string
    }>
    searchParams?: Promise<Partial<Search>>
}

const OfferProductPage = async ({ params, searchParams }: Props) => {
    try {
        const { slug } = await params
        return (
            <Suspense fallback={<ProductsOfferCampaignSkeleton />}>
                <ProductsOfferCampaign slug={slug} searchParams={searchParams} />
            </Suspense>
        )
    } catch {
        return <ProductsOfferCampaignSkeleton />
    }
}

export default OfferProductPage
