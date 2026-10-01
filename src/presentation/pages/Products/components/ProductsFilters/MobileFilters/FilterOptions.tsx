import FilterAccordion from "../FilterAccordion"
import { FilterOption } from "../types";
import ToggleFilter from "./ToggleFilter";


type Props = {
    title: string;
    options: FilterOption[];
    selectedOption: string | null;
    onSelectionChange: (value: string | null) => void;
}

const FilterOptions = ({ title, options, selectedOption, onSelectionChange }: Props) => {
    return (
        <FilterAccordion title={title} defaultExpanded>
            <div className="flex-1 flex flex-wrap gap-1">
                {options.map(({ value, label }) => (
                    <ToggleFilter
                        key={value}
                        isActive={selectedOption === value}
                        onPress={() => onSelectionChange(selectedOption === value ? null : value)}
                    >
                        {label}
                    </ToggleFilter>
                ))}
            </div>
        </FilterAccordion>
    )
}

export default FilterOptions