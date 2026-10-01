import { cn } from "@heroui/react"
import ProductsListNoResultsIcon from "./ProductsListNoResultsIcon"

type Props = {
    hasSearchQuery?: boolean
    className?: string
}

const ProductsListNoResults = ({ hasSearchQuery = false, className }: Props) => {
    return (
        <div
            className={cn("mt-8 flex flex-col items-center justify-center gap-4 rounded-lg border border-grayscale-100 px-6 py-12 text-center min-h-[335px]", className)}
            data-testid="products-list-no-results"
        >
            {hasSearchQuery && (
                <div className="flex size-20 items-center justify-center rounded-full bg-darkGrayishBlue-100">
                    <ProductsListNoResultsIcon />
                </div>
            )}
            <output
                className="font-sans text-[20px] font-semibold leading-6 text-blue-500"
                aria-live="polite"
            >
                {hasSearchQuery
                    ? <>Intenta con otro término<br />de búsqueda</>
                    : "No hay productos disponibles por ahora."}
            </output>
        </div>
    )
}

export default ProductsListNoResults
