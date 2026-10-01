"use client"

import { CampaignExperience } from "@/domain/entity/Campaign/campaign"
import OffersCampaignsWrapper from "../../components/campaigns/OffersCampaignsWrapper"
import CampaignSlider from "@/presentation/components/Campaigns/CampaignSlider"
import ExperienceItemCard from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/ExperienceItemCard"
import { getCampaignExperienceCardImage } from "../helpers"
import {ActivityOffer} from "@/domain/entity/Offer/offer";

type Props = {
    offers: ActivityOffer[]
}

const ActivityOffersCampaigns = ({ offers }: Props) => {
    const buildAsset = (item: CampaignExperience) => ({
        desktopUrl: getCampaignExperienceCardImage(item.image.desktopUrl),
        mobileUrl: getCampaignExperienceCardImage(item.image.mobileUrl),
    })
    return (
        <OffersCampaignsWrapper
            offers={offers.map(offer=> ({
                ...offer,
                experiences: offer.campaign.experiences
            }))}
            renderOffer={(offer) => (
                <CampaignSlider<CampaignExperience>
                    offer={offer}
                    renderItem={(item) => (
                        <ExperienceItemCard
                            href={item.url}
                            asset={buildAsset(item)}
                            title={item.name}
                            address={item.address}
                            points={Number(item.pointsAmount)}
                        />
                    )}
                    renderMobileItem={(item, index) => (
                        <ExperienceItemCard
                            key={`${item.name}-${index}`}
                            orientation="horizontal"
                            href={item.url}
                            asset={buildAsset(item)}
                            title={item.name}
                            address={item.address}
                            points={Number(item.pointsAmount)}
                        />
                    )}
                />
            )}
        />
    )
}

export default ActivityOffersCampaigns
