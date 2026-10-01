"use client"

import Pagination from "@/presentation/components/Pagination"
import useProductSearch from "@/presentation/hooks/useProductSearch"

type Props = {
    page: number
    totalPages: number
}

const ProductsListPagination = ({ page, totalPages }: Props) => {
    const { onChangePage } = useProductSearch()

    if (totalPages <= 1) {
        return null
    }

    return (
        <div className="flex justify-center pt-6 w-fit mx-auto">
            <Pagination total={totalPages} page={page} onChange={onChangePage} />
        </div>
    )
}

export default ProductsListPagination
