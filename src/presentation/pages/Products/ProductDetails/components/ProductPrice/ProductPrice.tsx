"use client"

import { formatMiles } from "@/presentation/helpers/quantities";
import { Skeleton } from "@heroui/react";
import { useProductDetailsContext } from "../../context/useProductDetailsContext";
import ProductCardTag from "@/presentation/pages/Home/UseYourMiles/Products/ProductCard/ProductCardTag";

type Props = {
    basePrice: number;
    previousPrice?: number;
}

const ProductPrice = ({ basePrice, previousPrice }: Props) => {
    const { isLoading, pointsPrice, tags, hasDiscount, hasVariants } = useProductDetailsContext()
    const price = (pointsPrice || basePrice)
    const canShowPreviousPrice = hasVariants ? hasDiscount : true
    const displayedPreviousPrice =
        !isLoading && previousPrice != null && previousPrice > price && canShowPreviousPrice
            ? previousPrice
            : null

    return (
        <section aria-label="Precio en millas">
            <p className="text-sm text-grayscale-400 mb-1">Desde</p>
            {
                isLoading ? (
                    <div className="h-8 w-full max-w-25 flex items-center">
                        <Skeleton className="h-6 w-full rounded-sm bg-darkGrayishBlue-50" />
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <p className="flex items-start gap-2">
                            <data value={price} className="text-[28px] font-semibold text-blue-500 leading-8">
                                {formatMiles(price)} millas
                            </data>
                        </p>
                        <div className="flex gap-2">
                            {tags?.map((tag) => (
                                <ProductCardTag
                                    key={tag.tag}
                                    tag={tag.tag}
                                    backgroundColor={tag.backgroundColor}
                                    textColor={tag.textColor}
                                />
                            ))}
                        </div>
                    </div>
                )
            }

            {displayedPreviousPrice != null ? (
                <del className="text-xl text-blue-300 font-semibold no-underline leading-6">
                    Antes{" "}
                    <data value={displayedPreviousPrice} className="line-through">
                        {formatMiles(displayedPreviousPrice)} millas
                    </data>
                </del>
            ) : null}

        </section>
    );
};

export default ProductPrice;