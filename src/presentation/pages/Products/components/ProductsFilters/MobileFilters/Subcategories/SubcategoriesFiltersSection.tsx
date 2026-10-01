import { CategoryGroup } from "@/domain/entity/Category/structure/category";
import ToggleFilter from "../ToggleFilter";
import SubcategoriesOptions from "./SubcategoriesOptions";
import FilterAccordion from "../../FilterAccordion";

type Props = {
    activeSubcategory: CategoryGroup | null;
    subcategories: CategoryGroup[];
    onSelectSubcategory: (subcategory: CategoryGroup) => void;
    selectedSubcategories: CategoryGroup[];
    setActiveSubcategory: (subcategory: CategoryGroup | null) => void;
}

const SubcategoriesFiltersSection = ({
    activeSubcategory,
    subcategories,
    onSelectSubcategory,
    selectedSubcategories,
    setActiveSubcategory
}: Props) => {
    return (
        <>
            {
                !activeSubcategory ? (
                    <SubcategoriesOptions
                        subcategories={subcategories || []}
                        onSelectSubcategory={onSelectSubcategory}
                        selectedSubcategories={selectedSubcategories}
                    />
                ) : (
                    <FilterAccordion
                        title={"Subcategorías"}
                        defaultExpanded
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2 text-sm leading-5">
                                <button
                                    className="text-grayscale-400 cursor-pointer"
                                    onClick={() => setActiveSubcategory(null)}
                                >
                                    <span>Subcategorías</span>
                                </button>
                                {" / "} <span className="font-semibold text-blue-500">{activeSubcategory.name}</span>
                            </div>

                            <div className="flex flex-wrap gap-1">
                                {
                                    activeSubcategory?.subcategories?.map((subcategory) => (
                                        <ToggleFilter
                                            key={subcategory.id}
                                            onPress={() => onSelectSubcategory(subcategory)}
                                            isActive={selectedSubcategories.some((sub) => sub.id === subcategory.id) }
                                        >
                                            {subcategory.name}
                                        </ToggleFilter>
                                    ))
                                }
                            </div>
                        </div>
                    </FilterAccordion>

                )
            }
        </>
    )
}

export default SubcategoriesFiltersSection