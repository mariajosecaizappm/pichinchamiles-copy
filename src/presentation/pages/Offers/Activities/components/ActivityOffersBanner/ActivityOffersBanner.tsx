"use client"
import React, {FC, useMemo} from 'react';
import {Banner} from "@/domain/entity/Banner/banner";
import OffersBanner from "@/presentation/pages/Offers/components/banner/OffersBanner";
import useSession from "@/presentation/hooks/useSession";
import {MarketingPositions} from "@/domain/entity/Marketing/marketing";

type ActivityOffersBannerProps = {
    banners: Banner[]
}

const ActivityOffersBanner: FC<ActivityOffersBannerProps> = ({banners}) => {
    const { isLogged } = useSession();
    const banner = useMemo(()=>{
        const position = isLogged ? MarketingPositions.OFFERS_AUTH_MAIN_BANNER_ACTIVITIES : MarketingPositions.OFFERS_GUEST_MAIN_BANNER_ACTIVITIES;
        return banners.find(banner => banner.positions.includes(position))
    }, [banners, isLogged]);

    if (!banner) return null;

    return <OffersBanner banner={banner} />
};

export default ActivityOffersBanner;