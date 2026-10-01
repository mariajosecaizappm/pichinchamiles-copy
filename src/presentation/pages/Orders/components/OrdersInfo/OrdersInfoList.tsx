import OrderInfoCard from "./OrderInfoCard"
import { ordersInfo } from "./OrdersInfoConfig"

const OrdersInfoList = () => {
    return (
        <div className="flex flex-col gap-3">
            {
                ordersInfo.map((item) => (
                    <OrderInfoCard
                        key={item.id}
                        icon={item.icon}
                        text={item.text}
                    />
                ))
            }
        </div>
    )
}

export default OrdersInfoList