"use client"

import { Suspense } from "react";
import ProductSearchBarContainer from "@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/ProductSearchBarContainer";
const Page = () => {
    return (
        <div className="pt-3">
            <Suspense fallback={<div className="h-12 w-full" />}>
                <ProductSearchBarContainer />
            </Suspense>
        </div>
    );
};

export default Page