"use client";

import Image from "next/image";
import { BasketItem } from "@/domain/entity/Basket/structure/basket";

type ShoppingCartProductModalItemProps = {
    basketItem: BasketItem;
};

const ShoppingCartProductModalItem = ({ basketItem }: ShoppingCartProductModalItemProps) => {
    const productImage =
        basketItem.variationInfo.assets?.find(asset => asset.order === 1) ??
        basketItem.variationInfo.assets?.[0];

    return (
        <li className="flex gap-3 border-y border-darkGrayishBlue-200 p-3">
            <div className="relative h-[47px] w-[65px] shrink-0">
                {productImage?.desktopUrl ? (
                    <Image
                        src={productImage.desktopUrl}
                        alt={basketItem.variationInfo.productName}
                        fill
                        className="object-contain"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-darkGrayishBlue-100 text-[10px] text-grayscale-400">
                        Sin imagen
                    </div>
                )}
            </div>
            <div className="flex-1 space-y-1">
                <p className="text-base font-semibold leading-6 text-blue-500">
                    {basketItem.variationInfo.productName}
                </p>
                {(basketItem.variationInfo.features ?? []).map(feature => (
                    <p
                        key={`${feature.name}-${feature.option}`}
                        className="text-sm font-medium leading-5 text-blue-500"
                    >
                        <span className="capitalize">{feature.name}</span>: {feature.option}
                    </p>
                ))}
            </div>
        </li>
    );
};

export default ShoppingCartProductModalItem;
