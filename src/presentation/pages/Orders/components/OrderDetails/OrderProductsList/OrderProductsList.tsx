import { OrderProductCard } from ".."
import { Order } from "@/domain/entity/Order/order"
import { Divider } from "@heroui/react"
import { getShippingKey } from "../OrderDetailsConfig"

type Props = {
    order: Order
    setSelectedShippingKey: (shippingKey: string | undefined) => void
    isSelected: (shippingKey: string) => boolean
}

const OrderProductsList = ({ order, setSelectedShippingKey, isSelected }: Props) => {
    if (!order.shippingDetails || order.shippingDetails.length === 0) {
        return null;
    }
    return (
        <div className="rounded-lg border border-darkGrayishBlue-300 p-1 bg-white lg:max-h-[956px] overflow-y-auto">
            {
                order.shippingDetails.map((shipping, index) => {
                    const shippingKey = getShippingKey(shipping, index);
                    const orderLine = shipping.orderLines[0];
                    return (
                        <div className="flex flex-col" key={shippingKey}>
                            <OrderProductCard
                                order={order}
                                shipping={shipping}
                                orderProduct={orderLine}
                                selected={isSelected(shippingKey)}
                                onSelectOrderProduct={() => setSelectedShippingKey(shippingKey)} />
                            {
                                index < order.shippingDetails.length - 1 && (
                                    <div className="py-1 flex items-center">
                                        <Divider />
                                    </div>
                                )
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default OrderProductsList