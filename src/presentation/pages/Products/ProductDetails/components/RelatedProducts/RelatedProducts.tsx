"use client"

import { Product } from "@/domain/entity/Product/product";
import CardsSliderWrapper from "@/presentation/pages/Home/UseYourMiles/TravelAndActivities/components/CardsSliderWrapper/CardsSliderWrapper";
import ProductCard from "@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCard";
import useIsDesktop from "@/presentation/hooks/useIsDesktop";

type RelatedProductsProps = {
    products: Product[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
    const { isDesktop } = useIsDesktop(998)
    if (!products.length) return null;

    return (
        <div className="pb-6 w-full">
            <div className="px-6 py-3 lg:px-0">
                <h2 className="text-[22px] font-slab leading-7 font-normal text-blue-500">
                    Productos relacionados
                </h2>
            </div>
            <CardsSliderWrapper
                className="px-6 lg:overflow-x-auto lg:gap-4 lg:px-0 lg:w-[calc(100%-24px)] mx-auto"
                items={products}
                showLeftArrow={isDesktop}
                showRightArrow={isDesktop}
                renderItem={(product) => (
                    <ProductCard product={product} />
                )}
            />
        </div>
    );
};

export default RelatedProducts;
