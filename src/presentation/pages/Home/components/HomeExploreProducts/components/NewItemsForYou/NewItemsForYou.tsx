"use client"

import { ProductsCampaignBanner } from "@/domain/entity/Campaign/campaign";
import { MarketingPositions } from "@/domain/entity/Marketing/marketing";
import useSession from "@/presentation/hooks/useSession";
import OffersShowcase from "@/presentation/pages/Home/UseYourMiles/Sections/OffersShowcase/OffersShowcase";
import { useMemo } from "react";

const NewItemsForYou = ({
    campaings
}: {
    campaings: ProductsCampaignBanner[]
}) => {
    const { isLogged } = useSession();    

    const filteredCampaigns = useMemo(() => {
        const position = isLogged 
            ? MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_NEW_ITEMS_FOR_YOU
            : MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_NEW_ITEMS_FOR_YOU;
        return campaings.filter(campaign => campaign.campaign.positions.includes(position));
    }, [campaings, isLogged]);



    if (!filteredCampaigns || filteredCampaigns.length === 0) {
        return null;
    }

    return <OffersShowcase
        title="Novedades para ti"
        campaigns={filteredCampaigns}
        showBanner={false}
    />
};

export default NewItemsForYou;