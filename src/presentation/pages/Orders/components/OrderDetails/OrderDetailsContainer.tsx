import { Order } from "@/domain/entity/Order/order"
import OrderDetails from "./OrderDetails"
import { useCallback, useEffect, useState } from "react"
import { getShippingKey, ORDERS_BREAKPOINT } from "./OrderDetailsConfig"
import useIsDesktop from "@/presentation/hooks/useIsDesktop"

type Props = {
    order: Order
    onPressBack: () => void
}

const OrderDetailsContainer = ({ order, onPressBack }: Props) => {
    const [selectedShippingKey, setSelectedShippingKey] = useState<string | undefined>(undefined)
    const { isDesktop } = useIsDesktop(ORDERS_BREAKPOINT)
    const selectedShipping = selectedShippingKey ? order.shippingDetails.find((shipping, index) => getShippingKey(shipping, index) === selectedShippingKey) : undefined
    const product = selectedShipping?.orderLines[0]

    const handleSetSelectedShippingKey = useCallback((shippingKey: string | undefined) => {
        if (shippingKey !== undefined && isDesktop && typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
        setSelectedShippingKey(shippingKey);
    }, [isDesktop])

    useEffect(() => {
        if (!isDesktop) {
            if (selectedShippingKey) {
                setSelectedShippingKey(undefined)
            }
        } else if (!selectedShippingKey && order.shippingDetails.length > 0) {
            setSelectedShippingKey(getShippingKey(order.shippingDetails[0], 0))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDesktop])
    return (
        <OrderDetails
            order={order}
            onPressBack={onPressBack}
            isDesktop={isDesktop}
            selectedShippingKey={selectedShippingKey}
            setSelectedShippingKey={handleSetSelectedShippingKey}
            product={product}
            selectedShipping={selectedShipping}
        />
    )
}

export default OrderDetailsContainer