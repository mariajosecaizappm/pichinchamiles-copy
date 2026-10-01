import React from 'react';
import styles
    from "@/presentation/pages/ShoppingCartDetail/components/CheckoutConfirmation/CheckoutConfirmation.module.css";
import IconButton from "@/presentation/components/IconButton";
import {Icon} from "@iconify/react";
import useCheckout from "@/presentation/pages/ShoppingCartDetail/hooks/useCheckout";
import { maskedEmail, maskedPhone } from '@/presentation/helpers/member';

const CheckoutBillingAddressCard = () => {
    const { billingAddress, onPrevStep } = useCheckout();
    const billingAddressValues = [
        ["Correo electrónico", maskedEmail(billingAddress?.customerReceivingEmail)],
        ["Teléfono", maskedPhone(billingAddress?.customerReceivingPhone)],
        ["Calle principal", billingAddress?.street1],
        ["Calle secundaria", billingAddress?.street2],
        ["Sector", billingAddress?.zone.name]
    ]

    return (
        <div className="w-full">
            <h6 className={styles.addressCardTitle}>Dirección de facturación</h6>
            <div className={`${styles.addressCard} flex`}>
                <div className="min-w-0 flex-1">
                    {billingAddressValues.map(([label, value]) => (
                        <p className={`${styles.addressText} break-words`} key={label}>
                            {label}: <span>{value}</span>
                        </p>
                    ))}
                </div>
                <div className="flex items-end">
                    <IconButton type="button" onClick={()=> onPrevStep(3)}>
                        <Icon icon="mdi:pencil-outline" className="size-5" />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default CheckoutBillingAddressCard;
