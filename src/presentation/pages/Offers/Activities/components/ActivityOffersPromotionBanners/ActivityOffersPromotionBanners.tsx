"use client"
import React, {FC, useMemo} from 'react';
import PromotionBanners from "@/presentation/pages/Offers/Products/components/Promotions/PromotionCards";
import useSession from "@/presentation/hooks/useSession";
import {MarketingPositions} from "@/domain/entity/Marketing/marketing";
import {Banner} from "@/domain/entity/Banner/banner";

type ActivityOffersPromotionBannersProps = {
    banners: Banner[]
}

const ActivityOffersPromotionBanners: FC<ActivityOffersPromotionBannersProps> = ({banners}) => {
    const { isLogged } = useSession();
    const promotionBanners = useMemo(()=>{
        const position = isLogged ? MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_ACTIVITIES : MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_ACTIVITIES;
        return banners.filter(banner => banner.positions.includes(position))
    }, [banners, isLogged])

    return <PromotionBanners banners={promotionBanners}/>
};

export default ActivityOffersPromotionBanners;