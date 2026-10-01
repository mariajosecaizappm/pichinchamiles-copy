"use client";

import { Suspense } from "react";
import ProductSearchBarContainer from "@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/ProductSearchBarContainer";
import HomeProductsSkeleton from "@/presentation/pages/Home/UseYourMiles/Products/HomeProductsSkeleton";

const ExploreProductsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Suspense fallback={<HomeProductsSkeleton />}>
            <div className="block md:hidden py-3 px-6">
                <ProductSearchBarContainer />
            </div>
            {children}
        </Suspense>
    );
};

export default ExploreProductsLayout;