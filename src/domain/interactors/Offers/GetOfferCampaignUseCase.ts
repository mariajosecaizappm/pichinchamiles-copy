import { Banner } from "@/domain/entity/Banner/banner"
import {
    Campaign,
    CampaignStatus,
    CampaignType,
    ExperienceCampaign,
    ProductsCampaign,
    ProductsCampaignBanner
} from "@/domain/entity/Campaign/campaign"
import { Pagination } from "@/domain/entity/List/list"
import { MarketingPositions } from "@/domain/entity/Marketing/marketing"
import { Product } from "@/domain/entity/Product/product"
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes"
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import type IBannerRepository from "@/domain/repository/Banner/IBannerRepository"
import type ICampaignRepository from "@/domain/repository/Campaign/ICampaignRepository"
import { inject, injectable } from "inversify"
import GetExploreProductsContentUseCase from "../Home/UseYourMiles/Products/GetExploreProductsContentUseCase"

const DEFAULT_PAGE_SIZE = 12

export type OfferCampaignResult = {
    campaign: Campaign
    pagination: Pagination
}

@injectable()
export default class GetOfferCampaignUseCase {
    private readonly campaignRepository: ICampaignRepository
    private readonly bannerRepository: IBannerRepository
    private readonly exploreProductsContentUseCase: GetExploreProductsContentUseCase

    constructor(
        @inject(RepositoryTypes.CampaignRepository)
            campaignRepository: ICampaignRepository,
        @inject(RepositoryTypes.BannerRepository)
            bannerRepository: IBannerRepository,
        @inject(UseCaseTypes.GetExploreProductsContentUseCase)
            exploreProductsContentUseCase: GetExploreProductsContentUseCase,
    ) {
        this.campaignRepository = campaignRepository
        this.bannerRepository = bannerRepository
        this.exploreProductsContentUseCase = exploreProductsContentUseCase
    }

    async execute(slug: string, page = 1, campaignType: CampaignType = CampaignType.EXPERIENCES): Promise<OfferCampaignResult | null> {
        const { data } = await this.campaignRepository.getCampaigns({
            slug,
            campaignType,
            page: 1,
            pageSize: 20,
        })

        const campaignParts = (data as ExperienceCampaign[])
            .filter((campaign) => campaign.status === CampaignStatus.ACTIVE)
            .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))

        const mainCampaign = campaignParts[0]

        if (!mainCampaign) return null

        const allExperiences = campaignParts.flatMap((campaign) => campaign.experiences)
        const pageSize = mainCampaign.numberElementsSlide > 0
            ? mainCampaign.numberElementsSlide
            : DEFAULT_PAGE_SIZE
        const total = allExperiences.length
        const totalPages = total > 0 ? Math.ceil(total / pageSize) : 0
        const safePage = totalPages > 0 ? Math.min(Math.max(1, page), totalPages) : 1
        const start = (safePage - 1) * pageSize
        const experiences = allExperiences.slice(start, start + pageSize)

        return {
            campaign: {
                ...mainCampaign,
                experiences,
            },
            pagination: {
                page: safePage,
                pageSize,
                total,
                totalPages,
            },
        }
    }

    async getOfferCampaignBanner(
        slug: string,
        isLogged: boolean,
        campaignType: CampaignType = CampaignType.EXPERIENCES,
    ): Promise<Banner | null> {
        const campaignList = await this.campaignRepository.getCampaigns({
            slug,
            campaignType,
            page: 1,
            pageSize: 1,
        })

        if (!campaignList || campaignList.pagination.total === 0) {
            return null
        }

        const [campaign] = campaignList.data

        const bannerList = await this.bannerRepository.getBanners({
            page: 1,
            pageSize: 1,
            campaignId: [campaign.id],
            positions: isLogged
                ? [MarketingPositions.OFFER_AUTH_CAMPAIGN_BANNER, MarketingPositions.OFFERS_HIDDEN_CAMPAIGN]
                : [MarketingPositions.OFFER_GUEST_CAMPAIGN_BANNER, MarketingPositions.OFFERS_HIDDEN_CAMPAIGN],
        })

        if (!bannerList || bannerList.pagination.total === 0) {
            return null
        }

        return bannerList.data[0] || null
    }
    async getOfferCampaignProducts(slug: string): Promise<ProductsCampaign | null> {
        const { data } = await this.campaignRepository.getCampaigns({
            slug,
            campaignType: CampaignType.PRODUCTS,
            page: 1,
            pageSize: 1,
        })

        const campaign = data[0] as ProductsCampaign | undefined
        if (!campaign) return null

        return campaign
    }
}
