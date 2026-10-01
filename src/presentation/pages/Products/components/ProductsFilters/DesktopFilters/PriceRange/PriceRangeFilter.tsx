import { Radio } from "@/presentation/components/Form/components/Radio"
import { RadioGroup } from "@heroui/react"
import FilterAccordion from "../../FilterAccordion"
import { PRICE_RANGE_OPTIONS } from "../../ProductsFiltersConfig"


type Props = {
    points: string,
    onValueChange: (value: string) => void
    isPending?: boolean,
    onPressOption: (event: React.PointerEvent<HTMLDivElement>, value: string) => void
}

const PriceRangeFilter = ({ points, onValueChange, isPending = false, onPressOption }: Props) => {
 
    return (
        <FilterAccordion className="px-4" title="Rango de precios">
            <RadioGroup value={points} onValueChange={onValueChange} isDisabled={isPending} classNames={{
                wrapper: "gap-2"
            }}>
                {PRICE_RANGE_OPTIONS.map(({ value, label }) => (
                    <div
                        key={value}
                        className="w-full"
                        onPointerDownCapture={(event) => onPressOption(event, value)}
                    >
                        <Radio value={value}>
                            {label}
                        </Radio>
                    </div>
                ))}
            </RadioGroup>
        </FilterAccordion>
    )
}

export default PriceRangeFilter