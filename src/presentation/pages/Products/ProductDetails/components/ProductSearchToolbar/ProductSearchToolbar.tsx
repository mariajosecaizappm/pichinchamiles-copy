"use client"
import useIsDesktop from "@/presentation/hooks/useIsDesktop";
import ProductSearchBar from "@/presentation/pages/Home/UseYourMiles/Products/ProductSearchBar";
import { useEffect, useState } from "react";
import ProductSearchToolbarSkeleton from "./ProductSearchToolbarSkeleton";

const ProductSearchToolbar = () => {
    const { isDesktop } = useIsDesktop(998)
    const [hasHydrated, setHasHydrated] = useState(false)

    useEffect(() => {
        setHasHydrated(true)
    }, [])

    if (!hasHydrated) {
        return <ProductSearchToolbarSkeleton />
    }

    return (
        <ProductSearchBar displaySubmitButton={!isDesktop} />
    );
};

export default ProductSearchToolbar;