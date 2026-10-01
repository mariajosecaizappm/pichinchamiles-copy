import React, {useEffect} from 'react';
import styles from "../../CheckoutConfirmation.module.css";
import IconButton from "@/presentation/components/IconButton";
import {Icon} from "@iconify/react";
import useCheckout from "@/presentation/pages/ShoppingCartDetail/hooks/useCheckout";
import useAddress from "@/presentation/hooks/useAddress";
import { maskedPhone } from "@/presentation/helpers/member";
import { toTitleCase } from "@/presentation/helpers/text";

const CheckoutShippingAddressCard = () => {
    const { shippingAddress, selectShippingAddress } = useCheckout()
    const { addresses, onEditAddress } = useAddress();

    const shippingAddressId = shippingAddress?.id

    useEffect(() => {
        if(!shippingAddressId) return;

        const updatedAddress = addresses.find(address => address.id === shippingAddressId)
        if(updatedAddress){
            selectShippingAddress(updatedAddress);
        }
    }, [addresses, shippingAddressId, selectShippingAddress]);

    if(!shippingAddress) return null;

    const phone = shippingAddress.isThirdPartyAddress
        ? shippingAddress.customerReceivingPhone
        : shippingAddress.secondPhone;

    return (
        <div className="w-full">
            <h6 className={styles.addressCardTitle}>Dirección de envío</h6>
            <div className={`${styles.addressCard} flex`}>
                <div className="min-w-0 flex-1">
                    <p className="typo-main-caption-medium break-words">{shippingAddress.alias}</p>
                    <p className="typo-main-subtitle-semi-bold break-words">{[shippingAddress.street1, shippingAddress.number, shippingAddress.street2].join(" ")}</p>
                    <div className="typo-main-caption-book text-grayscale-400">
                        <p className="break-words">{shippingAddress.reference}</p>
                        <p>
                            {toTitleCase(shippingAddress.state.name)}, {toTitleCase(shippingAddress.city.name)}
                        </p>
                        <p>Teléfono: {maskedPhone(phone)}</p>
                    </div>
                    <p className="typo-main-caption-book">
                        {shippingAddress.isThirdPartyAddress ? 'Un tercero recibe los productos' : 'Tú recibes el producto'}
                    </p>
                </div>
                <div className="flex items-end">
                    <IconButton onClick={()=> onEditAddress(shippingAddress)} type="button">
                        <Icon icon="mdi:pencil-outline" className="size-5" />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default CheckoutShippingAddressCard;