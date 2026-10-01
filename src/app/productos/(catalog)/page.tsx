import type { Metadata } from "next"
import { Search } from "@/domain/entity/Product/product"
import Products from "@/presentation/pages/Products"
import ProductsContentSkeleton from "@/presentation/pages/Products/components/skeletons/ProductsContentSkeleton"
import pageMetadata from "@/presentation/config/metadata"

export const metadata: Metadata = pageMetadata.productos

type Props = {
    searchParams?: Promise<Partial<Search>>
}

const Page = async ({ searchParams }: Props) => {
    try {
        const resolvedSearchParams = await searchParams

        return (
            <Products searchParams={resolvedSearchParams} />
        )
    } catch {
        return <ProductsContentSkeleton />
    }
}

export default Page
