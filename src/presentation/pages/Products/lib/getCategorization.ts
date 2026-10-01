import { cache } from "react";
import Categorization from "@/domain/entity/Category/models/Categorization";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetProductCategoriesUseCase from "@/domain/interactors/Home/UseYourMiles/Products/GetProductCategoriesUseCase";
import container from "@/presentation/config/inversify.config";
import { CategoryParams } from "@/domain/entity/Category/structure/category";

const getCategorization = cache(async (params?: CategoryParams) => {
    const getProductCategoriesUseCase = container.get<GetProductCategoriesUseCase>(
        UseCaseTypes.GetProductCategoriesUseCase,
    );
    const categories = await getProductCategoriesUseCase.getHomeMenuMainCategories(params, 0);
    return new Categorization(categories);
});

export default getCategorization;
