import { Order } from "@/domain/entity/Order/order"
import { formatCopaymentAmount, formatMiles } from "@/presentation/helpers/quantities"
import { formatOrderDateLong } from "../OrderDetailsConfig"

type Props = {
    order: Order
}

const OrderDetailsHeader = ({ order }: Props) => {
    const isThirdPartyAddress = order.shippingAddress.isThirdPartyAddress
    return (
        <div className="rounded-lg border border-darkGrayishBlue-300 p-2 flex gap-2 min-h-16 leading-5 bg-white">
            <div className="flex flex-col gap-1">
                <p className="font-semibold text-blue-500">
                    Pedido: {order.orderNumber}
                </p>

                <p>{formatOrderDateLong(order.orderCreatedAt)}</p>
            </div>
            <div className="min-w-42.5 flex-1 flex flex-col text-end gap-1">
                <p className="font-semibold">
                    {formatMiles(order.totalPoints)} Millas {order.totalCoins > 0 ? `+ $${formatCopaymentAmount(order.totalCoins)}` : ''}
                </p>
                <p>
                    {isThirdPartyAddress ? 'Un tercero recibe' : 'Tú recibes'} {order.shippingDetails.length} producto{order.shippingDetails.length > 1 ? 's' : ''}
                </p>

            </div>
        </div>
    )
}

export default OrderDetailsHeader