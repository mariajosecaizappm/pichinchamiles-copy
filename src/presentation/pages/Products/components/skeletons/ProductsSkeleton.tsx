"use client"

import ProductCategoriesSkeleton from "../../../Home/UseYourMiles/Products/Categories/ProductCategoriesSkeleton"
import ProductsContentSkeleton from "./ProductsContentSkeleton"

const ProductsSkeleton = () => {


    return (
        <div>
            <div
                className="w-full max-w-330 md:px-4 lg:px-6 mx-auto md:pt-3"
            >
                <ProductCategoriesSkeleton />         
            </div>
            <ProductsContentSkeleton />
        </div>

    )
}

export default ProductsSkeleton