"use client"
import { useParams } from "next/navigation"
import OrderByDrawer from "./OrderBy"
import PriceRangeDrawer from "./PriceRange"
import SubcategoriesDrawer from "./Subcategories"
import MobileFiltersWrapper from "./MobileFiltersWrapper"
import BrandsDrawer from "./Brands"

type Props = {
    className?: string
}

const MobileFilters = ({ className }: Props) => {
    const params = useParams()
    const subcategory = params.subcategory as string

    return (
        <MobileFiltersWrapper className={className}>
            {[
                <OrderByDrawer key="order-by" />,
                <PriceRangeDrawer key="price-range" />,
                ...(subcategory ? [<SubcategoriesDrawer key="subcategories" />] : []),
                <BrandsDrawer key="brands" />,
            ]}
        </MobileFiltersWrapper>
    )
}


export default MobileFilters