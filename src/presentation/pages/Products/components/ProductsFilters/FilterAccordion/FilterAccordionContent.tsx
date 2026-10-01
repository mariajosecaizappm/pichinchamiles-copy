
type Props = {
    children: React.ReactNode
}

const FilterAccordionContent = ({ children }: Props) => {
    return (
        <div className="flex flex-wrap gap-1">
            {children}
        </div>
    )
}

export default FilterAccordionContent