import { cn } from "@heroui/react"

type Props = {
    desktopFilters: React.ReactNode
    children: React.ReactNode
    className?: string
}

const ProductsCatalogLayout = ({ desktopFilters, children, className }: Props) => (
    <div className={cn("flex flex-col lg:flex-row lg:items-start lg:gap-4 lg:body-container lg:py-3", className)}>
        {desktopFilters}
        <div className="flex-1">
            {children}
        </div>
    </div>
)

export default ProductsCatalogLayout
