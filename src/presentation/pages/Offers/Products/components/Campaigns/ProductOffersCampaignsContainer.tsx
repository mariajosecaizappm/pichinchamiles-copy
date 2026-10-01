"use client"

import useSession from "@/presentation/hooks/useSession";
import ProductOffersCampaigns from "./ProductOffersCampaigns";
import {ProductOffer} from "@/domain/entity/Offer/offer";
import {FC, useMemo} from "react";
import {MarketingPositions} from "@/domain/entity/Marketing/marketing";

type ProductOffersCampaignsProps = {
    offers: ProductOffer[]
}

const ProductOffersCampaignsContainer: FC<ProductOffersCampaignsProps> = ({offers}) => {
    const { isLogged } = useSession();
    const productOffers = useMemo(()=>{
        const position = isLogged ? MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS : MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS;
        return offers.filter(offer => offer.banner?.positions.includes(position)).sort((a, b)=> a.banner.priority - b.banner.priority)
    }, [isLogged, offers])
    return <ProductOffersCampaigns offers={productOffers.slice(0, 4)}/>
}

export default ProductOffersCampaignsContainer