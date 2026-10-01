"use client"

import ProductSearchBar from "@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar"
import MobileToolbarWrapper from "./MobileToolbarWrapper"
import { cn } from "@heroui/react"

type Props = {
    filtersDrawer: React.ReactNode
    mobileFilters: React.ReactNode
}

const ProductsToolbar = ({ filtersDrawer, mobileFilters }: Props) => {
    return (
        <MobileToolbarWrapper>
            <div className={cn("body-container py-3 flex gap-2")}>
                <div className="flex-1">
                    <ProductSearchBar />
                </div>
                {filtersDrawer}
            </div>
            <div className="block lg:hidden">
                {mobileFilters}
            </div>
        </MobileToolbarWrapper>
    )
}

export default ProductsToolbar
