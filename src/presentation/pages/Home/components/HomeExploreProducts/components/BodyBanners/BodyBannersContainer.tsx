import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetExploreProductsContentUseCase from "@/domain/interactors/Home/UseYourMiles/Products/GetExploreProductsContentUseCase";
import container from "@/presentation/config/inversify.config";
import BodyBannersSkeleton from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/Flights/BodyBanners/BodyBannersSkeleton";
import BodyBanners from "./BodyBanners";

const BodyBannersContainer = async () => {
    try {
        const getExploreProductsContentUseCase = container.get<GetExploreProductsContentUseCase>(
            UseCaseTypes.GetExploreProductsContentUseCase
        );

        const banners = await getExploreProductsContentUseCase.getBodyBanners();
        return <BodyBanners banners={banners.data || []} />;
    } catch {
        return <BodyBannersSkeleton />
    }
};

export default BodyBannersContainer;

