import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetExploreProductsContentUseCase from "@/domain/interactors/Home/UseYourMiles/Products/GetExploreProductsContentUseCase";
import container from "@/presentation/config/inversify.config";
import HeroProductsCarouselSkeleton from "./HeroBannersCarouselSkeleton";
import HeroProductsCarousel from "./HeroProductsCarousel";

const HeroProductsCarouselContainer = async () => {
    try {
        const getExploreProductsContentUseCase = container.get<GetExploreProductsContentUseCase>(
            UseCaseTypes.GetExploreProductsContentUseCase,
        );
        const banners = await getExploreProductsContentUseCase.getBanners();
        return <HeroProductsCarousel banners={banners?.data || []} />;
    } 
    catch {
        return <HeroProductsCarouselSkeleton />;
    }
};

export default HeroProductsCarouselContainer;
