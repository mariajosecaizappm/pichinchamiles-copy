import { Order, OrderStatus, ShippingStatus } from "@/domain/entity/Order/order"
import IconCar2 from "@/presentation/components/icons/IconCar2"
import { formatOrderDate } from "../OrderDetails/OrderDetailsConfig"
import StatusChip from "./components/OrderStatusChip"
import styles from './OrderCardItem.module.css'

type Props = {
    order: Order,
    onSelectOrder: (order: Order) => void
    isPendingOrder?: boolean
}

const OrderCardItem = ({ order, onSelectOrder, isPendingOrder }: Props) => {
    const isThirdPartyAddress = order.shippingAddress.isThirdPartyAddress

    const handlePressOrder = () => {
        if (isPendingOrder) {
            return
        }
        onSelectOrder(order)
    }

    const resolvedStatus = (() => {
        if (order.shippingDetails.some((s) => s.shippingStatus === ShippingStatus.NOVELTY)) {
            return OrderStatus.NOVELTY
        }
        if (order.orderStatus === OrderStatus.DELIVERED) {
            return order.shippingDetails.every((s) => s.shippingStatus === ShippingStatus.DELIVERED)
                ? OrderStatus.DELIVERED
                : OrderStatus.PENDING
        }
        return order.orderStatus
    })()

    return (
        <button
            onClick={handlePressOrder}
            key={order.orderNumber} className={styles.orderCard}>
            <div className={styles.orderCardHeader}>
                <div className={styles.orderCardHeaderInfo}>
                    <span className={styles.orderCardHeaderIcon}>
                        <IconCar2 />
                    </span>
                    <p className="leading-5 font-semibold">
                        {formatOrderDate(order.orderCreatedAt)}
                    </p>
                </div>
                <StatusChip status={resolvedStatus} />
            </div>
            <div className={styles.orderCardBody}>
                <p className="text-sm leading-5 font-medium">
                    {isThirdPartyAddress ? 'Un tercero recibe' : 'Tú recibes'} {order.shippingDetails.length} producto{order.shippingDetails.length > 1 ? 's' : ''}
                </p>
                <p className={styles.orderCardBodyInfo}>
                    Pedido #{order.orderNumber}
                </p>
            </div>
        </button>
    )
}

export default OrderCardItem