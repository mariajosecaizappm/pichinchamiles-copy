import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetTravelsContentUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/GetTravelsContentUseCase";
import container from "@/presentation/config/inversify.config";
import BodyBanners from "./BodyBanners";
import BodyBannersSkeleton from "./BodyBannersSkeleton";

const BodyBannersContainer = async () => {
    try {
        const getTravelsContentUseCase = container.get<GetTravelsContentUseCase>(
            UseCaseTypes.GetTravelsContentUseCase
        )
        const banners = await getTravelsContentUseCase.getBodyBanners()
        return <BodyBanners banners={banners.data} />
    } catch {
        return <BodyBannersSkeleton />
    }
};

export default BodyBannersContainer;