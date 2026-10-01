import { Product } from "@/domain/entity/Product/product"
import AssetImage from "@/presentation/components/AssetImage"
import links from "@/presentation/config/links"
import clsx from "clsx"
import Link from "next/link"
import { buildProductAriaLabel } from "./buildProductAriaLabel"
import ProductCardMinPointsPrice from "./ProductCardMinPointsPrice"
import ProductCardPreviousPointsPrice from "./ProductCardPreviousPointsPrice"
import ProductCardTags from "./ProductCardTags"
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";
import { getPrimaryAsset } from "@/presentation/helpers/asset"

export type ProductCardVariant = "default" | "products-page"

type Props = {
    product: Product
    variant?: ProductCardVariant
    enlargePriceWithoutPrevious?: boolean
}

const ProductCard = ({
    product,
    variant = "default",
    enlargePriceWithoutPrevious = false,
}: Props) => {
    const isProductsPage = variant === "products-page"
    const hasPreviousPoints = Boolean(
        product.unitPointsPriceWithoutDiscount &&
            product.minPointsPrice !== product.unitPointsPriceWithoutDiscount,
    )
    const { track } = useAnalytics();

    const productImage = getPrimaryAsset(product.assets)

    return (
        <Link
            className="block h-full w-full"
            href={`${links.productsList}/${product.slug}`}
            aria-label={buildProductAriaLabel(product)}
            onClick={()=> track(EventName.CLICKED_PRODUCT, {product})}
        >
            <div
                className={clsx(
                    "h-full flex rounded-lg border border-darkGrayishBlue-500 overflow-hidden text-left bg-white",
                    isProductsPage
                        ? "min-h-[150px] flex-row gap-0 p-0 lg:min-h-[311px] lg:flex-col max-w-none w-full"
                        : "flex-col max-w-62.5 justify-between lg:w-62.5 lg:h-[337px]",
                )}
            >
                <div
                    className={clsx(
                        "relative shrink-0",
                        isProductsPage ? "w-[140px] lg:w-full" : "w-full",
                    )}
                >
                    <ProductCardTags tags={product.tags ?? []} isProductsPage={isProductsPage} />
                    {productImage && (
                        <AssetImage
                            asset={productImage}
                            alt={product.name}
                            width={767}
                            height={565}
                            breakpoint={640}
                            className={clsx(
                                "object-contain shrink-0 h-[155px]",
                                isProductsPage
                                    ? "w-[140px] h-[150px] lg:h-[155px] lg:w-full"
                                    : "w-full",
                            )}
                        />
                    )}
                </div>
                <div
                    className={clsx(
                        "flex flex-1 flex-col gap-1 min-h-39",
                        isProductsPage
                            ? "py-2 px-1 justify-center lg:justify-between lg:px-5 lg:py-4"
                            : "px-5 py-4 justify-end",
                    )}
                    aria-hidden="true"
                >
                    <p
                        className={clsx(
                            "line-clamp-2 text-blue-500",
                            isProductsPage
                                ? "text-xs leading-snug lg:text-[22px] lg:leading-7"
                                : "text-[22px] leading-7",
                            !isProductsPage && !hasPreviousPoints && "mb-4",
                            !isProductsPage && hasPreviousPoints && "mb-2",
                        )}
                    >
                        {product.name}
                    </p>
                    {isProductsPage && (
                        <p
                            className={clsx(
                                "font-medium text-grayscale-400",
                                isProductsPage ? "text-xs lg:text-sm" : "text-sm",
                            )}
                        >
                            {product.brand.name}
                        </p>
                    )}
                    <ProductCardMinPointsPrice
                        minPointsPrice={product.minPointsPrice}
                        isProductsPage={isProductsPage}
                        hasPreviousPoints={hasPreviousPoints}
                        enlargePriceWithoutPrevious={enlargePriceWithoutPrevious}
                    />
                    <ProductCardPreviousPointsPrice
                        minPointsPrice={product.minPointsPrice}
                        unitPointsPriceWithoutDiscount={product.unitPointsPriceWithoutDiscount}
                        isProductsPage={isProductsPage}
                    />
                    <p
                        className={clsx(
                            "font-medium",
                            isProductsPage ? "text-[11px] lg:text-xs" : "text-xs",
                        )}
                    >
                        También puedes pagar millas + tarjeta
                    </p>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard
