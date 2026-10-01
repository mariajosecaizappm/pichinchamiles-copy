import { formatMiles } from "@/presentation/helpers/quantities"
import clsx from "clsx"

type Props = {
    minPointsPrice: number
    isProductsPage: boolean
    hasPreviousPoints: boolean
    enlargePriceWithoutPrevious?: boolean
}

const PRICE_SIZE = {
    productsPage: "text-lg leading-7 lg:text-[22px] lg:leading-7",
    default: "text-[22px] leading-7",
    enlarged: "text-[28px] leading-7",
} as const

const DESDE_SIZE = {
    productsPage: "text-xs lg:text-xs",
    default: "text-xs",
    enlarged: "text-[14px]",
} as const

const getPriceSizeClass = ({
    isProductsPage,
    shouldEnlargePrice,
}: {
    isProductsPage: boolean
    shouldEnlargePrice: boolean
}) => {
    if (isProductsPage) {
        return PRICE_SIZE.productsPage
    }

    if (shouldEnlargePrice) {
        return PRICE_SIZE.enlarged
    }

    return PRICE_SIZE.default
}

const getDesdeSizeClass = ({
    isProductsPage,
    shouldEnlargePrice,
}: {
    isProductsPage: boolean
    shouldEnlargePrice: boolean
}) => {
    if (isProductsPage) {
        return DESDE_SIZE.productsPage
    }

    if (shouldEnlargePrice) {
        return DESDE_SIZE.enlarged
    }

    return DESDE_SIZE.default
}

const ProductCardMinPointsPrice = ({
    minPointsPrice,
    isProductsPage,
    hasPreviousPoints,
    enlargePriceWithoutPrevious = false,
}: Props) => {
    if (!minPointsPrice) {
        return null
    }

    const shouldEnlargePrice = enlargePriceWithoutPrevious && !hasPreviousPoints

    return (
        <p className="text-blue-500">
            <span
                className={clsx(
                    "font-medium",
                    getDesdeSizeClass({ isProductsPage, shouldEnlargePrice }),
                )}
            >
                Desde{" "}
            </span>
            <span
                className={clsx(
                    "font-semibold",
                    getPriceSizeClass({ isProductsPage, shouldEnlargePrice }),
                )}
            >
                {formatMiles(minPointsPrice)} millas
            </span>
        </p>
    )
}

export default ProductCardMinPointsPrice
