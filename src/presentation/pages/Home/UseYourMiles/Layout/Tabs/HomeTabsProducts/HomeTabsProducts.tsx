"use client";

import { Suspense } from "react";
import ProductSearchBarContainer from "@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar/ProductSearchBarContainer";
import ProductCategories from "../../../Products/Categories/ProductCategories";
import type { Category } from "@/domain/entity/Category/structure/category";

type Props = {
    categories: Category[];
}

const HomeTabsProducts = ({
    categories,
}: Props) => {
    return (
        <Suspense>
            <div className="w-full base-container px-0 lg:px-3.75  xl:max-w-318.5 flex flex-col-reverse lg:flex-row gap-3 lg:gap-6 items-center lg:items-start">
                <div className="w-full lg:w-[40%] px-6 lg:p-0">
                    <ProductSearchBarContainer />
                </div>
                <div className="w-full lg:w-[60%] lg:-mt-12.5">
                    <ProductCategories categories={categories} />
                </div>
            </div>
        </Suspense>
    );
};

export default HomeTabsProducts;
