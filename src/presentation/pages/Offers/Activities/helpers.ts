import links from "@/presentation/config/links"
import { ExperienceCampaignBanner } from "@/domain/entity/Campaign/campaign"

export const getCampaignExperienceCardImage = (imageUrl: string) => {
    return imageUrl
        .replace(".s3.us-east-2.amazonaws.com", "")
        .replace(".s3.us-east-1.amazonaws.com", "")
}

export const getCampaignLandingUrl = (slug: string) =>
    `${links.offers}${links.travelAndActivities}/${slug}`

type ExperienceImage = ExperienceCampaignBanner["experiences"][number]["image"]

export const buildExperienceAsset = (image: ExperienceImage) => ({
    desktopUrl: getCampaignExperienceCardImage(image.desktopUrl),
    mobileUrl: getCampaignExperienceCardImage(image.mobileUrl),
})
