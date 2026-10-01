"use client";

import { useQuery } from "@tanstack/react-query";
import { Product } from "@/domain/entity/Product/product";
import GetRecommendedProductsUseCase from "@/domain/interactors/Products/GetRecommendedProductsUseCase";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";
import container from "@/presentation/config/inversify.config";
import useSession from "@/presentation/hooks/useSession";
import CardsSliderWrapper from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/CardsSliderWrapper/CardsSliderWrapper";
import ProductCard from "@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCard";
import useIsDesktop from "@/presentation/hooks/useIsDesktop";

const ShoppingCartRecommendedProducts = () => {
    const { isLogged } = useSession();
    const { isDesktop } = useIsDesktop(998);
    const { data: products = [] } = useQuery<Product[]>({
        queryKey: ["shopping-cart-recommended-products", isLogged],
        queryFn: async () => {
            const useCase = container.get<GetRecommendedProductsUseCase>(
                UseCaseTypes.GetRecommendedProductsUseCase
            );
            const recommendedProducts = await useCase.getPublicRecommendedProducts();

            return recommendedProducts.filter(product => product.assets?.length);
        },
    });

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="flex w-full flex-col gap-3">
            <h2 className="font-slab text-[22px] font-normal leading-7 text-blue-500">
                Productos recomendados
            </h2>
            <CardsSliderWrapper
                className="gap-4 p-3 lg:overflow-x-auto"
                items={products}
                showLeftArrow={isDesktop}
                showRightArrow={isDesktop}
                renderItem={(product) => <ProductCard product={product} />}
            />
        </section>
    );
};

export default ShoppingCartRecommendedProducts;
