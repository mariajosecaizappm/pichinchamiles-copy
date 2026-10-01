"use client"

import { ProductsCampaignBanner } from "@/domain/entity/Campaign/campaign"
import OffersCampaignsWrapper from "../../../components/campaigns/OffersCampaignsWrapper"
import CampaignSlider from "@/presentation/components/Campaigns/CampaignSlider"
import { Product } from "@/domain/entity/Product/product"
import ProductCard from "@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCard"

type Props = {
    offers: ProductsCampaignBanner[]
}

const ProductOffersCampaigns = ({ offers }: Props) => {
    return (
        <OffersCampaignsWrapper
            offers={offers}
            renderOffer={(offer) => (
                <CampaignSlider<Product>
                    offer={offer}
                    renderItem={(item) => <ProductCard product={item} />}
                    renderMobileItem={(item, index) => <ProductCard key={`${item.id}-${index}`} product={item} variant="products-page" />}
                />
            )}
        />
    )
}

export default ProductOffersCampaigns