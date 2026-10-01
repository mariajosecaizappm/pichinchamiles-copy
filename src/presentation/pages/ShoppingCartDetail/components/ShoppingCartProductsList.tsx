"use client";

import { ShoppingCartBasketState } from "../hooks/useShoppingCartBasket";
import ShoppingCartProduct from "./ShoppingCartProduct";

type ShoppingCartProductsListProps = {
    basketState: ShoppingCartBasketState;
};

const ShoppingCartProductsList = ({ basketState }: ShoppingCartProductsListProps) => {
    const { items, isLoading, getMaxQuantity, onRemoveItem, onChangeQuantity, onUpdateBasketItem } =
        basketState;

    return (
        <div className="flex w-full flex-col gap-4">
            {items.map(item => (
                <ShoppingCartProduct
                    key={item.id}
                    item={item}
                    isLoading={isLoading}
                    maxQuantity={getMaxQuantity(item.id)}
                    onRemoveItem={onRemoveItem}
                    onChangeQuantity={onChangeQuantity}
                    onUpdateBasketItem={onUpdateBasketItem}
                />
            ))}
        </div>
    );
};

export default ShoppingCartProductsList;
