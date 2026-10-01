import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetTravelsContentUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/GetTravelsContentUseCase";
import container from "@/presentation/config/inversify.config";
import HeroFlightsCarouselClient from "./HeroFlightsCarouselClient";
import HeroBannersCarouselSkeleton from "../../../Products/HeroCarousel/HeroBannersCarouselSkeleton";

const HeroFlightsCarouselContainer = async () => {
    try {
        const getTravelsContentUseCase = container.get<GetTravelsContentUseCase>(
            UseCaseTypes.GetTravelsContentUseCase,
        );
        const banners = await getTravelsContentUseCase.getTopBanners();
        return <HeroFlightsCarouselClient banners={banners.data} />
    } catch {
        return <HeroBannersCarouselSkeleton />
    }
};

export default HeroFlightsCarouselContainer;
