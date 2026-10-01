"use client"

import { AllFiltersDrawerProps } from "./types";
import AllFiltersWrapper from "./components/AllFiltersWrapper";


const AllFiltersDrawer = ({
    isOpen,
    onOpen,
    onOpenChange,
    handleClose,
    onClearFilters,
    onApplyFilters,
    children,
}: AllFiltersDrawerProps) => {
    return (
        <AllFiltersWrapper
            isOpen={isOpen}
            onOpen={onOpen}
            onOpenChange={onOpenChange}
            handleClose={handleClose}
            onClearFilters={onClearFilters}
            onApplyFilters={onApplyFilters}
        >
            {children}
        </AllFiltersWrapper>
    )
}

export default AllFiltersDrawer