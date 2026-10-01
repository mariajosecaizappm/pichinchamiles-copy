import type { Banner } from "@/domain/entity/Banner/banner";
import { MarketingPositions } from "@/domain/entity/Marketing/marketing";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import type IBannerRepository from "@/domain/repository/Banner/IBannerRepository";
import type ICampaignRepository from "@/domain/repository/Campaign/ICampaignRepository";
import { inject, injectable } from "inversify";

@injectable()
export default class GetHomeContentUseCase {
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

    async getBanners() {
        return this.bannerRepository.getBanners({
            positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
            page: 1,
            pageSize: 10
        });
    }

    async getMainBanner(): Promise<Banner | null> {
        const { data } = await this.bannerRepository.getBanners({
            positions: [MarketingPositions.HOME_NOT_LOGGED_MAIN_CAROUSEL],
            page: 1,
            pageSize: 1,
        });
        return data[0] ?? null;
    }

    async getHomeRedemptionCategories() {
        return this.bannerRepository.getBanners({
            positions: [MarketingPositions.HOME_NOT_LOGGED_REDEMPTION_CATEGORIES],
            page: 1,
            pageSize: 10
        });
    }
    
    async getFeaturedRewards() {
        const {
            data,
            pagination
        } = await this.bannerRepository.getBanners({
            positions: [MarketingPositions.HOME_NOT_LOGGED_FEATURED_REWARDS],
            page: 1,
            pageSize: 10
        })

        return {
            data,
            pagination
        }
    }
  
}
