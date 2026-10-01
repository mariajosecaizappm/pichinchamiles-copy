"use client"

import type {Product} from "@/domain/entity/Product/product"
import ProductCard from "@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCard"
import {rememberProductsListLastProduct, takeProductsListLastProductId,} from "./productsListSessionScroll"
import {useEffect, useLayoutEffect} from "react"
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";

type Props = {
    products: Product[]
}

const ProductsListGrid = ({ products }: Props) => {
    const productIds = products.map((p) => p.id).join(",")
    const { track } = useAnalytics();

    useEffect(() => {
        if(products.length > 0){
            track(EventName.VIEWED_PRODUCTS, {products: products});
        }
    }, [products]);

    useLayoutEffect(() => {
        const lastId = takeProductsListLastProductId()
        if (!lastId || !products.some((p) => p.id === lastId)) {
            return
        }
        const el = document.getElementById(`product-list-item-${lastId}`)
        el?.scrollIntoView({ block: "nearest", behavior: "auto" })
    }, [productIds, products])

    return (
        <ul className="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-4">
            {products.map((product) => (
                <li
                    key={product.id}
                    id={`product-list-item-${product.id}`}
                    className="min-w-0"
                    onClickCapture={() => {
                        rememberProductsListLastProduct(product.id)
                    }}
                >
                    <ProductCard product={product} variant="products-page" />
                </li>
            ))}
        </ul>
    )
}

export default ProductsListGrid
