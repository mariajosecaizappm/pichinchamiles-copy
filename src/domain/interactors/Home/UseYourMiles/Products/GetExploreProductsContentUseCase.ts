import { CampaignStatus, CampaignType, ProductsCampaign, ProductsCampaignBanner } from "@/domain/entity/Campaign/campaign";
import { MarketingPositions } from "@/domain/entity/Marketing/marketing";
import { Product } from "@/domain/entity/Product/product";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import type IBannerRepository from "@/domain/repository/Banner/IBannerRepository";
import type ICampaignRepository from "@/domain/repository/Campaign/ICampaignRepository";
import type IProductRepository from "@/domain/repository/Product/IProductRepository";
import { inject, injectable } from "inversify";
import { Banner } from "@/domain/entity/Banner/banner";

@injectable()
export default class GetExploreProductsContentUseCase {
    private readonly bannerRepository: IBannerRepository;
    private campaignRepository: ICampaignRepository;
    private productRepository: IProductRepository;

    constructor(
        @inject(RepositoryTypes.BannerRepository)
            bannerRepository: IBannerRepository,
        @inject(RepositoryTypes.CampaignRepository)
            campaignRepository: ICampaignRepository,
        @inject(RepositoryTypes.ProductRepository)
            productRepository: IProductRepository,
    ) {
        this.bannerRepository = bannerRepository;
        this.campaignRepository = campaignRepository;
        this.productRepository = productRepository;
    }

    async getBanners() {
        const positions = [
            MarketingPositions.HOME_LOGGED_MAIN_SLIDER,
            MarketingPositions.HOME_NOT_LOGGED_MAIN_SLIDER
        ];

        return this.bannerRepository.getBanners({
            positions: positions,
            page: 1,
            pageSize: 10
        });
    }

    async fetchProductsByCampaign(activeCampaigns: ProductsCampaign[]): Promise<Map<string, Product[]>> {
        const productsByCampaignId = new Map<string, Product[]>();
        await Promise.all(activeCampaigns.map(async (campaign) => {
            const orderedIds = [
                ...campaign.priorityProducts,
                ...campaign.productIds.filter(id => !campaign.priorityProducts.includes(id))
            ];
            const list = await this.productRepository.getProductSearch({
                id: orderedIds,
                page: 1,
                pageSize: orderedIds.length,
            });
            const orderedData = orderedIds
                .map(id => list.list.data.find(p => p.id === id))
                .filter((p): p is Product => !!p);
            productsByCampaignId.set(campaign.id, orderedData);
        }));
        return productsByCampaignId;
    }

    async getNewProducts(): Promise<ProductsCampaignBanner[]> {
        const positions = [
            MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_NEW_ITEMS_FOR_YOU,
            MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_NEW_ITEMS_FOR_YOU
        ];

        const { data } = await this.campaignRepository.getCampaigns({
            positions: positions,
            campaignType: CampaignType.PRODUCTS,
            page: 1,
            pageSize: 5
        });


        const campaigns = data.toSorted((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

        const activeCampaigns = campaigns.filter((campaign) => campaign.status === CampaignStatus.ACTIVE) as ProductsCampaign[];
        
        const campaignsWithMaxFifteenProducts = activeCampaigns.map((campaign) => ({
            ...campaign,
            priorityProducts: [
                ...campaign.priorityProducts,
                ...campaign.productIds.filter(id => !campaign.priorityProducts.includes(id))
            ].slice(0, 15),
            productIds: []
        }));

        const productsByCampaignId = await this.fetchProductsByCampaign(campaignsWithMaxFifteenProducts);

        return campaignsWithMaxFifteenProducts.map((campaign) => ({
            campaign,
            products: productsByCampaignId.get(campaign.id) || [],
            banner: {} as Banner
        }))
    }

    async getOffers(campaignSize: number) {
        const campaignPositions = [
            MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_OFFERS,
            MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_OFFERS
        ]

        const bannerPositions = [
            MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_OFFERS,
            MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_OFFERS
        ]

        const banners = await this.bannerRepository.getBanners({
            positions: bannerPositions,
            page: 1,
            pageSize: campaignSize
        });

        const campaignList = await this.campaignRepository.getCampaigns({
            id: banners.data.map(banner => banner?.campaignId),
            positions: campaignPositions,
            campaignType: CampaignType.PRODUCTS,
            pageSize: campaignSize,
            page: 1,
        });

        const campaigns = banners.data.map((banner) => {
            const campaignParts = campaignList.data.filter((c) => c.id === banner?.campaignId)
                .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
            const productIds = campaignParts.map((c) => (c as ProductsCampaign).productIds).flat();
            const mainCampaign = campaignParts[0] as ProductsCampaign;
            return {
                ...mainCampaign,
                productIds
            };
        })

        const activeCampaigns = campaigns.filter((campaign) => campaign.status === CampaignStatus.ACTIVE) as ProductsCampaign[];

        const productsByCampaignId = await this.fetchProductsByCampaign(activeCampaigns);

        const campaignBannerMap = new Map<string, ProductsCampaignBanner>();

        banners.data.forEach(banner => {
            if (!banner?.campaignId) return;
            const campaign = activeCampaigns.find((campaign) => campaign.id === banner?.campaignId);
            if (campaign) {
                const existing = campaignBannerMap.get(campaign.id);
                if (!existing || banner.priority < existing.banner.priority) {
                    campaignBannerMap.set(campaign.id, {
                        banner,
                        campaign,
                        products: (productsByCampaignId.get(campaign.id) ?? []).slice(0, 12)
                    });
                }
            }
        })

        return Array.from(campaignBannerMap.values()).sort((a, b) => {
            if (a.banner.priority < b.banner.priority) return -1;
            if (a.banner.priority > b.banner.priority) return 1;
            return 0
        })
    }


    async getBodyBanners() {
        const positions = [
            MarketingPositions.HOME_LOGGED_USE_YOUR_MILES_BANNER_BODY,
            MarketingPositions.HOME_NOT_LOGGED_USE_YOUR_MILES_BANNER_BODY
        ];

        return this.bannerRepository.getBanners({
            positions: positions,
            page: 1,
            pageSize: 3
        });
    }
}
