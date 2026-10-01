import { BannerCategory } from "@/domain/entity/Banner/banner";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetTravelsContentUseCase from "@/domain/interactors/Home/UseYourMiles/Travels/GetTravelsContentUseCase";
import container from "@/presentation/config/inversify.config";
import FeaturedItems from "./FeaturedItems";
import FeaturedItemsSkeleton from "./FeaturedItemsSkeleton";

type Props = {
    title: string;
    category: BannerCategory;
}

const FeaturedItemsContainer = async ({ title, category }: Props) => {
    try {
        const getTravelsContentUseCase = container.get<GetTravelsContentUseCase>(
            UseCaseTypes.GetTravelsContentUseCase,
        );
        const items = await getTravelsContentUseCase.getRecommendedItems({ category });
        return <FeaturedItems items={items.data} title={title} />
    } catch {
        return <FeaturedItemsSkeleton />
    }
}

export default FeaturedItemsContainer;