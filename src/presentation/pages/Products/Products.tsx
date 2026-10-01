import { Suspense } from "react"
import DesktopToolbar from "./components/DesktopToolbar"
import MobileToolbar from "./components/ProductsToolbar"
import DesktopFilters from "./components/ProductsFilters/DesktopFilters"
import ProductsList from "./components/ProductsList"
import ProductsListSkeleton from "./components/ProductsList/ProductsListSkeleton"
import ProductsCatalogLayout from "./components/ProductsCatalogLayout"
import { Search } from "@/domain/entity/Product/product"

type Props = {
    searchParams?: Partial<Search>
}

const Products = ({ searchParams }: Props) => (
    <>
        <MobileToolbar />
        <ProductsCatalogLayout desktopFilters={<DesktopFilters />}>
            <DesktopToolbar />
            <Suspense
                fallback={
                    <div className="px-6 lg:px-0 lg:pt-3">
                        <ProductsListSkeleton />
                    </div>
                }
            >
                <ProductsList searchParams={searchParams} />
            </Suspense>
        </ProductsCatalogLayout>
    </>
)

export default Products
