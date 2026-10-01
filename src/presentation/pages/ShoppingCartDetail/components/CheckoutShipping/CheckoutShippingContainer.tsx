import React from 'react';
import CheckoutShipping from "@/presentation/pages/ShoppingCartDetail/components/CheckoutShipping/CheckoutShipping";
import useCheckout from "@/presentation/pages/ShoppingCartDetail/hooks/useCheckout";


const CheckoutShippingContainer = () => {
    const { step } = useCheckout();
    if(step !== 2) return null;

    return <CheckoutShipping />
};

export default CheckoutShippingContainer;