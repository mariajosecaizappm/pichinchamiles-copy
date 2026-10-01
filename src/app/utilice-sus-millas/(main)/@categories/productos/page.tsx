import ProductCategories from "@/presentation/pages/Home/UseYourMiles/Products/Categories";
import ProductCategoriesSkeleton from "@/presentation/pages/Home/UseYourMiles/Products/Categories/ProductCategoriesSkeleton";
import { Suspense } from "react";

const ProductsPage = () => {
    return (
        <Suspense fallback={<ProductCategoriesSkeleton/>}>
            <ProductCategories />
        </Suspense>
    )
}

export default ProductsPage