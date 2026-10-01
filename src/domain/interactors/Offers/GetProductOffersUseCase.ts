import "reflect-metadata"
import {inject, injectable} from "inversify";
import type IBannerRepository from "@/domain/repository/Banner/IBannerRepository";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import {MarketingPositions} from "@/domain/entity/Marketing/marketing";
import type ICampaignRepository from "@/domain/repository/Campaign/ICampaignRepository";
import {CampaignType, ProductsCampaign} from "@/domain/entity/Campaign/campaign";
import type IProductRepository from "@/domain/repository/Product/IProductRepository";
import {Product} from "@/domain/entity/Product/product";

@injectable()
export default class GetProductOffersUseCase {
    private readonly bannerRepository: IBannerRepository;
    private readonly campaignRepository: ICampaignRepository;
    private readonly productRepository: IProductRepository;

    constructor(
        @inject(RepositoryTypes.BannerRepository) bannerRepository: IBannerRepository,
        @inject(RepositoryTypes.CampaignRepository) campaignRepository: ICampaignRepository,
        @inject(RepositoryTypes.ProductRepository) productRepository: IProductRepository
    ) {
        this.bannerRepository = bannerRepository;
        this.campaignRepository = campaignRepository;
        this.productRepository = productRepository;
    }

    async getProductOffers(){
        const [banners, campaigns] = await Promise.all([
            this.bannerRepository.getBanners({
                positions: [
                    MarketingPositions.OFFERS_AUTH_MAIN_BANNER_PRODUCTS,
                    MarketingPositions.OFFERS_GUEST_MAIN_BANNER_PRODUCTS,
                    MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_PRODUCTS,
                    MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_PRODUCTS,
                    MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS,
                    MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS
                ],
                page: 1,
                pageSize: 50
            }),
            this.campaignRepository.getCampaigns({
                positions: [
                    MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_OFFERS,
                    MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_OFFERS
                ],
                campaignType: CampaignType.PRODUCTS,
                pageSize: 50,
                page: 1
            })
        ])
        const productOffers = await Promise.all(campaigns.data.map(async (campaign) => {
            const banner = banners.data.find(banner => banner.campaignId === campaign.id);
            if(!banner) return null;

            const productsCampaign = campaign as ProductsCampaign;
            const orderedIds = [
                ...productsCampaign.priorityProducts,
                ...productsCampaign.productIds.filter(id => !productsCampaign.priorityProducts.includes(id))
            ].slice(0, 12);

            const products = await this.productRepository.getProducts({
                id: orderedIds,
                pageSize: 12,
            })
            const orderedProducts = orderedIds
                .map(id => products.data.find(product => product.id === id))
                .filter((product): product is Product => !!product);

            return {
                campaign: productsCampaign,
                banner: banner,
                products: orderedProducts,
            }
        }))
        const filteredProductOffers = productOffers.filter(productOffer => productOffer !== null);

        return {
            banners: banners.data.filter(banner =>
                !banner.positions.includes(MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS)
                && !banner.positions.includes(MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS)),
            productOffers: filteredProductOffers
        }
    }
}