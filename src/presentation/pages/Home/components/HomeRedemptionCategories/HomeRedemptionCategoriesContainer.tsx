import container from "@/presentation/config/inversify.config";
import HomeRedemptionsCategories from "./HomeRedemptionCategories";
import GetHomeContentUseCase from "@/domain/interactors/Home/GetHomeContentUseCase";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import HomeRedemptionCategoriesSkeleton from "./components/HomeRedemptionCategoriesSkeleton";



const HomeRedemptionsCategoriesContainer = async () => {

    try {
        const getHomeContentUseCase = container.get<GetHomeContentUseCase>(
            UseCaseTypes.GetHomeContentUseCase,
        );

        const redemptionCategories = await getHomeContentUseCase.getHomeRedemptionCategories()

        if(redemptionCategories.data.length ===0) return null

        return (
            <HomeRedemptionsCategories redemptionCategories={redemptionCategories.data} />
        )
    } catch {
        return <HomeRedemptionCategoriesSkeleton />
    }

};



export default HomeRedemptionsCategoriesContainer
