import "reflect-metadata"
import {inject, injectable} from "inversify";
import type IBannerRepository from "@/domain/repository/Banner/IBannerRepository";
import type ICampaignRepository from "@/domain/repository/Campaign/ICampaignRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import {MarketingPositions} from "@/domain/entity/Marketing/marketing";
import {CampaignType, ExperienceCampaign} from "@/domain/entity/Campaign/campaign";
import {Banner} from "@/domain/entity/Banner/banner";

@injectable()
export default class GetActivityOffersUseCase {
    private readonly bannerRepository: IBannerRepository;
    private readonly campaignRepository: ICampaignRepository;

    constructor(
        @inject(RepositoryTypes.BannerRepository) bannerRepository: IBannerRepository,
        @inject(RepositoryTypes.CampaignRepository) campaignRepository: ICampaignRepository
    ) {
        this.bannerRepository = bannerRepository;
        this.campaignRepository = campaignRepository;
    }

    async getActivityOffers(){
        const [banners, campaigns] = await Promise.all([
            this.bannerRepository.getBanners({
                positions: [
                    MarketingPositions.OFFERS_AUTH_MAIN_BANNER_ACTIVITIES,
                    MarketingPositions.OFFERS_GUEST_MAIN_BANNER_ACTIVITIES,
                    MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_ACTIVITIES,
                    MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_ACTIVITIES,
                    MarketingPositions.HOME_UV_AUTH_OFFERS,
                    MarketingPositions.HOME_UV_GUEST_OFFERS
                ],
                page: 1,
                pageSize: 50
            }),
            this.campaignRepository.getCampaigns({
                positions: [
                    MarketingPositions.HOME_UV_AUTH_OFFERS,
                    MarketingPositions.HOME_UV_GUEST_OFFERS
                ],
                campaignType: CampaignType.EXPERIENCES,
                pageSize: 50,
                page: 1
            })
        ])
        const activityOffers = campaigns.data.map(campaign => {
            const banner = banners.data.find(banner => banner.campaignId === campaign.id);

            if(!banner) return null;

            return {
                campaign: campaign as ExperienceCampaign,
                banner: banner,
            }
        }).filter(activityOffer => activityOffer !== null);
        return {
            banners: banners.data
                .filter(banner=> !banner.positions
                    .some(position => position === MarketingPositions.HOME_UV_AUTH_OFFERS || position === MarketingPositions.HOME_UV_GUEST_OFFERS)),
            offers: activityOffers,
        }
    }
}