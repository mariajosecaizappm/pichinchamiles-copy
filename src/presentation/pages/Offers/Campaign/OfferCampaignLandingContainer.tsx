import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import GetOfferCampaignUseCase from "@/domain/interactors/Offers/GetOfferCampaignUseCase"
import container from "@/presentation/config/inversify.config"
import { notFound } from "next/navigation"
import OfferCampaignLanding from "./OfferCampaignLanding"
import { CampaignType, ExperienceCampaign } from "@/domain/entity/Campaign/campaign"

const parsePage = (page: unknown): number => {
    const parsed = Number(page)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

type Props = {
    slug: string
    searchParams?: {
        page?: string
    }
}

const OfferCampaignLandingContainer = async ({ slug, searchParams }: Props) => {
    const getOfferCampaignUseCase = container.get<GetOfferCampaignUseCase>(
        UseCaseTypes.GetOfferCampaignUseCase,
    )

    const data = await getOfferCampaignUseCase.execute(
        slug,
        parsePage(searchParams?.page),
        CampaignType.EXPERIENCES,
    )

    if (!data) {
        notFound()
    }

    return (
        <OfferCampaignLanding
            campaign={data.campaign as ExperienceCampaign}
            pagination={data.pagination}
        />
    )
}

export default OfferCampaignLandingContainer
