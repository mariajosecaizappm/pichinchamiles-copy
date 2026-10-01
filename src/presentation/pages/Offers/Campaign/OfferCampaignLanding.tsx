"use client"

import { ExperienceCampaign } from "@/domain/entity/Campaign/campaign"
import { Pagination } from "@/domain/entity/List/list"
import DocumentTitle from "@/presentation/components/Layout/DocumentTitle"
import useIsDesktop from "@/presentation/hooks/useIsDesktop"
import ExperienceItemCard from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/ExperienceItemCard"
import OfferCampaignBanner from "./OfferCampaignBanner"
import OfferCampaignLandingPagination from "./OfferCampaignLandingPagination"
import { buildExperienceAsset } from "../Activities/helpers"

type Props = {
    campaign: ExperienceCampaign
    pagination: Pagination
}
const getExperienceHref = (url: string, slug: string) => url || slug

const OfferCampaignLanding = ({ campaign, pagination }: Props) => {
    const { isDesktop } = useIsDesktop(1024)

    return (
        <div className="bg-grayscale-50">
            <DocumentTitle title={campaign.mainTitle} />
            <div className="body-container py-4 lg:py-6 flex flex-col gap-4">
                <OfferCampaignBanner
                    image={campaign.image}
                    title={campaign.mainTitle}
                    subtitle={campaign.secondaryTitle}
                />

                {campaign.experiences.length > 0 && (
                    <section className="flex flex-col gap-4">
                        <h2 className="font-slab text-blue-500 text-[22px] leading-7 lg:mt-3">
                            {campaign.shortDescription || "Experiencias recomendadas para ti"}
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-[12px] lg:gap-[52px] lg:px-[52px] lg:mt-3">
                            {campaign.experiences.map((experience) => (
                                <ExperienceItemCard
                                    key={experience.slug}
                                    href={getExperienceHref(experience.url, experience.slug)}
                                    asset={buildExperienceAsset(experience.image)}
                                    title={experience.name}
                                    address={experience.address}
                                    points={Number(experience.pointsAmount)}
                                    orientation={isDesktop ? "vertical" : "horizontal"}
                                    className={isDesktop ? "max-w-none" : undefined}
                                    classNameImage={isDesktop ? "max-w-none" : undefined}
                                />
                            ))}
                        </div>
                        <OfferCampaignLandingPagination
                            page={pagination.page}
                            totalPages={pagination.totalPages}
                        />
                    </section>
                )}
            </div>
        </div>
    )
}

export default OfferCampaignLanding
