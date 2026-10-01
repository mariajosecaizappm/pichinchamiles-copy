import { BannerCategory } from "@/domain/entity/Banner/banner";
import { CampaignStatus, CampaignType, ExperienceCampaign, ExperienceCampaignBanner } from "@/domain/entity/Campaign/campaign";
import { List } from "@/domain/entity/List/list";
import { MarketingPositions } from "@/domain/entity/Marketing/marketing";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import type IBannerRepository from "@/domain/repository/Banner/IBannerRepository";
import type ICampaignRepository from "@/domain/repository/Campaign/ICampaignRepository";
import { inject, injectable } from "inversify";

@injectable()
export default class GetTravelsContentUseCase {
    private readonly bannerRepository: IBannerRepository;
    private campaignRepository: ICampaignRepository;

    constructor(
        @inject(RepositoryTypes.BannerRepository)
            bannerRepository: IBannerRepository,
        @inject(RepositoryTypes.CampaignRepository)
            campaignRepository: ICampaignRepository,
    ) {
        this.bannerRepository = bannerRepository;
        this.campaignRepository = campaignRepository;
    }


    async getTopBanners() {
        return this.bannerRepository.getBanners({
            positions: [MarketingPositions.HOME_UV_AUTH_BANNER_TOP, MarketingPositions.HOME_UV_GUEST_BANNER_TOP],
            page: 1,
            pageSize: 20
        });
    }

    async getRecommendedItems({ category }: { category: BannerCategory }) {
        return this.bannerRepository.getBanners({
            category: [category],
            positions: [MarketingPositions.HOME_UV_AUTH_RECOMMENDED_ITEMS, MarketingPositions.HOME_UV_GUEST_RECOMMENDED_ITEMS],
            page: 1,
            pageSize: 8,
            isOutstanding: true
        })
    }


    async getOffers() {
        const campaignBanners: ExperienceCampaignBanner[] = [];

        const positions = [MarketingPositions.HOME_UV_AUTH_OFFERS, MarketingPositions.HOME_UV_GUEST_OFFERS]

        const banners = await this.bannerRepository.getBanners({
            positions,
            page: 1,
            pageSize: 10
        });

        const campaignList = await this.campaignRepository.getCampaigns({
            id: banners.data.map(banner => banner?.campaignId),
            positions,
            campaignType: CampaignType.EXPERIENCES,
            pageSize: 10,
            page: 1,
        }) as List<ExperienceCampaign>

        const campaigns = banners.data.map((banner) => {
            const campaignParts = campaignList.data.filter((c) => c.id === banner?.campaignId)
                .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

            const mainCampaign = campaignParts[0]

            return {
                ...mainCampaign,
                experiences: campaignParts.map((c) => c.experiences).flat()
            }
        })

        const activeCampaings = campaigns.filter(
            (campaign) =>
                campaign.status === CampaignStatus.ACTIVE
                && !campaign.positions.includes(MarketingPositions.OFFERS_HIDDEN_TRAVEL_CAMPAIGN),
        )

        banners.data.forEach((banner) => {
            if(!banner?.campaignId) return;
            const campaign = activeCampaings.find((campaign) => campaign.id === banner?.campaignId);
            if(campaign && campaign.experiences.length > 0) {
                campaignBanners.push({
                    banner,
                    campaign,
                    experiences: campaign.experiences.slice(0, 12)
                })
            }
        })

        return campaignBanners.sort((a, b) => {
            if (a.banner.priority < b.banner.priority) return -1;
            if (a.banner.priority > b.banner.priority) return 1;
            return 0
        })
    }

    async getBodyBanners() {
        return this.bannerRepository.getBanners({
            positions: [MarketingPositions.HOME_UV_AUTH_BODY_BANNERS, MarketingPositions.HOME_UV_GUEST_BODY_BANNERS],
            page: 1,
            pageSize: 6
        });
    }
}
