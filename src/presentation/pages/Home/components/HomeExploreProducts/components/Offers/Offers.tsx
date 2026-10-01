"use client"

import { ProductsCampaignBanner } from "@/domain/entity/Campaign/campaign";

import OffersShowcase from "@/presentation/pages/Home/UseYourMiles/Sections/OffersShowcase/OffersShowcase";

const Offers = ({
    campaings
}: {
    campaings: ProductsCampaignBanner[]
}) => {
    if (!campaings || campaings.length === 0) {
        return null;
    }
    return (
        <div className="bg-grayscale-50">
            <OffersShowcase
                title="Ofertas"
                campaigns={campaings}
                showBanner={true}
            />
        </div>
    )
};

export default Offers;