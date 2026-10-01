import OffersNavbar from "@/presentation/pages/Offers/components/navbar/OffersNavbar/OffersNavbar"
import ActivityOffersCampaigns from "./Campaigns"
import {Banner} from "@/domain/entity/Banner/banner";
import {ActivityOffer} from "@/domain/entity/Offer/offer";
import {FC} from "react";
import ActivityOffersBanner from "@/presentation/pages/Offers/Activities/components/ActivityOffersBanner";
import ActivityOffersPromotionBanners
    from "@/presentation/pages/Offers/Activities/components/ActivityOffersPromotionBanners";

type ActivityOffersProps = {
    banners: Banner[]
    offers: ActivityOffer[]
}

const ActivityOffers: FC<ActivityOffersProps> = ({offers, banners}) => {
    return (
        <div>
            <ActivityOffersBanner banners={banners}/>
            <OffersNavbar />
            <ActivityOffersPromotionBanners banners={banners}/>
            <ActivityOffersCampaigns offers={offers}/>
        </div>
    )
}

export default ActivityOffers
