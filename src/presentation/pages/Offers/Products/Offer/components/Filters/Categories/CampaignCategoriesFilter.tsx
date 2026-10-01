import { Divider, RadioGroup, Skeleton } from "@heroui/react"
import FilterAccordion from "@/presentation/pages/Products/components/ProductsFilters/FilterAccordion"
import { Radio } from "@/presentation/components/Form/components/Radio"
import { Category } from "@/domain/entity/Category/structure/category"
import ShowAllFilters from "@/presentation/pages/Products/components/ProductsFilters/MobileFilters/Brands/ShowAllFilters"

type Props = {
    categories: Category[]
    isLoading: boolean
    showAllCategories: boolean
    setShowAllCategories: (showAllCategories: boolean) => void
    currentCategory: string
    onCheckCategory: (value: string) => void
    onPressCategory: (event: React.PointerEvent<HTMLDivElement>, category: Category) => void
    isPendingTransition: boolean
    onAccordionOpenChange?: (isOpen: boolean) => void
}

const DEFAULT_CATEGORIES_TO_SHOW = 7
const CampaignCategoriesFilter = ({ categories, isLoading, showAllCategories, setShowAllCategories, currentCategory, onCheckCategory, onPressCategory, isPendingTransition, onAccordionOpenChange }: Props) => {
    return (
        <>
            <Divider className="bg-darkGrayishBlue-300" />
            <FilterAccordion className="px-4" title="Categorías" onExpandedChange={onAccordionOpenChange}>
                {isLoading ? (
                    <div className="">
                        {Array.from({ length: DEFAULT_CATEGORIES_TO_SHOW / 2 }).map((_, index) => {
                            const key = `category-${index}`
                            return (
                                <div key={key} className="w-full h-12 flex items-center gap-2">
                                    <div className="h-full w-12 flex items-center justify-center">
                                        <Skeleton className="w-5 h-5 rounded-full" />
                                    </div>
                                    <Skeleton className="w-24 h-4 rounded-sm" />
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div
                        data-collapsed={showAllCategories}
                        className={"w-full h-full overflow-y-auto max-h-153"}>
                        <RadioGroup
                            isDisabled={isPendingTransition}
                            value={currentCategory}
                            onValueChange={onCheckCategory}
                            classNames={{
                                wrapper: "gap-2"
                            }}
                        >
                            {
                                categories.slice(0, showAllCategories ? categories.length : DEFAULT_CATEGORIES_TO_SHOW).map((category) => (
                                    <div
                                        key={category.id}
                                        className="w-full"
                                        onPointerDownCapture={(event) => onPressCategory(event, category)}
                                    >
                                        <Radio value={category.id}>
                                            {category.name}
                                        </Radio>
                                    </div>
                                ))
                            }
                            {
                                categories.length > DEFAULT_CATEGORIES_TO_SHOW && (
                                    <ShowAllFilters showAll={showAllCategories} setShowAll={setShowAllCategories} />
                                )
                            }
                        </RadioGroup>
                    </div>
                )}
              
            </FilterAccordion>
        </>
    )
}


export default CampaignCategoriesFilter