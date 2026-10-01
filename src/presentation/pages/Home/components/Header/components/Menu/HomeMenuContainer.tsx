import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetProductCategoriesUseCase from "@/domain/interactors/Home/UseYourMiles/Products/GetProductCategoriesUseCase";
import container from "@/presentation/config/inversify.config";
import HomeMenu from "./HomeMenu";

const HomeMenuContainer = async () => {

    try {
        const getProductCategoriesUseCase = container.get<GetProductCategoriesUseCase>(UseCaseTypes.GetProductCategoriesUseCase);
        const productCategories = await getProductCategoriesUseCase.getHomeMenuMainCategories({
            pageSize: 20,
            isMainCategory: true
        });
        return (
            <HomeMenu productCategories={productCategories} />
        )
    } catch {
        return (
            <HomeMenu />
        )
    }

};

export default HomeMenuContainer;