import { MarketingPositions } from "@/domain/entity/Marketing/marketing";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import type IBannerRepository from "@/domain/repository/Banner/IBannerRepository";
import { inject, injectable } from "inversify";

@injectable()
export default class GetOffersPromoBannersUseCase {
    private readonly bannerRepository: IBannerRepository;

    constructor(
        @inject(RepositoryTypes.BannerRepository)
            bannerRepository: IBannerRepository,
    ) {
        this.bannerRepository = bannerRepository;
    }

    private getBannerPosition(isLogged: boolean, type: "products" | "activities") {
        if (isLogged && type === "products") return MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_PRODUCTS
        if (isLogged && type === "activities") return MarketingPositions.OFFERS_AUTH_BANNER_PROMOTIONAL_ACTIVITIES
        if (type === "products") return MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_PRODUCTS
        return MarketingPositions.OFFERS_GUEST_BANNER_PROMOTIONAL_ACTIVITIES
    }

    async getPromotionBanners(isLogged: boolean, type: "products" | "activities") {

        const bannerPosition = this.getBannerPosition(isLogged, type)

        return this.bannerRepository.getBanners({
            positions: [bannerPosition],
            page: 1,
            pageSize: 4
        });
    }
}
