import React from 'react';
import CheckoutShippingAddressCard
    from "@/presentation/pages/ShoppingCartDetail/components/CheckoutConfirmation/components/CheckoutShippingAddressCard";
import CheckoutBillingAddressCard
    from "@/presentation/pages/ShoppingCartDetail/components/CheckoutConfirmation/components/CheckoutBillingAddressCard";
import useCheckout from "@/presentation/pages/ShoppingCartDetail/hooks/useCheckout";


const CheckoutConfirmation = () => {
    const { step } = useCheckout();
    if (step !== 4) return null;

    return (
        <div className="w-full">
            <h5 className="typo-main-headline-2-prelo-semi-bold text-blue-500">
                Confirmación de pedido
            </h5>
            <p className="typo-main-body-book mb-4">
                Antes de canjear valide que sus datos y sus productos estan correctos.
            </p>
            <div className="flex flex-wrap w-full gap-4 lg:px-4 lg:py-6 lg:border lg:border-grayscale-300 lg:rounded-lg">
                <CheckoutShippingAddressCard/>
                <CheckoutBillingAddressCard/>
                <p className="typo-main-caption-medium text-grayscale-400">
                    IMPORTANTE: Servicio logístico provisto por Urbano S.A. La información entregada para envíos será
                    transmitida y gestionada por Urbano S.A.
                </p>
            </div>
        </div>
    );
};

export default CheckoutConfirmation;