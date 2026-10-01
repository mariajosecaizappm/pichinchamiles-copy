
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetExploreProductsContentUseCase from "@/domain/interactors/Home/UseYourMiles/Products/GetExploreProductsContentUseCase";
import container from "@/presentation/config/inversify.config";
import Offers from "./Offers";
import OffersSkeleton from "./OffersSkeleton";

const OFFERS_SIZE = 5;

const OffersContainer = async () => {
    try {
        const getExploreProductsContentUseCase = container.get<GetExploreProductsContentUseCase>(
            UseCaseTypes.GetExploreProductsContentUseCase
        );
        const campaings = await getExploreProductsContentUseCase.getOffers(OFFERS_SIZE);
        return <Offers campaings={campaings} />;
    } catch {
        return <OffersSkeleton />
    }
};

export default OffersContainer;

