import React, {FC, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import CheckoutContext, {CheckoutContextValues} from "@/presentation/pages/ShoppingCartDetail/context/CheckoutContext";
import {Address} from "@/domain/entity/Address/structure/address";
import useSession from "@/presentation/hooks/useSession";
import {formatBillingAddress} from "@/presentation/helpers/formatBillingAddress";
import {FormRef} from "@/presentation/components/Form/context/Form";
import useKount from "@/presentation/hooks/useKount";
import container from '@/presentation/config/inversify.config';
import GetOrdersUseCase from '@/domain/interactors/Order/GetOrdersUseCase';
import UseCaseTypes from '@/domain/entity/Types/UseCaseTypes';
import { List } from '@/domain/entity/List/list';
import { Order } from '@/domain/entity/Order/order';
import useAnalytics from "@/presentation/hooks/useAnalytics";
import {EventName} from "@/presentation/analytics/types";

const CheckoutProvider: FC<PropsWithChildren> = ({children}) => {
    const { member, basket } = useSession();
    const [step, setStep] = useState(1);
    const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
    const [billingAddress, setBillingAddress] = useState<Address | null>(null);
    const [orders, setOrders] = useState<List<Order> | null>(null);
    const { sessionId } = useKount();
    const { track } = useAnalytics();
    const billingFormRef = useRef<FormRef | null>(null);
    const enrollmentEmail = member && "enrollmentEmail" in member ? member.enrollmentEmail : "";
    const handleNextStep = (nextStep?: number) =>{
        if(step < 4){
            setStep(nextStep || step + 1);
        }
    }

    const handlePrevStep = (nextStep?: number) =>{
        if(step > 1){
            setStep(nextStep || step - 1);
        }
    }

    const handleResetCheckout = () => {
        setStep(1);
        setShippingAddress(null);
        setBillingAddress(null);
    }

    const getOrders = async () => {
        try {
            const ordersUseCase = container.get<GetOrdersUseCase>(UseCaseTypes.GetOrdersUseCase);
            const orders = await ordersUseCase.getOrderHistory({})
            setOrders(orders);
            return orders;
        } catch {
            setOrders(null);
        }
    }

    useEffect(() => {
        if (!member || !shippingAddress || billingAddress) return;

        setBillingAddress(prev => {
            if (!prev || prev.id !== shippingAddress.id) {
                return formatBillingAddress(member, shippingAddress);
            }

            return prev;
        });
    }, [member, shippingAddress, billingAddress]);

    const selectShippingAddress = useCallback((address: Address) => {
        setShippingAddress({
            ...address,
            customerReceivingEmail: enrollmentEmail,
        });
    }, [enrollmentEmail]);

    const values: CheckoutContextValues = useMemo(()=>{
        return {
            step,
            onNextStep: handleNextStep,
            onPrevStep: handlePrevStep,
            resetCheckout: handleResetCheckout,
            shippingAddress,
            selectShippingAddress,
            billingAddress,
            selectBillingAddress: setBillingAddress,
            billingFormRef,
            sessionId,
            orders
        }
    }, [step, shippingAddress, billingAddress, sessionId, selectShippingAddress])

    return (
        <CheckoutContext.Provider value={values}>
            {children}
        </CheckoutContext.Provider>
    );
};

export default CheckoutProvider;
