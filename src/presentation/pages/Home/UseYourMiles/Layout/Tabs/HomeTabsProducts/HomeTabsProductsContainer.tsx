"use client";

import HomeTabsProducts from "./HomeTabsProducts";
import HomeTabsProductsSkeleton from "../../../Products/Categories/ProductCategoriesSkeleton";
import { useProductCategories } from "@/presentation/hooks/queries/products/useProductCategories";

const HomeTabsProductsContainer = () => {
    const { data: categories, isLoading, error } = useProductCategories();

    if (isLoading || error || !categories || categories.length === 0) {
        return <HomeTabsProductsSkeleton />;
    }

    return <HomeTabsProducts categories={categories} />;
};

export default HomeTabsProductsContainer;
