"use client"

import ProductsToolbar from "./ProductsToolbar"
import AllFiltersDrawer from "../ProductsFilters/AllFiltersDrawer"
import MobileFilters from "../ProductsFilters/MobileFilters"

const MobileToolbar = () => {
    return (
        <ProductsToolbar
            filtersDrawer={<AllFiltersDrawer />}
            mobileFilters={<MobileFilters />}
        />
    )
}

export default MobileToolbar
