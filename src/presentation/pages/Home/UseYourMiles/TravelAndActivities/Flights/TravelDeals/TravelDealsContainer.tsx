import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetTravelsContentUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/GetTravelsContentUseCase";
import container from "@/presentation/config/inversify.config";
import TravelDeals from "./TravelDeals";
import TravelDealsSkeleton from "./TravelDealsSkeleton";

const TravelDealsContainer = async () => {
    try {
        const getTravelsContentUseCase = container.get<GetTravelsContentUseCase>(
            UseCaseTypes.GetTravelsContentUseCase
        )
        const offers = await getTravelsContentUseCase.getOffers()
        return <TravelDeals offers={offers ?? []} />
    } catch {
        return <TravelDealsSkeleton />
    }
};

export default TravelDealsContainer;
