import { CategoryGroup } from "@/domain/entity/Category/structure/category"
import FilterAccordion from "../../FilterAccordion"
import ToggleFilter from "../ToggleFilter"

type Props = {
    subcategories: CategoryGroup[]
    onSelectSubcategory: (subcategory: CategoryGroup) => void,
    selectedSubcategories: CategoryGroup[]
}

const SubcategoriesOptions = ({ subcategories, onSelectSubcategory, selectedSubcategories }: Props) => {
    return (
        <FilterAccordion
            title={"Subcategorías"}
            defaultExpanded
        >
            {subcategories?.map((subcategory) => (
                <ToggleFilter
                    key={subcategory.id}
                    onPress={() => onSelectSubcategory(subcategory)}
                    isActive={selectedSubcategories.some((sub) => sub.id === subcategory.id) || selectedSubcategories.some((sub) => sub.parent?.id === subcategory.id)}
                >
                    {subcategory.name}
                </ToggleFilter>
            ))}
        </FilterAccordion>
    )
}

export default SubcategoriesOptions