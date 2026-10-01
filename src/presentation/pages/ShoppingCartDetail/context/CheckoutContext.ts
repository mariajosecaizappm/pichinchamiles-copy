import {createContext, RefObject} from "react";
import {Address} from "@/domain/entity/Address/structure/address";
import {FormRef} from "@/presentation/components/Form/context/Form";
import { List } from "@/domain/entity/List/list";
import { Order } from "@/domain/entity/Order/order";


export type CheckoutContextValues = {
    step: number
    onNextStep: (step?: number) => void
    onPrevStep: (step?: number) => void
    resetCheckout: () => void
    shippingAddress: Address | null
    selectShippingAddress: (address: Address) => void
    billingAddress: Address | null
    selectBillingAddress: (address: Address) => void
    billingFormRef: RefObject<FormRef | null>
    sessionId: string
    orders: List<Order> | null
}

const CheckoutContext = createContext<CheckoutContextValues>({
    step: 1,
    onNextStep: () => {},
    onPrevStep: () => {},
    resetCheckout: () => {},
    shippingAddress: null,
    selectShippingAddress: () => {},
    billingAddress: null,
    selectBillingAddress: () => {},
    billingFormRef: { current: null },
    sessionId: "",
    orders: null
})

export default CheckoutContext
