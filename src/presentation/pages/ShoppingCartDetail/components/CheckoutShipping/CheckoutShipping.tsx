import React, {useEffect} from 'react';
import ShoppingCartShippingAddress
    from "@/presentation/pages/ShoppingCartDetail/components/ShoppingCartShippingAddress/ShoppingCartShippingAddress";
import useAddress from "@/presentation/hooks/useAddress";
import useCheckout from "@/presentation/pages/ShoppingCartDetail/hooks/useCheckout";

const CheckoutShipping = () => {
    const { addresses, isLoadingAddresses, onAddAddress, onEditAddress } = useAddress({fetchOnMount: true});
    const { shippingAddress, selectShippingAddress } = useCheckout();
 
    useEffect(() => {
        if(!shippingAddress && addresses.length > 0){
            const address = addresses.find(address=> address.default);
            if(address) selectShippingAddress(address);
        }
    }, [addresses, shippingAddress]);

    return (
        <ShoppingCartShippingAddress
            shippingAddress={shippingAddress}
            onSelectAddress={selectShippingAddress}
            addresses={addresses}
            isLoadingAddresses={isLoadingAddresses}
            onAddAddress={onAddAddress}
            onEditAddress={onEditAddress}

        />
    );
};

export default CheckoutShipping;
