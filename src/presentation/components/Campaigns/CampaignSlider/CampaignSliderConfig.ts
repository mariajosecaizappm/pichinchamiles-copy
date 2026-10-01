import { CampaignBanner, ExperienceCampaignBanner } from "@/domain/entity/Campaign/campaign"
import links from "@/presentation/config/links"

export const isExperienceOffer = (offer: CampaignBanner): offer is ExperienceCampaignBanner =>
    "experiences" in offer

export const getCampaignHref = (offer: CampaignBanner) => {
    const campaignHref = `${links.offers}${isExperienceOffer(offer) ? links.travelAndActivities : links.productsList}/${offer.campaign.slug}`
    return campaignHref
}