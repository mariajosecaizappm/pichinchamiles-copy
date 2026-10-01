"use client"

import { useMemo } from "react"
import { useProductsContext } from "../context/useProductsContext"


const useProductsConfig = () => {
    const { categorization } = useProductsContext()


    const getSubcategoriesBySlug = useMemo(() => {
        return (slug: string) => {
            if (!slug || !categorization) return []
            return categorization.getSubcategoriesBySlug(slug)
        }
    }, [categorization])


    return {
        getSubcategoriesBySlug
    }
}

export default useProductsConfig