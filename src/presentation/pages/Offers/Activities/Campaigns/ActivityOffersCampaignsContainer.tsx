"use client"

import useSession from "@/presentation/hooks/useSession"
import ActivityOffersCampaigns from "./ActivityOffersCampaigns"
import {FC, useMemo} from "react";
import {MarketingPositions} from "@/domain/entity/Marketing/marketing";
import {ActivityOffer} from "@/domain/entity/Offer/offer";

type ActivityOffersCampaignsContainerProps = {
    offers: ActivityOffer[]
}

const ActivityOffersCampaignsContainer: FC<ActivityOffersCampaignsContainerProps> = ({offers}) => {
    const { isLogged } = useSession();
    const activityOffers = useMemo(()=>{
        const position = isLogged ? MarketingPositions.HOME_UV_AUTH_OFFERS : MarketingPositions.HOME_UV_GUEST_OFFERS;
        return offers.filter(offer => offer.banner.positions.includes(position)).sort((a, b)=> a.banner.priority - b.banner.priority)
    }, [isLogged, offers])

    return <ActivityOffersCampaigns offers={activityOffers} />
}

export default ActivityOffersCampaignsContainer
