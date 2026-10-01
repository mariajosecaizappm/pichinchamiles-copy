"use client"

import { useMemo } from "react";
import { ExperienceCampaignBanner } from "@/domain/entity/Campaign/campaign";
import { MarketingPositions } from "@/domain/entity/Marketing/marketing";
import useSession from "@/presentation/hooks/useSession";
import OffersShowcase from "../../../Sections/OffersShowcase/OffersShowcase";

type Props = {
    offers: ExperienceCampaignBanner[]
}

const TravelDeals = ({ offers }: Props) => {
    const { isLogged } = useSession()

    const filteredOffers = useMemo(() => {
        const position = isLogged ? MarketingPositions.HOME_UV_AUTH_OFFERS : MarketingPositions.HOME_UV_GUEST_OFFERS
        return offers.filter((offer) => offer.banner.positions.includes(position))
    }, [offers, isLogged])

    return (
        <div className="bg-grayscale-50">
            <OffersShowcase title="Ofertas de viajes" campaigns={filteredOffers} />
        </div>
    );
};



export default TravelDeals;