import {CategoryGroup} from "@/domain/entity/Category/structure/category";
import useProductSearch from "@/presentation/hooks/useProductSearch";
import {
    buildCategoryParams,
    buildProductsHref,
    readSubcategoryIds,
} from "@/presentation/pages/Products/components/ProductsFilters/ProductsFiltersConfig";
import useProductSubcategories from "@/presentation/pages/Products/hooks/useProductSubcategories";
import {useParams, usePathname, useRouter} from "next/navigation";
import {useEffect, useState, useTransition} from "react";
import SubcategoriesFilter from "./SubcategoriesFilter";
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";

type Props = {
    requireMainSubcategory?: boolean
    title?: string
    breadcrumbLabel?: string
}

const SubcategoriesFilterContainer = ({
    requireMainSubcategory = true,
    title,
    breadcrumbLabel,
}: Props = {}) => {
    const params = useParams()
    const pathname = usePathname()
    const currentMainSubcategory = params.subcategory as string
    const router = useRouter()
    const { searchParams } = useProductSearch()
    const [isPending, startTransition] = useTransition()
    const { track } = useAnalytics()

    const { subcategories } = useProductSubcategories()
    const [activeNestedSubcategory, setActiveNestedSubcategory] = useState<CategoryGroup | null>(null)

    const toggleSubcategoryId = (subcategory: CategoryGroup) => {
        if (!subcategory?.id) return
        const current = readSubcategoryIds(searchParams)
        startTransition(() => {
            router.push(
                buildProductsHref(pathname, searchParams, buildCategoryParams(current, subcategory.id)),
            )
        })
    }

    const handleSubcategoryClick = (subcategory: CategoryGroup) => {
        track(EventName.CLICKED_FILTERS, { type: "category", filter: subcategory });

        if (subcategory.subcategories?.length) {
            setActiveNestedSubcategory(subcategory)
        } else {
            toggleSubcategoryId(subcategory)
        }
    }

    useEffect(() => {
        if(subcategories.length > 0){
            track(EventName.VIEWED_FILTER, {filters: subcategories})
        }
    }, [subcategories]);

    if (requireMainSubcategory && (!currentMainSubcategory || !subcategories?.length)) return null

    return (
        <SubcategoriesFilter
            subcategories={subcategories}
            activeNestedSubcategory={activeNestedSubcategory}
            setActiveNestedSubcategory={setActiveNestedSubcategory}
            onSelectSubcategory={handleSubcategoryClick}
            isPending={isPending}
            title={title}
            breadcrumbLabel={breadcrumbLabel}
        />
    )
}

export default SubcategoriesFilterContainer

