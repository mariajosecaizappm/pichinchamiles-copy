import { CategoryGroup } from "@/domain/entity/Category/structure/category";
import FilterAccordion from "@/presentation/pages/Products/components/ProductsFilters/FilterAccordion";
import { Divider } from "@heroui/react";
import SubcategoryFilterItem from "./SubcategoryFilterItem";

type Props = {
    subcategories: CategoryGroup[]
    activeNestedSubcategory: CategoryGroup | null
    setActiveNestedSubcategory: (subcategory: CategoryGroup | null) => void
    onSelectSubcategory: (subcategory: CategoryGroup) => void
    isPending?: boolean
    title?: string
    breadcrumbLabel?: string
}

const SubcategoriesFilter = ({
    subcategories,
    activeNestedSubcategory,
    setActiveNestedSubcategory,
    onSelectSubcategory,
    isPending = false,
    title = "Subcategorías",
    breadcrumbLabel = "Subcategorías",
}: Props) => {
    return (
        <>
            <Divider className="bg-darkGrayishBlue-300" />
            <FilterAccordion className="px-4" title={title}>
                <div className="flex flex-col gap-2 w-full">
                    {
                        activeNestedSubcategory ? (
                            <div className="flex flex-col gap-2 w-full">
                                <div className="flex gap-2 text-sm leading-5">
                                    <button
                                        className="text-grayscale-400 cursor-pointer"
                                        onClick={() => setActiveNestedSubcategory(null)}
                                    >
                                        <span>{breadcrumbLabel}</span>
                                    </button>
                                    {" / "} <span className="font-semibold text-blue-500">{activeNestedSubcategory.name}</span>
                                </div>
                                {activeNestedSubcategory.subcategories?.map((subcategory) => (
                                    <SubcategoryFilterItem
                                        key={subcategory.id}
                                        subcategory={subcategory}
                                        onSelectSubcategory={onSelectSubcategory}
                                        isPending={isPending}
                                    />
                                ))}
                            </div>
                        ) : (
                            subcategories?.map((subcategory) => (
                                <SubcategoryFilterItem
                                    key={subcategory.id}
                                    subcategory={subcategory}
                                    onSelectSubcategory={onSelectSubcategory}
                                    isPending={isPending}
                                />
                            ))
                        )
                    }
                </div>
            </FilterAccordion>
        </>
    )
}

export default SubcategoriesFilter

