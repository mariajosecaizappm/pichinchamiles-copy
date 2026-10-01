import ProductsList from "./ProductsListContainer"
import { Search } from "@/domain/entity/Product/product"
import getProductsList from "@/presentation/pages/Products/lib/getProductsList"

type Props = {
    searchParams?: Partial<Search>
    className?: string
}

const ProductsListServerContainer = async ({
    searchParams,
    className,
}: Props) => {
    const { products, searchQuery } = await getProductsList(searchParams)
    return <ProductsList products={products} searchQuery={searchQuery} className={className} />
}

export default ProductsListServerContainer