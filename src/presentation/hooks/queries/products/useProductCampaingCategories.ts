import { useQuery } from "@tanstack/react-query";
import container from "@/presentation/config/inversify.config";
import GetProductCategoriesUseCase from "@/domain/interactors/Home/UseYourMiles/Products/GetProductCategoriesUseCase";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import { CategoryParams } from "@/domain/entity/Category/structure/category";

export const useProductCampaingCategories = (params?: CategoryParams, enabled: boolean = true) => {
    const categoryParams: CategoryParams = { ...params, isMainCategory: true }
    const getProductCategoriesUseCase = container.get<GetProductCategoriesUseCase>(
        UseCaseTypes.GetProductCategoriesUseCase,
    );
    return useQuery({
        queryKey: ["campaign-categories", categoryParams],
        queryFn: () => getProductCategoriesUseCase.getCategories(categoryParams),
        staleTime: 600000, // 10 minutes
        gcTime: 720000, // 12 minutes
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 1,
        enabled,
    })
}
