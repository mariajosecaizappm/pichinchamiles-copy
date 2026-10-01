"use client";

import Image from "next/image";
import { BasketItem } from "@/domain/entity/Basket/structure/basket";

type ShoppingCartProductImageProps = {
    item: BasketItem;
};

const ShoppingCartProductImage = ({ item }: ShoppingCartProductImageProps) => {
    const image = item.variationInfo.assets?.[0];
    const alt = image?.htmlAlternative || item.variationInfo.productName;

    return (
        <div className="flex w-full justify-center lg:w-[153px] lg:shrink-0 lg:justify-start">
            <div className="relative h-[169px] w-[230px] overflow-hidden rounded-t-lg bg-white">
                {image?.desktopUrl ? (
                    <Image src={image.desktopUrl} alt={alt} fill className="object-contain" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-darkGrayishBlue-100 text-xs text-grayscale-400">
                        Sin imagen
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingCartProductImage;
