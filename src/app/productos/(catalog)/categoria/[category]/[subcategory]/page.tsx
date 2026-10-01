import type { Metadata } from "next"
import { Search } from "@/domain/entity/Product/product"
import pageMetadata, { createPageMetadata } from "@/presentation/config/metadata"
import Products from "@/presentation/pages/Products"
import ProductsContentSkeleton from "@/presentation/pages/Products/components/skeletons/ProductsContentSkeleton"
import getCategorization from "@/presentation/pages/Products/lib/getCategorization"
import { Suspense } from "react"

type Props = {
    params: Promise<{
        category: string
        subcategory: string
    }>
    searchParams?: Promise<Partial<Search> & { subcategory?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { subcategory: subcategorySlug } = await params
    const categorization = await getCategorization()
    const subcategory = categorization.getCategoryBySlug(subcategorySlug)

    if (!subcategory) {
        return pageMetadata.productos
    }

    return createPageMetadata(subcategory.name)
}

const SubcategoryPage = async ({ params, searchParams }: Props) => {
    try {
        const { subcategory: subcategorySlug } = await params
        const resolvedSearchParams =
            searchParams === undefined ? {} : ((await searchParams) ?? {})
        const categorization = await getCategorization()

        const getCategories = () => {
            const categoriesParam = resolvedSearchParams.subcategory?.split(",").filter(Boolean)
            if (!categoriesParam || categoriesParam.length === 0) {
                return categorization.getCategoryAndSubcategoriesIds(subcategorySlug)
            }
            return categoriesParam
        }

        const categoryIds = getCategories()

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

export default SubcategoryPage
