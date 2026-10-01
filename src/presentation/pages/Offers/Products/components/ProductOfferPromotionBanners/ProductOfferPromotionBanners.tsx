"use client"
import React, {FC, useMemo} from 'react';
import {Banner} from "@/domain/entity/Banner/banner";
import PromotionBanners from "@/presentation/pages/Offers/Products/components/Promotions/PromotionCards";
import useSession from "@/presentation/hooks/useSession";
import {MarketingPositions} from "@/domain/entity/Marketing/marketing";

type ProductOfferPromotionBannerProps = {
    banners: Banner[]
}

const ProductOfferPromotionBanners: FC<ProductOfferPromotionBannerProps> = ({banners}) => {
    const { isLogged } = useSession();
    const promotionBanners = useMemo(()=>{
        const position = isLogged ? MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_PRODUCTS : MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_PRODUCTS;
        return banners.filter(banner => banner.positions.includes(position))
    }, [banners, isLogged])

    return <PromotionBanners banners={promotionBanners}/>
};

export default ProductOfferPromotionBanners;