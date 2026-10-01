import { MarketingPositions } from "@/domain/entity/Marketing/marketing";
import RepositoryTypes from "@/domain/entity/Types/RepositoryTypes";
import type IBannerRepository from "@/domain/repository/Banner/IBannerRepository";
import { inject, injectable } from "inversify";

@injectable()
export default class GetOffersBannerUseCase {
    private readonly bannerRepository: IBannerRepository;

    constructor(
        @inject(RepositoryTypes.BannerRepository)
            bannerRepository: IBannerRepository,
    ) {
        this.bannerRepository = bannerRepository;
    }

    private getBannerPosition(isLogged: boolean, type: "products" | "activities") {
        if (isLogged && type === "products") return MarketingPositions.OFFERS_AUTH_MAIN_BANNER_PRODUCTS
        if (isLogged && type === "activities") return MarketingPositions.OFFERS_AUTH_MAIN_BANNER_ACTIVITIES
        if (type === "products") return MarketingPositions.OFFERS_GUEST_MAIN_BANNER_PRODUCTS
        return MarketingPositions.OFFERS_GUEST_MAIN_BANNER_ACTIVITIES
    }

    async getTopBanner(isLogged: boolean, type: "products" | "activities") {

        const bannerPosition = this.getBannerPosition(isLogged, type)

        return this.bannerRepository.getBanners({
            positions: [bannerPosition],
            page: 1,
            pageSize: 1
        });
    }
}
