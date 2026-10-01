import React from 'react';
import useCheckout from "@/presentation/pages/ShoppingCartDetail/hooks/useCheckout";
import CheckoutBilling
    from "@/presentation/pages/ShoppingCartDetail/components/CheckoutBilling/CheckoutBilling";
import useSession from "@/presentation/hooks/useSession";
import {Address} from "@/domain/entity/Address/structure/address";

const CheckoutBillingContainer = () => {
    const { step, onNextStep, billingAddress, selectBillingAddress, billingFormRef } = useCheckout();
    const { member } = useSession();

    const handleSubmitBilling = (address: Address) =>{
        selectBillingAddress(address);
        onNextStep();
        window.scrollTo(0, 0);
    }

    if(step !== 3 || !member || !billingAddress) return null;

    return (
        <CheckoutBilling
            billingAddress={billingAddress}
            memberType={member.memberType}
            billingFormRef={billingFormRef}
            onSubmitBilling={handleSubmitBilling}
        />
    )
};

export default CheckoutBillingContainer;
