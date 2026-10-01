"use client";

import { ReactNode } from "react";
import { BasketItem } from "@/domain/entity/Basket/structure/basket";
import Button from "@/presentation/components/Form/components/Button/Button";
import ShoppingCartProductModalItem from "./ShoppingCartProductModalItem";

type ShoppingCartProductModalContentProps = {
    title: string;
    description: string;
    icon: ReactNode;
    basketItems: BasketItem[];
    onUpdateShoppingCart: () => void;
};

const ShoppingCartProductModalContent = ({
    title,
    description,
    icon,
    basketItems,
    onUpdateShoppingCart,
}: ShoppingCartProductModalContentProps) => {
    return (
        <div className="flex flex-col items-center">
            <div className="flex w-full flex-col gap-4 p-6">
                <div>{icon}</div>
                <h2 className="text-center text-[20px] font-semibold leading-6 text-blue-500">
                    {title}
                </h2>
                <p className="max-w-[408px] text-center text-base font-normal leading-6 text-grayscale-500">
                    {description}
                </p>
                <ul className="w-full list-none p-0">
                    {basketItems.map(basketItem => (
                        <ShoppingCartProductModalItem key={basketItem.id} basketItem={basketItem} />
                    ))}
                </ul>
            </div>
            <div className="w-full border-t border-darkGrayishBlue-300 p-6 pt-4">
                <Button color="primary" className="h-12 w-full" onPress={onUpdateShoppingCart}>
                    Actualizar carrito
                </Button>
            </div>
        </div>
    );
};

export default ShoppingCartProductModalContent;
