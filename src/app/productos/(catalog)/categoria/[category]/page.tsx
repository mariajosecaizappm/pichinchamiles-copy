import type { Metadata } from "next"
import { Search } from "@/domain/entity/Product/product"
import pageMetadata, { createPageMetadata } from "@/presentation/config/metadata"
import Products from "@/presentation/pages/Products"
import getCategorization from "@/presentation/pages/Products/lib/getCategorization"
import ProductsContentSkeleton from "@/presentation/pages/Products/components/skeletons/ProductsContentSkeleton"
import { Suspense } from "react"

type Props = {
    params: Promise<{
        category: string
    }>
    searchParams?: Promise<Partial<Search>>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category: categorySlug } = await params
    const categorization = await getCategorization()
    const category = categorization.getCategoryBySlug(categorySlug)

    if (!category) {
        return pageMetadata.productos
    }

    return createPageMetadata(category.name)
}

const Page = async ({ params, searchParams }: Props) => {
    try {
        const { category: categorySlug } = await params
        const resolvedSearchParams =
            searchParams === undefined ? {} : ((await searchParams) ?? {})

        const globalCategorization = await getCategorization()

        const categoryIds = globalCategorization.getCategoryAndSubcategoriesIds(categorySlug)

        return (
            <Suspense fallback={<ProductsContentSkeleton />}>
                <Products
                    searchParams={{ ...resolvedSearchParams, category: categoryIds }}
                />
            </Suspense>
        )
    } catch {
        return <ProductsContentSkeleton />
    }
}

export default Page
