"use client"

import { ProductSearch } from "@/domain/entity/Product/product"
import useProductsOfferContext from "@/presentation/pages/Offers/Products/Offer/context/useProductsOfferContext"
import ProductCampaignSearchResultsText from "./components/ProductCampaignSearchResultsText"
import ProductsListBaseContainer from "@/presentation/pages/Products/components/ProductsList/ProductsListBaseContainer"

type Props = {
    products: ProductSearch | null
    searchQuery?: string
}

const ProductsCampaignListContainer = ({ products, searchQuery = "" }: Props) => {
    const { brandIds, setBrandIds } = useProductsOfferContext()

    return (
        <ProductsListBaseContainer
            products={products}
            searchQuery={searchQuery}
            brandIds={brandIds}
            onBrandsChange={setBrandIds}
            className="py-0"
            searchResultsText={
                <ProductCampaignSearchResultsText
                    searchQuery={searchQuery}
                    total={products?.list.pagination.total ?? 0}
                />
            }
            noResultsClassName="mt-0"
        />
    )
}

export default ProductsCampaignListContainer