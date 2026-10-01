import { Category, CategoryParams } from "@/domain/entity/Category/structure/category";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import GetProductCategoriesUseCase from "@/domain/interactors/Home/UseYourMiles/Products/GetProductCategoriesUseCase";
import container from "@/presentation/config/inversify.config";
import { useQuery } from "@tanstack/react-query";

export const useProductCategories = (params?: CategoryParams, enabled: boolean = true) => {
    return useQuery<Category[]>({
        queryKey: ["product-categories", params],
        queryFn: async () => {
            const getProductCategoriesUseCase = container.get<GetProductCategoriesUseCase>(
                UseCaseTypes.GetProductCategoriesUseCase,
            );
            return getProductCategoriesUseCase.getHomeMenuMainCategories(params);
        },
        staleTime: 600000, // 10 minutes
        gcTime: 720000, // 12 minutes
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 1,
        enabled
    });
};
