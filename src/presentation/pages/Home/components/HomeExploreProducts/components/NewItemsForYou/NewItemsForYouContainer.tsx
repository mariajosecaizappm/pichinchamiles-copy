import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetExploreProductsContentUseCase from "@/domain/interactors/Home/UseYourMiles/Products/GetExploreProductsContentUseCase";
import container from "@/presentation/config/inversify.config";
import NewItemsForYou from "./NewItemsForYou";
import NewItemsForYouSkeleton from "./NewItemsForYouSkeleton";

const NewItemsForYouContainer = async () => {

    try {
        const getExploreProductsContentUseCase = container.get<GetExploreProductsContentUseCase>(
            UseCaseTypes.GetExploreProductsContentUseCase
        );
        const campaings = await getExploreProductsContentUseCase.getNewProducts();

        return <NewItemsForYou campaings={campaings ?? []} />;    
    } catch {
        return <NewItemsForYouSkeleton />;
    }
    
};

export default NewItemsForYouContainer;

