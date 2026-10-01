"use client"

import { Divider } from "@heroui/react"
import BrandFilter from "./Brands"
import PriceRangeFilter from "./PriceRange"
import SubcategoriesFilter from "./Subcategories"

const DesktopFilters = () => {
    return (
        <>
            <Divider className="bg-darkGrayishBlue-300" />
            <PriceRangeFilter />
            <SubcategoriesFilter />
            <BrandFilter />
            <Divider className="bg-darkGrayishBlue-300" />
        </>
    )
}

export default DesktopFilters