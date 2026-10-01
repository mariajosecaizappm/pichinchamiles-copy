"use client"

import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes"
import GetProductBrandsUseCase from "@/domain/interactors/Products/GetProductBrandsUseCase"
import container from "@/presentation/config/inversify.config"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

type Props = {
    brands: string[]
    enabled?: boolean
}

const useProductBrands = ({ brands, enabled = true }: Props) => {

    const getBrandsUseCase = useMemo(
        () =>
            container.get<GetProductBrandsUseCase>(
                UseCaseTypes.GetProductBrandsUseCase
            ),
        []
    )

    const getBrands = () => {
        if (!brands || brands.length === 0) return []
        return getBrandsUseCase.getBrands(brands)
    }

    const { data, isLoading } = useQuery({
        queryKey: ["filter-brands", brands],
        queryFn: getBrands,
        enabled: enabled && !!brands && brands.length > 0,
    })

    return {
        brands: data ?? [],
        isLoading,
    }
}

export default useProductBrands
