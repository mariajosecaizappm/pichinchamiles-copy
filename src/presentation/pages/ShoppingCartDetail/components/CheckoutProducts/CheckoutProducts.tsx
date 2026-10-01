import React, {FC} from 'react';
import ShoppingCartProductsList from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartProductsList";
import {ShoppingCartBasketState} from "@/presentation/pages/ShoppingCartDetail/hooks/useShoppingCartBasket";

type CheckoutProductsProps = {
    basketState: ShoppingCartBasketState;
}

const CheckoutProducts: FC<CheckoutProductsProps> = ({basketState}) => {
    return (
        <>
            <h1 className="text-[32px] font-semibold leading-[38px] text-blue-500">
                Carrito de compras
            </h1>
            <ShoppingCartProductsList basketState={basketState} />
        </>
    );
};

export default CheckoutProducts;