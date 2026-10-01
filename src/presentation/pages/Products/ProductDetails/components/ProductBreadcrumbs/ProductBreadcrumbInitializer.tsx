"use client"
import {FC, useEffect} from "react";
import {useProductDetailsContext} from "@/presentation/pages/Products/ProductDetails/context/useProductDetailsContext";
import {ProductCategory} from "@/domain/entity/Product/product";

type ProductBreadcrumbInitializerProps = {
    categories: ProductCategory[]
}

const ProductBreadcrumbInitializer: FC<ProductBreadcrumbInitializerProps> = ({categories}) => {
    const { setRootCategory } = useProductDetailsContext();

    useEffect(() => {
        if(categories.length > 0){
            setRootCategory(categories[0].name)
        }
    }, [categories]);

    return null;
};

export default ProductBreadcrumbInitializer;