import IconArrow from "@/presentation/components/icons/IconArrow"
import { Accordion, AccordionItem, cn } from "@heroui/react"
import FilterAccordionContent from "./FilterAccordionContent"

const FILTER_ACCORDION_ITEM_KEY = "filter-accordion-item"

type Props = {
    title: string
    children: React.ReactNode
    className?: string
    contentClassName?: string
    triggerClassName?: string
    /** When true, the accordion starts expanded. Mobile drawers should pass true; desktop keeps the default (collapsed). */
    defaultExpanded?: boolean
    onExpandedChange?: (isExpanded: boolean) => void
}

const FilterAccordion = ({
    title,
    children,
    className,
    contentClassName,
    triggerClassName,
    defaultExpanded = false,
    onExpandedChange,
}: Props) => {
    return (
        <Accordion
            className={cn("px-0", className)}
            defaultExpandedKeys={defaultExpanded ? [FILTER_ACCORDION_ITEM_KEY] : []}
            onExpandedChange={(keys) => onExpandedChange?.(keys.has(FILTER_ACCORDION_ITEM_KEY))}
        >
            <AccordionItem
                indicator={IconArrow}
                title={title}
                key={FILTER_ACCORDION_ITEM_KEY}
                aria-label={title}
                classNames={{
                    indicator: "data-[open=true]:rotate-180 text-blue-500",
                    content: cn("pt-0 pb-4", contentClassName),
                    trigger: cn("py-4", triggerClassName),
                    title: "font-semibold"
                }}
            >
                <FilterAccordionContent>
                    {children}
                </FilterAccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default FilterAccordion
