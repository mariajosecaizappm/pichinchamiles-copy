import { formatMiles } from "@/presentation/helpers/quantities"
import clsx from "clsx"

type Props = {
    minPointsPrice: number
    unitPointsPriceWithoutDiscount: number
    isProductsPage: boolean
}

const ProductCardPreviousPointsPrice = ({
    minPointsPrice,
    unitPointsPriceWithoutDiscount,
    isProductsPage,
}: Props) => {
    if (!unitPointsPriceWithoutDiscount || minPointsPrice === unitPointsPriceWithoutDiscount) {
        return null
    }

    return (
        <p
            className={clsx(
                "font-semibold text-blue-300",
                isProductsPage ? "text-xs leading-snug" : "text-[18px] leading-7",
            )}
        >
            <span className="font-medium text-xs">
                Antes:{" "}
            </span>
            <span className={clsx("line-through", isProductsPage && "text-xs")}>
                {formatMiles(unitPointsPriceWithoutDiscount)} millas
            </span>
        </p>
    )
}

export default ProductCardPreviousPointsPrice
