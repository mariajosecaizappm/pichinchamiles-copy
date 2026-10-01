"use client"
import React, {FC, useMemo} from 'react';
import OffersBanner from "@/presentation/pages/Offers/components/banner/OffersBanner";
import {Banner} from "@/domain/entity/Banner/banner";
import useSession from "@/presentation/hooks/useSession";
import {MarketingPositions} from "@/domain/entity/Marketing/marketing";

type ProductOfferBannerProps = {
    banners: Banner[]
}

const ProductOfferBanner: FC<ProductOfferBannerProps> = ({banners}) => {
    const { isLogged } = useSession();
    const banner = useMemo(()=>{
        const position = isLogged ? MarketingPositions.OFFERS_AUTH_MAIN_BANNER_PRODUCTS : MarketingPositions.OFFERS_GUEST_MAIN_BANNER_PRODUCTS;
        return banners.find(banner => banner.positions.includes(position))
    }, [banners, isLogged]);

    if (!banner) return null;
    return <OffersBanner banner={banner} />
};

export default ProductOfferBanner;