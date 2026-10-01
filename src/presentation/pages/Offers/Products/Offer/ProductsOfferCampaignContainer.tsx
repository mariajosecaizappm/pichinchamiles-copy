import { Search } from "@/domain/entity/Product/product"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import GetOfferCampaignUseCase from "@/domain/interactors/Offers/GetOfferCampaignUseCase"
import DocumentTitle from "@/presentation/components/Layout/DocumentTitle"
import container from "@/presentation/config/inversify.config"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import ProductsOfferCampaignSkeleton from "./ProductsOfferCampaignSkeleton"
import ProductsOfferCampaign from "./ProductsOfferCampaign"

type Props = {
    slug: string
    searchParams?: Promise<Partial<Search>>
}

const ProductsOfferCampaignContainer = async ({ slug, searchParams }: Props) => {
    const searchParamsValue = await searchParams

    try {
        const campaign = await container.get<GetOfferCampaignUseCase>(UseCaseTypes.GetOfferCampaignUseCase).getOfferCampaignProducts(slug)

        if(!campaign) {
            notFound()
        }

        return (
            <div className="py-4">
                <DocumentTitle title={campaign?.mainTitle ?? ''} />
                <Suspense fallback={<ProductsOfferCampaignSkeleton className="py-0" />}>
                    <ProductsOfferCampaign campaign={campaign} searchParams={searchParamsValue} />
                </Suspense>
            </div>
        )
    } catch {
        return <ProductsOfferCampaignSkeleton />
    }


}

export default ProductsOfferCampaignContainer