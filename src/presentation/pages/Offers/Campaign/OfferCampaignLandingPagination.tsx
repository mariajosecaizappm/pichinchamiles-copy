"use client"

import Pagination from "@/presentation/components/Pagination"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

type Props = {
    page: number
    totalPages: number
}

const OfferCampaignLandingPagination = ({ page, totalPages }: Props) => {
    const router = useRouter()
    const pathname = usePathname() ?? ""
    const searchParams = useSearchParams()

    const onChangePage = useCallback(
        (nextPage: number) => {
            const params = new URLSearchParams(searchParams.toString())

            if (nextPage <= 1) {
                params.delete("page")
            } else {
                params.set("page", String(nextPage))
            }

            const query = params.toString()
            router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
        },
        [router, pathname, searchParams],
    )

    if (totalPages <= 1) {
        return null
    }

    return (
        <div className="flex justify-center pt-6 w-fit mx-auto">
            <Pagination total={totalPages} page={page} onChange={onChangePage} />
        </div>
    )
}

export default OfferCampaignLandingPagination
